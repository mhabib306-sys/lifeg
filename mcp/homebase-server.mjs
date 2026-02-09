#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const ROOT = process.cwd();
const DATA_PATH = process.env.HOMEBASE_DATA_PATH || path.join(ROOT, 'data.json');
const PROTOCOL_VERSION = '2024-11-05';
const SERVER_NAME = 'homebase-mcp';
const SERVER_VERSION = '1.0.0';

function nowIso() {
  return new Date().toISOString();
}

function readData() {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      ...parsed,
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      deletedTaskTombstones: parsed.deletedTaskTombstones && typeof parsed.deletedTaskTombstones === 'object'
        ? parsed.deletedTaskTombstones
        : {},
      meetingNotesByEvent: parsed.meetingNotesByEvent && typeof parsed.meetingNotesByEvent === 'object'
        ? parsed.meetingNotesByEvent
        : {},
      taskCategories: Array.isArray(parsed.taskCategories) ? parsed.taskCategories : [],
      taskLabels: Array.isArray(parsed.taskLabels) ? parsed.taskLabels : [],
      taskPeople: Array.isArray(parsed.taskPeople) ? parsed.taskPeople : [],
    };
  } catch (err) {
    if (err.code === 'ENOENT') {
      return {
        lastUpdated: nowIso(),
        data: {},
        tasks: [],
        deletedTaskTombstones: {},
        meetingNotesByEvent: {},
        taskCategories: [],
        taskLabels: [],
        taskPeople: [],
      };
    }
    throw err;
  }
}

function writeData(nextData) {
  const payload = {
    ...nextData,
    lastUpdated: nowIso(),
  };
  fs.writeFileSync(DATA_PATH, JSON.stringify(payload, null, 2), 'utf8');
}

function visibleTasks(data) {
  const tombstones = data.deletedTaskTombstones || {};
  return (data.tasks || []).filter(task => !tombstones[String(task.id)]);
}

function getTaskById(data, id) {
  return (data.tasks || []).find(task => String(task.id) === String(id)) || null;
}

function makeTaskId() {
  return `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function mcpOk(result, id) {
  send({
    jsonrpc: '2.0',
    id,
    result,
  });
}

function mcpErr(id, code, message, data) {
  send({
    jsonrpc: '2.0',
    id,
    error: { code, message, data },
  });
}

function textContent(text) {
  return { content: [{ type: 'text', text }] };
}

function toolsList() {
  return [
    {
      name: 'homebase_get_tasks',
      description: 'List Homebase tasks with optional filters.',
      inputSchema: {
        type: 'object',
        properties: {
          completed: { type: 'boolean' },
          status: { type: 'string' },
          categoryId: { type: 'string' },
          meetingEventKey: { type: 'string' },
          limit: { type: 'number', minimum: 1, maximum: 1000 },
        },
      },
    },
    {
      name: 'homebase_create_task',
      description: 'Create a task in Homebase data.json.',
      inputSchema: {
        type: 'object',
        required: ['title'],
        properties: {
          title: { type: 'string' },
          notes: { type: 'string' },
          status: { type: 'string' },
          today: { type: 'boolean' },
          flagged: { type: 'boolean' },
          categoryId: { type: 'string' },
          dueDate: { type: 'string' },
          deferDate: { type: 'string' },
          labels: { type: 'array', items: { type: 'string' } },
          people: { type: 'array', items: { type: 'string' } },
          meetingEventKey: { type: 'string' },
          isNote: { type: 'boolean' },
        },
      },
    },
    {
      name: 'homebase_update_task',
      description: 'Patch an existing task by id.',
      inputSchema: {
        type: 'object',
        required: ['id', 'patch'],
        properties: {
          id: { type: 'string' },
          patch: { type: 'object' },
        },
      },
    },
    {
      name: 'homebase_delete_task',
      description: 'Delete a task by id and record tombstone.',
      inputSchema: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' },
        },
      },
    },
    {
      name: 'homebase_get_meeting_workspace',
      description: 'Get notes + linked tasks for a meeting event key.',
      inputSchema: {
        type: 'object',
        required: ['eventKey'],
        properties: {
          eventKey: { type: 'string' },
        },
      },
    },
  ];
}

function resourcesList() {
  return [
    {
      uri: 'homebase://summary',
      name: 'Homebase Summary',
      description: 'Counts and overview of core Homebase entities.',
      mimeType: 'application/json',
    },
    {
      uri: 'homebase://tasks',
      name: 'Homebase Tasks',
      description: 'All active tasks (tombstones excluded).',
      mimeType: 'application/json',
    },
    {
      uri: 'homebase://meeting-notes',
      name: 'Meeting Notes',
      description: 'Meeting notes index keyed by eventKey.',
      mimeType: 'application/json',
    },
  ];
}

function handleToolCall(name, args = {}) {
  const data = readData();

  if (name === 'homebase_get_tasks') {
    const limit = Math.min(Math.max(Number(args.limit || 200), 1), 1000);
    let list = visibleTasks(data);
    if (typeof args.completed === 'boolean') list = list.filter(t => !!t.completed === args.completed);
    if (args.status) list = list.filter(t => t.status === args.status);
    if (args.categoryId) list = list.filter(t => t.categoryId === args.categoryId);
    if (args.meetingEventKey) list = list.filter(t => t.meetingEventKey === args.meetingEventKey);
    list = list.slice(0, limit);
    return textContent(JSON.stringify({ count: list.length, tasks: list }, null, 2));
  }

  if (name === 'homebase_create_task') {
    const title = String(args.title || '').trim();
    if (!title) throw new Error('title is required');
    const id = makeTaskId();
    const task = {
      id,
      title,
      notes: args.notes || '',
      status: args.status || 'inbox',
      today: !!args.today,
      flagged: !!args.flagged,
      completed: false,
      completedAt: null,
      categoryId: args.categoryId || null,
      labels: Array.isArray(args.labels) ? args.labels : [],
      people: Array.isArray(args.people) ? args.people : [],
      deferDate: args.deferDate || null,
      dueDate: args.dueDate || null,
      repeat: null,
      isNote: !!args.isNote,
      parentId: null,
      indent: 0,
      meetingEventKey: args.meetingEventKey || null,
      order: ((data.tasks || []).filter(t => !t.completed).length + 1) * 1000,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    data.tasks.push(task);
    if (data.deletedTaskTombstones[String(id)]) {
      delete data.deletedTaskTombstones[String(id)];
    }
    writeData(data);
    return textContent(JSON.stringify({ created: true, task }, null, 2));
  }

  if (name === 'homebase_update_task') {
    const id = String(args.id || '');
    if (!id) throw new Error('id is required');
    const task = getTaskById(data, id);
    if (!task) throw new Error(`Task not found: ${id}`);
    const patch = args.patch && typeof args.patch === 'object' ? args.patch : {};
    Object.assign(task, patch, { updatedAt: nowIso() });
    if (task.completed) {
      task.completedAt = task.completedAt || nowIso();
    } else {
      task.completedAt = null;
    }
    writeData(data);
    return textContent(JSON.stringify({ updated: true, task }, null, 2));
  }

  if (name === 'homebase_delete_task') {
    const id = String(args.id || '');
    if (!id) throw new Error('id is required');
    const before = data.tasks.length;
    data.tasks = data.tasks.filter(t => String(t.id) !== id);
    if (before === data.tasks.length) throw new Error(`Task not found: ${id}`);
    data.deletedTaskTombstones[id] = nowIso();
    writeData(data);
    return textContent(JSON.stringify({ deleted: true, id }, null, 2));
  }

  if (name === 'homebase_get_meeting_workspace') {
    const eventKey = String(args.eventKey || '');
    if (!eventKey) throw new Error('eventKey is required');
    const noteDoc = data.meetingNotesByEvent[eventKey] || null;
    const linkedTasks = visibleTasks(data).filter(t => t.meetingEventKey === eventKey);
    return textContent(JSON.stringify({ eventKey, noteDoc, linkedTasks }, null, 2));
  }

  throw new Error(`Unknown tool: ${name}`);
}

function handleResourceRead(uri) {
  const data = readData();

  if (uri === 'homebase://summary') {
    const tasks = visibleTasks(data);
    const payload = {
      lastUpdated: data.lastUpdated || null,
      tasks: {
        total: tasks.length,
        completed: tasks.filter(t => t.completed).length,
        active: tasks.filter(t => !t.completed).length,
      },
      categories: data.taskCategories.length,
      labels: data.taskLabels.length,
      people: data.taskPeople.length,
      meetingNotes: Object.keys(data.meetingNotesByEvent || {}).length,
      deletedTaskTombstones: Object.keys(data.deletedTaskTombstones || {}).length,
    };
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(payload, null, 2),
      }],
    };
  }

  if (uri === 'homebase://tasks') {
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(visibleTasks(data), null, 2),
      }],
    };
  }

  if (uri === 'homebase://meeting-notes') {
    return {
      contents: [{
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(data.meetingNotesByEvent || {}, null, 2),
      }],
    };
  }

  throw new Error(`Unknown resource URI: ${uri}`);
}

function handleRequest(msg) {
  const { id, method, params } = msg;
  if (!method) {
    if (id !== undefined) mcpErr(id, -32600, 'Invalid Request: method missing');
    return;
  }

  try {
    if (method === 'initialize') {
      mcpOk({
        protocolVersion: PROTOCOL_VERSION,
        serverInfo: { name: SERVER_NAME, version: SERVER_VERSION },
        capabilities: { tools: {}, resources: {} },
      }, id);
      return;
    }

    if (method === 'notifications/initialized') {
      return;
    }

    if (method === 'tools/list') {
      mcpOk({ tools: toolsList() }, id);
      return;
    }

    if (method === 'tools/call') {
      const name = params?.name;
      const args = params?.arguments || {};
      const result = handleToolCall(name, args);
      mcpOk(result, id);
      return;
    }

    if (method === 'resources/list') {
      mcpOk({ resources: resourcesList() }, id);
      return;
    }

    if (method === 'resources/read') {
      const uri = params?.uri;
      const result = handleResourceRead(uri);
      mcpOk(result, id);
      return;
    }

    if (id !== undefined) mcpErr(id, -32601, `Method not found: ${method}`);
  } catch (err) {
    if (id !== undefined) mcpErr(id, -32000, err.message || 'Internal error');
  }
}

function send(obj) {
  const body = JSON.stringify(obj);
  const header = `Content-Length: ${Buffer.byteLength(body, 'utf8')}\r\n\r\n`;
  process.stdout.write(header + body);
}

let buffer = Buffer.alloc(0);
process.stdin.on('data', (chunk) => {
  buffer = Buffer.concat([buffer, chunk]);
  while (true) {
    const sep = buffer.indexOf('\r\n\r\n');
    if (sep === -1) return;
    const header = buffer.slice(0, sep).toString('utf8');
    const match = header.match(/Content-Length:\s*(\d+)/i);
    if (!match) {
      buffer = buffer.slice(sep + 4);
      continue;
    }
    const length = parseInt(match[1], 10);
    const start = sep + 4;
    if (buffer.length < start + length) return;
    const payload = buffer.slice(start, start + length).toString('utf8');
    buffer = buffer.slice(start + length);
    let message;
    try {
      message = JSON.parse(payload);
    } catch {
      continue;
    }
    handleRequest(message);
  }
});

process.stdin.resume();
process.on('uncaughtException', (err) => {
  const msg = err?.stack || err?.message || String(err);
  console.error(`[${SERVER_NAME}] uncaughtException`, msg);
});
process.on('unhandledRejection', (err) => {
  const msg = err?.stack || err?.message || String(err);
  console.error(`[${SERVER_NAME}] unhandledRejection`, msg);
});
