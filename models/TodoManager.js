/**
 * @class TodoManager
 * Singleton class to manage the todo list with centralized business logic
 */
class TodoManager {
    static #instance = null;
    #todos = [];
    #observers = [];

    /**
     * Private constructor to prevent direct instantiation
     * @private
     */
    constructor() {
        if (TodoManager.#instance) {
            throw new Error('Use TodoManager.getInstance() to get the singleton instance');
        }
        this.#todos = [];
        this.#observers = [];
    }

    /**
     * Get the singleton instance
     * @returns {TodoManager}
     */
    static getInstance() {
        if (!TodoManager.#instance) {
            TodoManager.#instance = new TodoManager();
        }
        return TodoManager.#instance;
    }

    /**
     * Reset the singleton instance (useful for testing)
     */
    static resetInstance() {
        TodoManager.#instance = null;
    }

    /**
     * Add an observer to be notified of changes
     * @param {Function} callback
     */
    subscribe(callback) {
        this.#observers.push(callback);
    }

    /**
     * Remove an observer
     * @param {Function} callback
     */
    unsubscribe(callback) {
        this.#observers = this.#observers.filter(obs => obs !== callback);
    }

    /**
     * Notify all observers of changes
     * @private
     */
    #notifyObservers() {
        this.#observers.forEach(callback => callback(this.getAllTodos()));
    }

    /**
     * Generate next available ID
     * @returns {number}
     * @private
     */
    #generateNextId() {
        if (this.#todos.length === 0) return 1;
        const maxId = Math.max(...this.#todos.map(todo => todo.id));
        return maxId + 1;
    }

    /**
     * Add a new todo with business logic validation
     * @param {string} title - Task title
     * @param {string} categoryTitle - Optional category title
     * @returns {Todo} - The created todo
     */
    addTodo(title, categoryTitle = '') {
        try {
            const nextId = this.#generateNextId();
            const todo = new Todo({ 
                id: nextId, 
                title: title, 
                complete: false 
            });

            // Add category if provided
            if (categoryTitle && categoryTitle.trim()) {
                todo.category = new Category({ title: categoryTitle });
            }

            this.#todos.push(todo);
            this.#notifyObservers();
            
            console.log(`[TodoManager] Todo added: "${todo.title}" (ID: ${todo.id})`);
            return todo;
        } catch (error) {
            console.error('[TodoManager] Failed to add todo:', error.message);
            throw error;
        }
    }

    /**
     * Update an existing todo
     * @param {number} id
     * @param {string} newTitle
     * @returns {boolean} - Success status
     */
    updateTodo(id, newTitle) {
        const todo = this.#todos.find(t => t.id === id);
        if (!todo) {
            console.warn(`[TodoManager] Todo with ID ${id} not found`);
            return false;
        }

        try {
            todo.title = newTitle;
            this.#notifyObservers();
            console.log(`[TodoManager] Todo updated: ID ${id}`);
            return true;
        } catch (error) {
            console.error('[TodoManager] Failed to update todo:', error.message);
            throw error;
        }
    }

    /**
     * Delete a todo
     * @param {number} id
     * @returns {boolean} - Success status
     */
    deleteTodo(id) {
        const initialLength = this.#todos.length;
        this.#todos = this.#todos.filter(todo => todo.id !== id);
        
        if (this.#todos.length < initialLength) {
            this.#notifyObservers();
            console.log(`[TodoManager] Todo deleted: ID ${id}`);
            return true;
        }
        
        console.warn(`[TodoManager] Todo with ID ${id} not found`);
        return false;
    }

    /**
     * Toggle todo completion status
     * @param {number} id
     * @returns {boolean} - Success status
     */
    toggleTodo(id) {
        const todo = this.#todos.find(t => t.id === id);
        if (!todo) {
            console.warn(`[TodoManager] Todo with ID ${id} not found`);
            return false;
        }

        todo.toggle();
        this.#notifyObservers();
        console.log(`[TodoManager] Todo toggled: ID ${id}, Complete: ${todo.complete}`);
        return true;
    }

    /**
     * Get all todos
     * @returns {Array<Todo>}
     */
    getAllTodos() {
        return [...this.#todos];
    }

    /**
     * Get a specific todo by ID
     * @param {number} id
     * @returns {Todo|null}
     */
    getTodoById(id) {
        return this.#todos.find(todo => todo.id === id) || null;
    }

    /**
     * Get completed todos
     * @returns {Array<Todo>}
     */
    getCompletedTodos() {
        return this.#todos.filter(todo => todo.complete);
    }

    /**
     * Get pending todos
     * @returns {Array<Todo>}
     */
    getPendingTodos() {
        return this.#todos.filter(todo => !todo.complete);
    }

    /**
     * Get todos by category
     * @param {string} categoryTitle
     * @returns {Array<Todo>}
     */
    getTodosByCategory(categoryTitle) {
        return this.#todos.filter(todo => 
            todo.category && todo.category.title === categoryTitle
        );
    }

    /**
     * Clear all todos
     */
    clearAll() {
        this.#todos = [];
        this.#notifyObservers();
        console.log('[TodoManager] All todos cleared');
    }

    /**
     * Load todos from an array
     * @param {Array<Todo>} todos
     */
    loadTodos(todos) {
        this.#todos = [...todos];
        this.#notifyObservers();
        console.log(`[TodoManager] Loaded ${todos.length} todos`);
    }

    /**
     * Get statistics
     * @returns {Object}
     */
    getStatistics() {
        return {
            total: this.#todos.length,
            completed: this.getCompletedTodos().length,
            pending: this.getPendingTodos().length,
            completionRate: this.#todos.length > 0 
                ? (this.getCompletedTodos().length / this.#todos.length * 100).toFixed(1) 
                : 0
        };
    }
}
