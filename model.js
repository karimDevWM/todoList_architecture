/**
 * @class Model
 * Model layer backed by TodoManager singleton and Category entities.
 */
class Model {
    constructor() {
        this.onTodoListChanged = () => {};
        this.todoManager = TodoManager.getInstance();
        
        // Subscribe to TodoManager changes
        this.todoManager.subscribe((todos) => {
            this._commit();
        });
        
        // Load initial data from storage
        const storedTodos = this._loadFromStorage();
        this.todoManager.loadTodos(storedTodos);
    }

    get todos() {
        return this._serializeTodos();
    }

    addTodo(todoText, categoryTitle = '') {
        try {
            this.todoManager.addTodo(todoText, categoryTitle);
        } catch (error) {
            console.error('Failed to add todo:', error.message);
            throw error;
        }
    }

    editTodo(id, updatedText) {
        this.todoManager.updateTodo(id, updatedText);
    }

    deleteTodo(id) {
        this.todoManager.deleteTodo(id);
    }

    toggleTodo(id) {
        this.todoManager.toggleTodo(id);
    }

    bindTodoListChanged(callback) {
        this.onTodoListChanged = callback;
    }

    _commit() {
        const serialized = this._serializeTodos();
        this.onTodoListChanged(serialized);
        localStorage.setItem('todos', JSON.stringify(serialized));
    }

    _serializeTodos() {
        const todos = this.todoManager.getAllTodos();
        return todos.map((todo) => ({
            id: todo.id,
            text: todo.title,
            complete: todo.complete,
            category: todo.category ? todo.category.toObject() : null,
        }));
    }

    _loadFromStorage() {
        const stored = JSON.parse(localStorage.getItem('todos') || '[]');
        return stored.map((raw) => {
            const id = typeof raw.id === 'number' ? raw.id : parseInt(raw.id, 10) || 0;
            const todo = new Todo({ id, title: raw.title || raw.text || '', complete: !!raw.complete });
            if (raw.category && typeof raw.category === 'object') {
                todo.category = Category.from(raw.category);
            }
            return todo;
        });
    }
    
    /**
     * Get statistics from TodoManager
     * @returns {Object}
     */
    getStatistics() {
        return this.todoManager.getStatistics();
    }
}