// ============================================================================
// Markdown Export Module — Human-readable backup as .md files in a zip
// ============================================================================

import JSZip from 'jszip';
import { state } from '../state.js';
import { APP_VERSION } from '../constants.js';
import { getLocalDateString } from '../utils.js';
import { getAreaById, getCategoryById, getLabelById, getPersonById } from '../features/areas.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function sanitizeFilename(name) {
  if (!name) return 'Untitled';
  return name
    // eslint-disable-next-line no-control-regex
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 100) || 'Untitled';
}

function formatDuration(minutes) {
  if (!minutes) return '';
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h${m}m` : `${h}h`;
}

function formatTaskLine(task) {
  const checkbox = task.completed ? '[x]' : '[ ]';
  let line = `- ${checkbox} ${task.title || 'Untitled'}`;

  const tags = [];

  if (task.dueDate) tags.push(`@due(${task.dueDate})`);
  if (task.deferDate) tags.push(`@defer(${task.deferDate})`);

  if (task.labels && task.labels.length) {
    for (const labelId of task.labels) {
      const label = getLabelById(labelId);
      if (label) tags.push(`#${label.name}`);
    }
  }

  if (task.people && task.people.length) {
    for (const personId of task.people) {
      const person = getPersonById(personId);
      if (person) tags.push(`@${person.name}`);
    }
  }

  if (task.flagged) tags.push('!flagged');
  if (task.timeEstimate) tags.push(`\u23F1${formatDuration(task.timeEstimate)}`);
  if (task.completed && task.completedAt) {
    const dateStr = task.completedAt.slice(0, 10);
    tags.push(`@completed(${dateStr})`);
  }

  if (tags.length) line += ' ' + tags.join(' ');
  return line;
}

// ---------------------------------------------------------------------------
// Task grouping & rendering
// ---------------------------------------------------------------------------

function getTasks() {
  return state.tasksData.filter(t => !t.isNote && t.noteLifecycleState !== 'deleted');
}

function getNotes() {
  return state.tasksData.filter(t => t.isNote && t.noteLifecycleState !== 'deleted');
}

function groupTasksByArea(tasks) {
  const groups = new Map(); // areaId -> tasks[]
  for (const task of tasks) {
    const key = task.areaId || '__inbox__';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(task);
  }
  return groups;
}

function groupTasksByCategory(tasks) {
  const groups = new Map(); // categoryId -> tasks[]
  for (const task of tasks) {
    const key = task.categoryId || '__uncategorized__';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(task);
  }
  return groups;
}

function getChildTasks(parentId, allTasks) {
  return allTasks
    .filter(t => t.parentId === parentId)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

function renderTaskWithChildren(task, allTasks, indent = 0) {
  const prefix = '  '.repeat(indent);
  const lines = [];
  lines.push(prefix + formatTaskLine(task));

  // Task notes as blockquote
  if (task.notes) {
    const noteLines = task.notes.split('\n');
    for (const nl of noteLines) {
      lines.push(prefix + '  > ' + nl);
    }
  }

  // Render children (project sub-tasks)
  const children = getChildTasks(task.id, allTasks);
  for (const child of children) {
    lines.push(...renderTaskWithChildren(child, allTasks, indent + 1));
  }

  return lines;
}

function renderTaskSection(tasks, allTasks) {
  const lines = [];
  // Separate by status: Anytime/Today → Someday → Completed
  const anytime = tasks.filter(t => !t.completed && t.status !== 'someday' && !t.parentId);
  const someday = tasks.filter(t => !t.completed && t.status === 'someday' && !t.parentId);
  const completed = tasks.filter(t => t.completed && !t.parentId);

  if (anytime.length) {
    for (const task of anytime) {
      lines.push(...renderTaskWithChildren(task, allTasks));
    }
  }

  if (someday.length) {
    lines.push('');
    lines.push('#### Someday');
    lines.push('');
    for (const task of someday) {
      lines.push(...renderTaskWithChildren(task, allTasks));
    }
  }

  if (completed.length) {
    lines.push('');
    lines.push('#### Completed');
    lines.push('');
    for (const task of completed) {
      lines.push(...renderTaskWithChildren(task, allTasks));
    }
  }

  return lines;
}

// ---------------------------------------------------------------------------
// File generators
// ---------------------------------------------------------------------------

function generateReadme(stats) {
  const lines = [
    '# Homebase Export',
    '',
    `Exported on **${getLocalDateString()}** from Homebase v${APP_VERSION}.`,
    '',
    '## Counts',
    '',
    `- **Tasks:** ${stats.taskCount}`,
    `- **Notes:** ${stats.noteCount}`,
    `- **Areas:** ${stats.areaCount}`,
    `- **Labels:** ${stats.labelCount}`,
    `- **People:** ${stats.personCount}`,
    '',
    '## Structure',
    '',
    '- `Inbox.md` — Tasks with no area assigned',
  ];
  for (const name of stats.areaNames) {
    lines.push(`- \`${sanitizeFilename(name)}.md\` — ${name}`);
  }
  if (stats.noteCount > 0) {
    lines.push('- `Notes/` — Note pages from the outliner');
  }
  lines.push('');
  return lines.join('\n');
}

function generateAreaFile(area, tasks, allTasks) {
  const lines = [];
  const emoji = area.emoji ? area.emoji + ' ' : '';
  lines.push(`# ${emoji}${area.name}`);
  lines.push('');

  const byCat = groupTasksByCategory(tasks);

  // Render uncategorized first
  const uncategorized = byCat.get('__uncategorized__');
  if (uncategorized) {
    lines.push(...renderTaskSection(uncategorized, allTasks));
    lines.push('');
  }

  // Then each category
  for (const [catId, catTasks] of byCat) {
    if (catId === '__uncategorized__') continue;
    const cat = getCategoryById(catId);
    const catEmoji = cat?.emoji ? cat.emoji + ' ' : '';
    const catName = cat ? cat.name : 'Unknown Category';
    lines.push(`## ${catEmoji}${catName}`);
    lines.push('');
    lines.push(...renderTaskSection(catTasks, allTasks));
    lines.push('');
  }

  return lines.join('\n');
}

function generateInboxFile(tasks, allTasks) {
  const lines = [];
  lines.push('# Inbox');
  lines.push('');
  lines.push(...renderTaskSection(tasks, allTasks));
  lines.push('');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Notes export
// ---------------------------------------------------------------------------

function getNoteChildren(noteId, allNotes) {
  return allNotes
    .filter(n => n.parentId === noteId)
    .sort((a, b) => (a.noteOrder || a.order || 0) - (b.noteOrder || b.order || 0));
}

function renderNoteTree(note, allNotes, indent = 0) {
  const prefix = '  '.repeat(indent);
  const bullet = note.completed ? '- [x]' : '-';
  const title = note.title || '';
  const lines = [];
  lines.push(`${prefix}${bullet} ${title}`);

  // Note body as indented text
  if (note.notes) {
    for (const line of note.notes.split('\n')) {
      lines.push(`${prefix}  ${line}`);
    }
  }

  const children = getNoteChildren(note.id, allNotes);
  for (const child of children) {
    lines.push(...renderNoteTree(child, allNotes, indent + 1));
  }

  return lines;
}

function generateNoteFile(rootNote, allNotes) {
  const title = rootNote.title || 'Untitled Note';
  const lines = [];
  lines.push(`# ${title}`);
  lines.push('');

  // Note body
  if (rootNote.notes) {
    lines.push(rootNote.notes);
    lines.push('');
  }

  // Render children
  const children = getNoteChildren(rootNote.id, allNotes);
  for (const child of children) {
    lines.push(...renderNoteTree(child, allNotes, 0));
  }

  lines.push('');
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export async function exportMarkdown() {
  const zip = new JSZip();

  const allTasks = getTasks();
  const allNotes = getNotes();

  // Group tasks by area
  const byArea = groupTasksByArea(allTasks);

  // Generate area files
  const areaNames = [];
  for (const [areaId, tasks] of byArea) {
    if (areaId === '__inbox__') continue;
    const area = getAreaById(areaId);
    if (!area) continue;
    areaNames.push(area.name);
    const content = generateAreaFile(area, tasks, allTasks);
    zip.file(sanitizeFilename(area.name) + '.md', content);
  }

  // Generate Inbox file
  const inboxTasks = byArea.get('__inbox__') || [];
  if (inboxTasks.length) {
    zip.file('Inbox.md', generateInboxFile(inboxTasks, allTasks));
  }

  // Generate Note files
  const rootNotes = allNotes.filter(n => !n.parentId);
  rootNotes.sort((a, b) => (a.noteOrder || a.order || 0) - (b.noteOrder || b.order || 0));
  const notesFolder = zip.folder('Notes');
  for (const rootNote of rootNotes) {
    const title = sanitizeFilename(rootNote.title || 'Untitled Note');
    notesFolder.file(title + '.md', generateNoteFile(rootNote, allNotes));
  }

  // Generate README
  const stats = {
    taskCount: allTasks.length,
    noteCount: allNotes.length,
    areaCount: state.taskAreas.length,
    labelCount: state.taskLabels.length,
    personCount: state.taskPeople.length,
    areaNames,
  };
  zip.file('README.md', generateReadme(stats));

  // Generate and download
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `homebase-export-${getLocalDateString()}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}
