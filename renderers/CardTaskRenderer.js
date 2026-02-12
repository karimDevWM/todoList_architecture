/**
 * @class CardTaskRenderer
 * Renders tasks as individual cards with enhanced visual layout
 */
class CardTaskRenderer extends TaskRenderer {
    constructor() {
        super();
    }

    /**
     * Render tasks as cards
     * @param {Array} tasks - Array of task objects
     * @param {HTMLElement} container - Container element
     */
    render(tasks, container) {
        this.clearContainer(container);
        container.classList.add('card-view');
        container.classList.remove('todo-list', 'table-view', 'compact-view');

        if (tasks.length === 0) {
            this._renderEmptyState(container);
        } else {
            tasks.forEach(task => this._renderTaskCard(task, container));
        }
    }

    /**
     * Render empty state message
     * @param {HTMLElement} container
     * @private
     */
    _renderEmptyState(container) {
        const card = this.createElement('div', 'empty-card');
        card.textContent = '📋 Nothing to do! Add a task to get started.';
        container.append(card);
    }

    /**
     * Render a single task as a card
     * @param {Object} task - Task object
     * @param {HTMLElement} container
     * @private
     */
    _renderTaskCard(task, container) {
        const card = this.createElement('div', 'task-card');
        card.id = task.id;
        if (task.complete) {
            card.classList.add('completed');
        }

        const header = this.createElement('div', 'card-header');
        const checkbox = this._createCheckbox(task);
        const badge = this._createCategoryBadge(task);
        
        if (badge) {
            header.append(checkbox, badge);
        } else {
            header.append(checkbox);
        }

        const body = this.createElement('div', 'card-body');
        const span = this._createEditableSpan(task);
        body.append(span);

        const footer = this.createElement('div', 'card-footer');
        const deleteButton = this._createDeleteButton();
        footer.append(deleteButton);

        card.append(header, body, footer);
        container.append(card);
    }

    _createCheckbox(task) {
        const checkbox = this.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.complete;
        checkbox.classList.add('card-checkbox');
        return checkbox;
    }

    _createEditableSpan(task) {
        const span = this.createElement('span', 'card-text');
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

    _createDeleteButton() {
        const deleteButton = this.createElement('button', 'delete');
        deleteButton.textContent = '🗑️ Delete';
        return deleteButton;
    }

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
