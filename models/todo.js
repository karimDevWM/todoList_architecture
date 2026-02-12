class Todo {

    //attributes
    #id;
    #title;
    #complete;
    #createdAt;
    #updatedAt;

    constructor({ id= `${Date.now().toString(36)}`, title = '', complete = false, createdAt = null, updatedAt = null}) {
        this.#id = id;
        this.#title = this._validateTitle(title);
        this.#complete = complete;
        this.#createdAt = createdAt || new Date().toISOString();
        this.#updatedAt = updatedAt || new Date().toISOString();
    }

    // getters and setters
    get id() { return this.#id; }

    get title() { return this.#title; }
    set title(title) {
        this.#title = this._validateTitle(title);
        this.#updatedAt = new Date().toISOString();
    }

    get complete() { return this.#complete; }
    set complete(complete) {
        this.#complete = complete;
        this.#updatedAt = new Date().toISOString();
    }

    get createdAt() { return this.#createdAt; }
    get updatedAt() { return this.#updatedAt; }

    // Business logic methods
    
    /**
     * Validate task title
     * @param {string} title
     * @returns {string}
     * @private
     */
    _validateTitle(title) {
        const trimmed = String(title).trim();
        if (trimmed.length === 0) {
            throw new Error('Task title cannot be empty');
        }
        if (trimmed.length > 200) {
            throw new Error('Task title cannot exceed 200 characters');
        }
        return trimmed;
    }

    /**
     * Toggle task completion status
     */
    toggle() {
        this.complete = !this.complete;
    }

    /**
     * Check if task is overdue (for future extension with due dates)
     * @returns {boolean}
     */
    isOverdue() {
        // Placeholder for future due date functionality
        return false;
    }

    /**
     * Clone the todo
     * @returns {Todo}
     */
    clone() {
        const cloned = new Todo({
            id: this.#id,
            title: this.#title,
            complete: this.#complete,
            createdAt: this.#createdAt,
            updatedAt: this.#updatedAt
        });
        if (this.category) {
            cloned.category = this.category;
        }
        return cloned;
    }

    /**
     * Serialize to plain object
     * @returns {Object}
     */
    toObject() {
        return {
            id: this.#id,
            title: this.#title,
            complete: this.#complete,
            createdAt: this.#createdAt,
            updatedAt: this.#updatedAt,
            category: this.category ? this.category.toObject() : null
        };
    }
}