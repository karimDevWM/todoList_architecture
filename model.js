/**
 * @class Model
 * Model layer backed by Todo and Category entities.
 */
class Model {
    constructor() {
        this.onTodoListChanged = () => {};
        this._todos = this._loadFromStorage();
    }

    get todos() {
        return this._serializeTodos();
    }

    addTodo(todoText, categoryTitle = '') {
        const nextId = this._todos.length > 0 ? this._todos[this._todos.length - 1].id + 1 : 1;
        const todo = new Todo({ id: nextId, title: todoText, complete: false });
        if (categoryTitle.trim()) {
            todo.category = new Category({ title: categoryTitle });
        }
        this._todos.push(todo);
        this._commit();
    }

    editTodo(id, updatedText) {
        this._todos = this._todos.map((todo) => {
            if (todo.id === id) {
                todo.title = updatedText;
            }
            return todo;
        });
        this._commit();
    }

    deleteTodo(id) {
        this._todos = this._todos.filter((todo) => todo.id !== id);
        this._commit();
    }

    toggleTodo(id) {
        this._todos = this._todos.map((todo) => {
            if (todo.id === id) {
                todo.complete = !todo.complete;
            }
            return todo;
        });
        this._commit();
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
        return this._todos.map((todo) => ({
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
}