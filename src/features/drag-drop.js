import { state } from '../state.js';
import { saveTasksData } from '../data/storage.js';

// --- Task drag-and-drop ---

/**
 * Handle the start of a task drag operation.
 */
export function handleDragStart(e, taskId) {
  state.draggedTaskId = taskId;
  e.target.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', taskId);

  // Add is-dragging class to task list
  const taskList = e.target.closest('.task-list');
  if (taskList) taskList.classList.add('is-dragging');
}

/**
 * Handle the end of a task drag operation and perform reorder if valid.
 */
export function handleDragEnd(e) {
  e.target.classList.remove('dragging');

  // Remove all drag indicators
  document.querySelectorAll('.drag-over, .drag-over-bottom').forEach(el => {
    el.classList.remove('drag-over', 'drag-over-bottom');
  });

  const taskList = document.querySelector('.task-list.is-dragging');
  if (taskList) taskList.classList.remove('is-dragging');

  // Perform reorder if valid
  if (state.draggedTaskId && state.dragOverTaskId && state.draggedTaskId !== state.dragOverTaskId) {
    reorderTasks(state.draggedTaskId, state.dragOverTaskId, state.dragPosition);
  }

  state.draggedTaskId = null;
  state.dragOverTaskId = null;
  state.dragPosition = null;
}

/**
 * Handle drag over a task item -- determines drop position (top/bottom half).
 */
export function handleDragOver(e, taskId) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';

  if (taskId === state.draggedTaskId) return;

  const taskItem = e.target.closest('.task-item');
  if (!taskItem) return;
  const rect = taskItem.getBoundingClientRect();
  const midpoint = rect.top + rect.height / 2;
  const position = e.clientY < midpoint ? 'top' : 'bottom';

  // Remove previous indicators
  document.querySelectorAll('.drag-over, .drag-over-bottom').forEach(el => {
    el.classList.remove('drag-over', 'drag-over-bottom');
  });

  // Add indicator to current target
  if (position === 'top') {
    taskItem.classList.add('drag-over');
  } else {
    taskItem.classList.add('drag-over-bottom');
  }

  state.dragOverTaskId = taskId;
  state.dragPosition = position;
}

/**
 * Handle drag leave from a task item.
 */
export function handleDragLeave(e) {
  // Only remove if leaving the task item entirely
  if (!e.target.closest('.task-item')?.contains(e.relatedTarget)) {
    e.target.closest('.task-item')?.classList.remove('drag-over', 'drag-over-bottom');
  }
}

/**
 * Handle drop on a task item (reorder is handled in dragEnd).
 */
export function handleDrop(e, taskId) {
  e.preventDefault();
  // Reorder is handled in dragEnd
}

/**
 * Reorder tasks by calculating a new order value for the dragged task
 * based on its drop position relative to the target task.
 */
export function reorderTasks(draggedId, targetId, position) {
  const draggedTask = state.tasksData.find(t => t.id === draggedId);
  const targetTask = state.tasksData.find(t => t.id === targetId);
  if (!draggedTask || !targetTask) return;

  // Get all tasks in current view
  const filteredTasks = getCurrentFilteredTasks();
  const taskIds = filteredTasks.map(t => t.id);

  // Find indices
  const draggedIndex = taskIds.indexOf(draggedId);
  const targetIndex = taskIds.indexOf(targetId);
  if (draggedIndex === -1 || targetIndex === -1) return;

  // Calculate new order values
  let newOrder;
  if (position === 'top') {
    const prevTask = targetIndex > 0 ? filteredTasks[targetIndex - 1] : null;
    const prevOrder = prevTask?.order ?? targetTask.order - 1000;
    newOrder = (prevOrder + targetTask.order) / 2;
  } else {
    const nextTask = targetIndex < filteredTasks.length - 1 ? filteredTasks[targetIndex + 1] : null;
    const nextOrder = nextTask?.order ?? targetTask.order + 1000;
    newOrder = (targetTask.order + nextOrder) / 2;
  }

  // Update dragged task order
  draggedTask.order = newOrder;
  draggedTask.updatedAt = new Date().toISOString();

  // Normalize orders if they get too close (rebalance)
  normalizeTaskOrders();

  saveTasksData();
  window.render();
}

/**
 * Normalize task order values by rebalancing each status group
 * with evenly spaced increments of 1000.
 */
export function normalizeTaskOrders() {
  // Group tasks by status and rebalance order values
  const statuses = ['inbox', 'anytime', 'someday'];
  statuses.forEach(status => {
    const statusTasks = state.tasksData
      .filter(t => t.status === status && !t.completed)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    statusTasks.forEach((task, index) => {
      task.order = (index + 1) * 1000;
    });
  });
}

// --- Sidebar drag-and-drop ---

/**
 * Set up drag/drop listeners for sidebar items (categories, labels, people, perspectives).
 * Attaches dragstart, dragend, dragover, dragleave, and drop handlers to
 * elements with the `.draggable-item` class. Skips already-initialized items.
 */
export function setupSidebarDragDrop() {
  document.querySelectorAll('.draggable-item').forEach(item => {
    // Skip if already initialized to prevent duplicate event listeners
    if (item.dataset.dragInitialized) return;
    item.dataset.dragInitialized = 'true';

    item.addEventListener('dragstart', function(e) {
      const id = this.dataset.id;
      const type = this.dataset.type;
      state.draggedSidebarItem = id;
      state.draggedSidebarType = type;
      this.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', id);
    });

    item.addEventListener('dragend', function(e) {
      this.classList.remove('dragging');
      document.querySelectorAll('.drag-over, .drag-over-bottom').forEach(el => {
        el.classList.remove('drag-over', 'drag-over-bottom');
      });
      state.draggedSidebarItem = null;
      state.draggedSidebarType = null;
      state.sidebarDragPosition = null;
    });

    item.addEventListener('dragover', function(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (this.classList.contains('dragging')) return;

      // Determine if cursor is in top or bottom half
      const rect = this.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      const position = e.clientY < midpoint ? 'top' : 'bottom';

      // Clear previous indicators
      document.querySelectorAll('.drag-over, .drag-over-bottom').forEach(el => {
        el.classList.remove('drag-over', 'drag-over-bottom');
      });

      // Add appropriate class
      if (position === 'top') {
        this.classList.add('drag-over');
      } else {
        this.classList.add('drag-over-bottom');
      }
      state.sidebarDragPosition = position;
    });

    item.addEventListener('dragleave', function(e) {
      this.classList.remove('drag-over', 'drag-over-bottom');
    });

    item.addEventListener('drop', function(e) {
      e.preventDefault();
      const targetId = this.dataset.id;
      const type = this.dataset.type;
      document.querySelectorAll('.drag-over, .drag-over-bottom').forEach(el => {
        el.classList.remove('drag-over', 'drag-over-bottom');
      });

      if (!state.draggedSidebarItem || state.draggedSidebarType !== type || state.draggedSidebarItem === targetId) {
        return;
      }

      let arr;
      if (type === 'category') arr = state.taskCategories;
      else if (type === 'label') arr = state.taskLabels;
      else if (type === 'person') arr = state.taskPeople;
      else if (type === 'perspective') arr = state.customPerspectives;
      else return;

      const fromIdx = arr.findIndex(item => item.id === state.draggedSidebarItem);
      let toIdx = arr.findIndex(item => item.id === targetId);

      if (fromIdx === -1 || toIdx === -1) return;

      // Adjust target index based on drop position
      if (state.sidebarDragPosition === 'bottom' && fromIdx < toIdx) {
        // No adjustment needed
      } else if (state.sidebarDragPosition === 'bottom' && fromIdx > toIdx) {
        toIdx += 1;
      } else if (state.sidebarDragPosition === 'top' && fromIdx > toIdx) {
        // No adjustment needed
      } else if (state.sidebarDragPosition === 'top' && fromIdx < toIdx) {
        toIdx -= 1;
      }

      // Remove from old position and insert at new position
      const [removed] = arr.splice(fromIdx, 1);
      arr.splice(toIdx, 0, removed);

      saveTasksData();
      window.render();
    });
  });
}

// --- Private helper ---

/**
 * Get currently filtered tasks based on active filter state.
 * Delegates to the global getCurrentFilteredTasks defined on window.
 */
function getCurrentFilteredTasks() {
  return window.getCurrentFilteredTasks();
}
