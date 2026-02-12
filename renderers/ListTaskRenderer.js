/**
 * @class ListTaskRenderer
 * Concrete implementation of TaskRenderer for list-based rendering
 */
class ListTaskRenderer extends TaskRenderer {
    constructor() {
        super();
    }

    /**
     * Render tasks as an HTML list
     * @param {Array} tasks - Array of task objects
     * @param {HTMLElement} container - Container element (ul)
     */
    render(tasks, container) {
        this.clearContainer(container);

        if (tasks.length === 0) {
            this._renderEmptyState(container);
        } else {
            tasks.forEach(task => this._renderTask(task, container));
        }
    }

    /**
     * Render empty state message
     * @param {HTMLElement} container
     * @private
     */
    _renderEmptyState(container) {
        const p = this.createElement('p');
        p.textContent = 'Nothing to do! Add a task?';
        container.append(p);
    }

    /**
     * Render a single task
     * @param {Object} task - Task object
     * @param {HTMLElement} container
     * @private
     */
    _renderTask(task, container) {
        const li = this.createElement('li');
        li.id = task.id;

        const checkbox = this._createCheckbox(task);
        const span = this._createEditableSpan(task);
        const deleteButton = this._createDeleteButton();
        const badge = this._createCategoryBadge(task);

        if (badge) {
            li.append(checkbox, span, badge, deleteButton);
        } else {
            li.append(checkbox, span, deleteButton);
        }

        container.append(li);
    }

    /**
     * Create checkbox input
     * @param {Object} task
     * @returns {HTMLInputElement}
     * @private
     */
    _createCheckbox(task) {
        const checkbox = this.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.complete;
        return checkbox;
    }

    /**
     * Create editable task text span
     * @param {Object} task
     * @returns {HTMLSpanElement}
     * @private
     */
    _createEditableSpan(task) {
        const span = this.createElement('span');
        span.contentEditable = true;
        span.classList.add('editable');

        if (task.complete) {
            const strike = this.createElement('s');
            strike.textContent = task.text;
            span.append(strike);
        } else {
            span.textContent = task.text;
        }

        return span;
    }

    /**
     * Create delete button
     * @returns {HTMLButtonElement}
     * @private
     */
    _createDeleteButton() {
        const deleteButton = this.createElement('button', 'delete');
        deleteButton.textContent = 'Delete';
        return deleteButton;
    }

    /**
     * Create category badge if task has a category
     * @param {Object} task
     * @returns {HTMLSpanElement|null}
     * @private
     */
    _createCategoryBadge(task) {
        if (!task.category || !task.category.title) {
            return null;
        }

        const badge = this.createElement('span', 'category');
        badge.textContent = task.category.title;
        if (task.category.color) {
            badge.style.backgroundColor = task.category.color;
        }
        return badge;
    }
}
