/**
 * @class CompactTaskRenderer
 * Renders tasks in a minimal, space-efficient format
 */
class CompactTaskRenderer extends TaskRenderer {
    constructor() {
        super();
    }

    /**
     * Render tasks compactly
     * @param {Array} tasks - Array of task objects
     * @param {HTMLElement} container - Container element
     */
    render(tasks, container) {
        this.clearContainer(container);
        container.classList.add('compact-view');
        container.classList.remove('todo-list', 'card-view', 'table-view');

        if (tasks.length === 0) {
            this._renderEmptyState(container);
        } else {
            tasks.forEach(task => this._renderCompactTask(task, container));
        }
    }

    /**
     * Render empty state message
     * @param {HTMLElement} container
     * @private
     */
    _renderEmptyState(container) {
        const p = this.createElement('p');
        p.textContent = '✓ All clear! Add a task.';
        p.style.fontSize = '0.9rem';
        p.style.color = '#999';
        container.append(p);
    }

    /**
     * Render a single task in compact format
     * @param {Object} task - Task object
     * @param {HTMLElement} container
     * @private
     */
    _renderCompactTask(task, container) {
        const item = this.createElement('div', 'compact-task');
        item.id = task.id;

        const checkbox = this._createCheckbox(task);
        
        const label = this.createElement('label', 'compact-label');
        const span = this._createEditableSpan(task);
        label.append(span);

        const badge = this._createCategoryBadge(task);
        
        const deleteButton = this._createDeleteButton();

        if (badge) {
            item.append(checkbox, label, badge, deleteButton);
        } else {
            item.append(checkbox, label, deleteButton);
        }

        container.append(item);
    }

    _createCheckbox(task) {
        const checkbox = this.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.complete;
        checkbox.classList.add('compact-checkbox');
        return checkbox;
    }

    _createEditableSpan(task) {
        const span = this.createElement('span', 'compact-text');
        span.contentEditable = true;
        span.classList.add('editable');

        if (task.complete) {
            span.style.textDecoration = 'line-through';
            span.style.opacity = '0.6';
            span.textContent = task.text;
        } else {
            span.textContent = task.text;
        }

        return span;
    }

    _createDeleteButton() {
        const deleteButton = this.createElement('button', 'delete');
        deleteButton.textContent = '×';
        deleteButton.style.fontSize = '1.2rem';
        deleteButton.style.padding = '0 0.5rem';
        return deleteButton;
    }

    _createCategoryBadge(task) {
        if (!task.category || !task.category.title) {
            return null;
        }

        const badge = this.createElement('span', 'category');
        badge.textContent = task.category.title;
        badge.style.fontSize = '0.75rem';
        badge.style.padding = '0.15rem 0.4rem';
        if (task.category.color) {
            badge.style.backgroundColor = task.category.color;
        }
        return badge;
    }
}
