/**
 * @class TableTaskRenderer
 * Renders tasks in a structured table format
 */
class TableTaskRenderer extends TaskRenderer {
    constructor() {
        super();
    }

    /**
     * Render tasks as a table
     * @param {Array} tasks - Array of task objects
     * @param {HTMLElement} container - Container element
     */
    render(tasks, container) {
        this.clearContainer(container);
        container.classList.add('table-view');
        container.classList.remove('todo-list', 'card-view', 'compact-view');

        if (tasks.length === 0) {
            this._renderEmptyState(container);
        } else {
            const table = this._createTable(tasks);
            container.append(table);
        }
    }

    /**
     * Render empty state message
     * @param {HTMLElement} container
     * @private
     */
    _renderEmptyState(container) {
        const p = this.createElement('p');
        p.textContent = 'No tasks in the table. Add one to begin!';
        p.style.textAlign = 'center';
        p.style.padding = '2rem';
        container.append(p);
    }

    /**
     * Create a table with all tasks
     * @param {Array} tasks
     * @returns {HTMLTableElement}
     * @private
     */
    _createTable(tasks) {
        const table = this.createElement('table', 'task-table');
        
        const thead = this.createElement('thead');
        const headerRow = this.createElement('tr');
        
        ['Status', 'Task', 'Category', 'Actions'].forEach(header => {
            const th = this.createElement('th');
            th.textContent = header;
            headerRow.append(th);
        });
        
        thead.append(headerRow);
        table.append(thead);

        const tbody = this.createElement('tbody');
        tasks.forEach(task => {
            const row = this._createTableRow(task);
            tbody.append(row);
        });
        
        table.append(tbody);
        return table;
    }

    /**
     * Create a table row for a task
     * @param {Object} task
     * @returns {HTMLTableRowElement}
     * @private
     */
    _createTableRow(task) {
        const row = this.createElement('tr');
        row.id = task.id;
        if (task.complete) {
            row.classList.add('completed-row');
        }

        // Status column
        const statusCell = this.createElement('td');
        const checkbox = this._createCheckbox(task);
        statusCell.append(checkbox);
        
        // Task column
        const taskCell = this.createElement('td');
        const span = this._createEditableSpan(task);
        taskCell.append(span);
        
        // Category column
        const categoryCell = this.createElement('td');
        const badge = this._createCategoryBadge(task);
        if (badge) {
            categoryCell.append(badge);
        } else {
            categoryCell.textContent = '—';
        }
        
        // Actions column
        const actionsCell = this.createElement('td');
        const deleteButton = this._createDeleteButton();
        actionsCell.append(deleteButton);

        row.append(statusCell, taskCell, categoryCell, actionsCell);
        return row;
    }

    _createCheckbox(task) {
        const checkbox = this.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.complete;
        return checkbox;
    }

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

    _createDeleteButton() {
        const deleteButton = this.createElement('button', 'delete');
        deleteButton.textContent = 'Delete';
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
