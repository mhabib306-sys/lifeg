// ============================================================================
// BRAINDUMP MODULE — Intelligent text capture & classification engine
// ============================================================================
// Two classification paths:
//   1. AI (Claude API) — splits compound text, classifies, extracts metadata
//   2. Heuristic fallback — rule-based scoring when no API key configured
//
// Public API:
//   parseBraindump(rawText) → Promise<array of parsed items>
//   parseBraindumpHeuristic(rawText) → array of parsed items (sync)
//   submitBraindumpItems(items) → creates tasks/notes, returns counts
//   getAnthropicKey() / setAnthropicKey(key) — API key management

import { state } from '../state.js';
import { createTask } from './tasks.js';
import { saveTasksData } from '../data/storage.js';
import { BRAINDUMP_ACTION_VERBS, ANTHROPIC_KEY } from '../constants.js';

// ============================================================================
// Anthropic API Key Management
// ============================================================================

export function getAnthropicKey() {
  return localStorage.getItem(ANTHROPIC_KEY) || '';
}

export function setAnthropicKey(key) {
  const trimmed = (key || '').trim();
  if (trimmed) {
    localStorage.setItem(ANTHROPIC_KEY, trimmed);
  } else {
    localStorage.removeItem(ANTHROPIC_KEY);
  }
}

export async function refineVoiceTranscriptWithAI(rawTranscript) {
  const text = (rawTranscript || '').trim();
  if (!text) return '';
  const apiKey = getAnthropicKey();
  if (!apiKey) return text;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: 'You clean up speech-to-text output for a productivity app. Fix punctuation/casing and preserve the original meaning. Return only cleaned plain text.',
        messages: [{ role: 'user', content: text }],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    if (!response.ok) return text;
    const data = await response.json();
    const cleaned = (data?.content?.[0]?.text || '').trim();
    return cleaned || text;
  } catch {
    clearTimeout(timeoutId);
    return text;
  }
}

// ============================================================================
// AI Classification via Claude API
// ============================================================================

/**
 * Call Claude API to intelligently split, classify, and extract metadata.
 * Returns array of parsed items matching the heuristic shape.
 * Throws on error (caller should catch and fallback).
 */
async function classifyWithAI(rawText) {
  const apiKey = getAnthropicKey();
  if (!apiKey) throw new Error('No API key configured');

  // Gather user's areas, tags, people for the prompt
  const areas = state.taskCategories.map(c => c.name);
  const tags = state.taskLabels.map(l => l.name);
  const people = state.taskPeople.map(p => p.name);

  const systemPrompt = `You are a classification assistant for a personal productivity app. Your job is to take raw freeform text and split it into individual items, then classify each as a task OR a note.

The user has these Areas: ${JSON.stringify(areas)}
The user has these Tags: ${JSON.stringify(tags)}
The user has these People: ${JSON.stringify(people)}

Rules:
1. SPLIT compound paragraphs into separate items. If a sentence contains multiple actions or distinct thoughts, split them.
2. CLASSIFY each item as "task" or "note":
   - TASK: a forward-looking action the user needs to DO. Contains imperatives, obligations, or explicit intent to act. Examples: "Buy groceries", "Call dentist", "Need to finish report by Friday".
   - NOTE: anything that is NOT a clear action. This includes: observations ("missed my vitamins today"), reflections ("feeling tired lately"), ideas ("maybe try a standing desk"), facts ("meeting was moved to 3pm"), journal entries ("had a great workout"), questions ("what's the best protein powder?"), references, or bookmarks.
   - When in doubt, prefer "note". Only classify as "task" when there is a clear, unambiguous action to perform.
   - Past-tense statements are almost always notes — do NOT convert them into tasks. "Missed taking vitamins" is a note, NOT a task to "Take vitamins".
3. EXTRACT metadata by matching against the provided lists:
   - area: match to one of the user's Areas (exact name, case-insensitive). null if no match.
   - tags: array of matched Tag names. Empty array if none.
   - people: array of matched People names. Empty array if none.
   - deferDate: if a start/defer date is mentioned, return YYYY-MM-DD. null otherwise.
   - dueDate: if a deadline/due date is mentioned, return YYYY-MM-DD. null otherwise.
4. Provide a CONFIDENCE score 0.0-1.0 for each classification.
5. Clean up the title: remove metadata markers (#, @, &, !) but PRESERVE the original meaning and tense. For tasks, make it a clean action. For notes, keep it as the user wrote it — do NOT rewrite notes into actions.

Today's date is ${new Date().toISOString().split('T')[0]}.

Respond with ONLY valid JSON — no markdown, no explanation. The JSON must be an array of objects:
[
  {
    "title": "Clean title preserving original intent",
    "type": "task" or "note",
    "confidence": 0.0-1.0,
    "area": "Area Name" or null,
    "tags": ["Tag Name", ...],
    "people": ["Person Name", ...],
    "deferDate": "YYYY-MM-DD" or null,
    "dueDate": "YYYY-MM-DD" or null
  }
]`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 4096,
        system: systemPrompt,
        messages: [
          { role: 'user', content: rawText }
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errBody = await response.text().catch(() => '');
      throw new Error(`API error ${response.status}: ${errBody}`);
    }

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    // Parse JSON from response (handle potential markdown wrapping)
    let jsonStr = text.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '');
    }

    const items = JSON.parse(jsonStr);
    if (!Array.isArray(items)) throw new Error('Response is not an array');

    // Map AI results to our item shape
    return items.map((item, index) => {
      // Resolve area name to ID
      let categoryId = null;
      if (item.area) {
        const cat = state.taskCategories.find(
          c => c.name.toLowerCase() === item.area.toLowerCase()
        );
        if (cat) categoryId = cat.id;
      }

      // Resolve tag names to IDs
      const labelIds = (item.tags || [])
        .map(name => {
          const label = state.taskLabels.find(
            l => l.name.toLowerCase() === name.toLowerCase()
          );
          return label ? label.id : null;
        })
        .filter(Boolean);

      // Resolve people names to IDs
      const personIds = (item.people || [])
        .map(name => {
          const person = state.taskPeople.find(
            p => p.name.toLowerCase() === name.toLowerCase()
          );
          return person ? person.id : null;
        })
        .filter(Boolean);

      return {
        index,
        originalText: item.title || '',
        title: item.title || '',
        type: item.type === 'note' ? 'note' : 'task',
        score: item.type === 'task' ? 50 : -50,
        confidence: Math.max(0, Math.min(1, item.confidence || 0.8)),
        categoryId,
        labels: labelIds,
        people: personIds,
        deferDate: item.deferDate || null,
        dueDate: item.dueDate || null,
        included: true,
      };
    });
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// ============================================================================
// Phase 1 — Segment raw text into individual items
// ============================================================================

export function segmentText(rawText) {
  if (!rawText || !rawText.trim()) return [];

  const lines = rawText.split('\n');
  const items = [];

  for (const line of lines) {
    // Strip leading bullet chars: - * • ‣ ◦ and numbered lists like "1. " "2) "
    let cleaned = line.replace(/^\s*[-*•‣◦]\s+/, '').replace(/^\s*\d+[.)]\s+/, '').trim();
    if (cleaned) {
      items.push(cleaned);
    }
  }

  return items;
}

// ============================================================================
// Phase 2 — Classify an item as task or note (heuristic)
// ============================================================================

/**
 * Weighted scoring: positive = task, negative = note
 * Returns { type: 'task'|'note', score, confidence }
 */
export function classifyItem(text) {
  let score = 0;
  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);
  const firstWord = words[0] || '';

  // ---- Task signals ----

  // Starts with an action verb (+40)
  if (BRAINDUMP_ACTION_VERBS.includes(firstWord)) {
    score += 40;
  }

  // Deadline language: "by friday", "due", "deadline", "before"
  if (/\b(by\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday|tomorrow|next|end\s+of))\b/i.test(text) ||
      /\b(due|deadline|before)\b/i.test(text)) {
    score += 30;
  }

  // Obligation language: "need to", "must", "have to", "should"
  if (/\b(need\s+to|must|have\s+to|should)\b/i.test(text)) {
    score += 25;
  }

  // !date syntax (our app's date shorthand)
  if (/!\w/.test(text)) {
    score += 35;
  }

  // Imperative short sentence (under 12 words, no question mark)
  if (words.length <= 12 && !text.includes('?') && BRAINDUMP_ACTION_VERBS.includes(firstWord)) {
    score += 20;
  }

  // Person reference with & syntax
  if (/&\w/.test(text)) {
    score += 15;
  }

  // Time markers: "today", "tonight", "this week", "this morning", "asap"
  if (/\b(today|tonight|this\s+(week|morning|afternoon|evening)|asap|urgently)\b/i.test(text)) {
    score += 10;
  }

  // # area marker
  if (/^#\w|[\s]#\w/.test(text)) {
    score += 10;
  }

  // @ tag marker
  if (/^@\w|[\s]@\w/.test(text)) {
    score += 10;
  }

  // ---- Note signals ----

  // Starts with "Note:", "Idea:", "Thought:", "Remember:"
  if (/^(note|idea|thought|remember|observation|insight|reflection):/i.test(text)) {
    score -= 50;
  }

  // Past-tense / observational language: "missed", "forgot", "didn't", "wasn't", "had a", "went to"
  if (/\b(missed|forgot|forgotten|didn't|didn't|wasn't|wasn't|couldn't|couldn't|had\s+a|went\s+to|was\s+\w+ing|felt\s+|noticed\s+|realized\s+|found\s+out)\b/i.test(text)) {
    score -= 35;
  }

  // Starts with "I" + past tense (journal-style: "I missed...", "I had...", "I went...")
  if (/^i\s+(missed|forgot|had|was|went|felt|saw|heard|met|got|did|made|took|came|ran|ate|slept)\b/i.test(text)) {
    score -= 30;
  }

  // Multi-sentence (contains period followed by capital letter)
  if (/\.\s+[A-Z]/.test(text)) {
    score -= 30;
  }

  // Reflective language
  if (/\b(i\s+think|i\s+feel|i\s+wonder|perhaps|maybe|it\s+seems|i\s+believe|in\s+my\s+opinion)\b/i.test(text)) {
    score -= 25;
  }

  // Question
  if (text.trim().endsWith('?')) {
    score -= 20;
  }

  // Starts with article (less action-oriented)
  if (/^(the|a|an|this|that|these|those)\s/i.test(text)) {
    score -= 15;
  }

  // URL only (bookmarking, not a task)
  if (/^https?:\/\/\S+$/i.test(text.trim())) {
    score -= 40;
  }

  // Quotation (starts with " or ')
  if (/^["'"'\u201C\u2018]/.test(text.trim())) {
    score -= 30;
  }

  const type = score > 0 ? 'task' : 'note';
  const confidence = Math.min(1, Math.abs(score) / 60);

  return { type, score, confidence };
}

// ============================================================================
// Phase 3 — Extract metadata from text (heuristic)
// ============================================================================

/**
 * Extract #area, @tag, &person, and date phrases.
 * Returns { title, categoryId, labels[], people[], deferDate }
 */
export function extractMetadata(text) {
  let title = text;
  let categoryId = null;
  const labels = [];
  const people = [];
  let deferDate = null;
  let dueDate = null;

  // Extract #area references
  const areaMatches = title.match(/#(\w+)/g);
  if (areaMatches) {
    for (const match of areaMatches) {
      const name = match.slice(1).toLowerCase();
      const cat = state.taskCategories.find(c => c.name.toLowerCase() === name);
      if (cat) {
        categoryId = cat.id;
        title = title.replace(match, '').trim();
      }
    }
  }

  // Extract @tag references
  const tagMatches = title.match(/@(\w+)/g);
  if (tagMatches) {
    for (const match of tagMatches) {
      const name = match.slice(1).toLowerCase();
      const label = state.taskLabels.find(l => l.name.toLowerCase() === name);
      if (label && !labels.includes(label.id)) {
        labels.push(label.id);
        title = title.replace(match, '').trim();
      }
    }
  }

  // Extract &person references
  const personMatches = title.match(/&(\w+)/g);
  if (personMatches) {
    for (const match of personMatches) {
      const name = match.slice(1).toLowerCase();
      const person = state.taskPeople.find(p => p.name.toLowerCase() === name);
      if (person && !people.includes(person.id)) {
        people.push(person.id);
        title = title.replace(match, '').trim();
      }
    }
  }

  // Extract !date references using parseDateQuery
  const dateMatches = title.match(/!(\w+)/g);
  if (dateMatches && typeof window.parseDateQuery === 'function') {
    for (const match of dateMatches) {
      const query = match.slice(1);
      const result = window.parseDateQuery(query);
      if (result) {
        deferDate = result;
        title = title.replace(match, '').trim();
        break; // Only use first date match
      }
    }
  }

  // Extract natural language date phrases: "tomorrow", "next monday", "by friday"
  const datePatterns = [
    { regex: /\b(tomorrow)\b/i, query: 'tomorrow' },
    { regex: /\b(today)\b/i, query: 'today' },
    { regex: /\bnext\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i, query: null },
    { regex: /\bby\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i, query: null },
  ];

  if (!deferDate && typeof window.parseDateQuery === 'function') {
    for (const { regex, query } of datePatterns) {
      const match = title.match(regex);
      if (match) {
        const dateQuery = query || match[1];
        const result = window.parseDateQuery(dateQuery);
        if (result) {
          dueDate = result;
          // Don't strip natural language dates from title — they're contextual
          break;
        }
      }
    }
  }

  // Clean up extra whitespace
  title = title.replace(/\s{2,}/g, ' ').trim();

  return { title, categoryId, labels, people, deferDate, dueDate };
}

// ============================================================================
// Heuristic Orchestrator — Parse raw text (sync, rule-based)
// ============================================================================

export function parseBraindumpHeuristic(rawText) {
  const segments = segmentText(rawText);
  return segments.map((text, index) => {
    const classification = classifyItem(text);
    const metadata = extractMetadata(text);
    return {
      index,
      originalText: text,
      title: metadata.title,
      type: classification.type,
      score: classification.score,
      confidence: classification.confidence,
      categoryId: metadata.categoryId,
      labels: metadata.labels,
      people: metadata.people,
      deferDate: metadata.deferDate,
      dueDate: metadata.dueDate,
      included: true,
    };
  });
}

// ============================================================================
// Main Orchestrator — AI first, heuristic fallback (async)
// ============================================================================

export async function parseBraindump(rawText) {
  // Clear previous error
  state.braindumpAIError = null;

  // If no API key, skip AI entirely
  if (!getAnthropicKey()) {
    return parseBraindumpHeuristic(rawText);
  }

  try {
    const items = await classifyWithAI(rawText);
    if (items && items.length > 0) return items;
    // Empty result from AI — fall through to heuristic
    state.braindumpAIError = 'AI returned empty results';
  } catch (err) {
    console.warn('AI classification failed, falling back to heuristic:', err.message);
    state.braindumpAIError = err.message;
  }

  return parseBraindumpHeuristic(rawText);
}

// ============================================================================
// Submit — Create tasks/notes from parsed items
// ============================================================================

export function submitBraindumpItems(items) {
  let taskCount = 0;
  let noteCount = 0;

  const included = items.filter(item => item.included);

  for (const item of included) {
    const isNote = item.type === 'note';
    createTask(item.title, {
      isNote,
      categoryId: item.categoryId,
      labels: item.labels,
      people: item.people,
      deferDate: item.deferDate,
      dueDate: item.dueDate,
      status: item.categoryId ? 'anytime' : 'inbox',
    });
    if (isNote) noteCount++;
    else taskCount++;
  }

  return { taskCount, noteCount };
}
