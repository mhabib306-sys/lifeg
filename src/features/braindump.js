// ============================================================================
// BRAINDUMP MODULE — Intelligent text capture & classification engine
// ============================================================================
// Three-phase pipeline:
//   1. segmentText()     — split raw text into individual items
//   2. classifyItem()    — score each item as task vs note
//   3. extractMetadata() — pull out #area, @tag, &person, dates
//
// Public API:
//   parseBraindump(rawText) → array of parsed items
//   submitBraindumpItems(items) → creates tasks/notes, returns counts

import { state } from '../state.js';
import { createTask } from './tasks.js';
import { saveTasksData } from '../data/storage.js';
import { BRAINDUMP_ACTION_VERBS } from '../constants.js';

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
// Phase 2 — Classify an item as task or note
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
// Phase 3 — Extract metadata from text
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
// Orchestrator — Parse raw text into structured items
// ============================================================================

export function parseBraindump(rawText) {
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
