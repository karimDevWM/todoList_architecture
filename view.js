/**
 * @class View
 *
 * Visual representation of the model.
 */

class View {
    constructor(taskRenderer = new ListTaskRenderer()) {
        this.taskRenderer = taskRenderer;
        this.app = this.getElement('#root')
        
        // View selector
        this.viewSelector = this.createElement('div', 'view-selector');
        const viewLabel = this.createElement('label');
        viewLabel.textContent = 'View Mode: ';
        this.viewModeSelect = this.createElement('select');
        this.viewModeSelect.name = 'viewMode';
        
        const listOption = this.createElement('option');
        listOption.value = 'list';
        listOption.textContent = 'List View';
        const cardOption = this.createElement('option');
        cardOption.value = 'card';
        cardOption.textContent = 'Card View';
        const tableOption = this.createElement('option');
        tableOption.value = 'table';
        tableOption.textContent = 'Table View';
        const compactOption = this.createElement('option');
        compactOption.value = 'compact';
        compactOption.textContent = 'Compact View';
        
        this.viewModeSelect.append(listOption, cardOption, tableOption, compactOption);
        viewLabel.append(this.viewModeSelect);
        this.viewSelector.append(viewLabel);
        
        // Title
        this.title = this.createElement('h1');
        this.title.textContent = 'Todos';
        
        // Form
        this.form = this.createElement('form')
        this.input = this.createElement('input')
        this.input.type = 'text'
        this.input.placeholder = 'Add todo'
        this.input.name = 'todo'

        this.categoryLabel = this.createElement('label')
        this.categoryLabel.textContent = 'Category'
        this.categoryInput = this.createElement('select')
        this.categoryInput.name = 'category'
        const placeholderOption = this.createElement('option')
        placeholderOption.value = ''
        placeholderOption.textContent = 'Select a category (optional)'
        placeholderOption.disabled = false
        const noneOption = this.createElement('option')
        noneOption.value = ''
        noneOption.textContent = 'No category'
        const workOption = this.createElement('option')
        workOption.value = 'Work'
        workOption.textContent = 'Work'
        const houseOption = this.createElement('option')
        houseOption.value = 'House'
        houseOption.textContent = 'House'
        const personalOption = this.createElement('option')
        personalOption.value = 'Personal'
        personalOption.textContent = 'Personal'
        this.categoryInput.append(placeholderOption, noneOption, workOption, houseOption, personalOption)
        this.categoryLabel.append(this.categoryInput)

        this.submitButton = this.createElement('button')
        this.submitButton.textContent = 'Submit'
        this.form.append(this.input, this.categoryLabel, this.submitButton)
        
        this.todoList = this.createElement('ul', 'todo-list')
        this.app.append(this.title, this.viewSelector, this.form, this.todoList)

        this._temporaryTodoText = ''
        this._initLocalListeners()
        this._initViewModeListener()
    }

    createElement(tag, className) {
        const element = document.createElement(tag)
        if(className) element.classList.add(className)

        return element;
    }

    getElement(selector) {
        const element = document.querySelector(selector)

        return element
    }

    get _todoText() {
        return this.input.value
    }

    get _categoryText() {
        return this.categoryInput.value
    }

    _resetInput() {
        this.input.value = ''
        this.categoryInput.value = ''
    }

    displayTodos(todos) {
        // Store current todos for re-rendering when view mode changes
        this._currentTodos = todos;
        
        // Delegate rendering to the abstract TaskRenderer
        this.taskRenderer.render(todos, this.todoList);

        // Debugging
        console.log(todos)
    }

    _initViewModeListener() {
        this.viewModeSelect.addEventListener('change', (event) => {
            const mode = event.target.value;
            
            console.log('[View] Switching to mode:', mode);
            
            // Switch renderer based on selected mode
            switch(mode) {
                case 'card':
                    this.taskRenderer = new CardTaskRenderer();
                    break;
                case 'table':
                    this.taskRenderer = new TableTaskRenderer();
                    break;
                case 'compact':
                    this.taskRenderer = new CompactTaskRenderer();
                    break;
                case 'list':
                default:
                    this.taskRenderer = new ListTaskRenderer();
                    break;
            }
            
            // Re-render with current todos
            if (this._currentTodos) {
                console.log('[View] Re-rendering', this._currentTodos.length, 'todos');
                this.taskRenderer.render(this._currentTodos, this.todoList);
            } else {
                console.warn('[View] No todos to render');
            }
        });
    }

    _initLocalListeners() {
        this.todoList.addEventListener('input', event => {
            if (event.target.classList && event.target.classList.contains('editable')) {
                this._temporaryTodoText = event.target.innerText
            }
        })
    }

    bindAddTodo(handler) {
        this.form.addEventListener('submit', event => {
            event.preventDefault()

            if (this._todoText) {
                handler(this._todoText, this._categoryText)
                this._resetInput()
            }
        })
    }

    bindDeleteTodo(handler) {
        this.todoList.addEventListener('click', event => {
            if (event.target.classList && event.target.classList.contains('delete')) {
                const id = this._findTaskId(event.target)
                if (id) {
                    handler(id)
                }
            }
        })
    }

    bindEditTodo(handler) {
        this.todoList.addEventListener('focusout', event => {
            if (this._temporaryTodoText && event.target.classList && event.target.classList.contains('editable')) {
                const id = this._findTaskId(event.target)
                if (id) {
                    handler(id, this._temporaryTodoText)
                    this._temporaryTodoText = ''
                }
            }
        })
    }

    bindToggleTodo(handler) {
        this.todoList.addEventListener('change', event => {
            if (event.target.type === 'checkbox') {
                const id = this._findTaskId(event.target)
                if (id) {
                    handler(id)
                }
            }
        })
    }

    _findTaskId(element) {
        // Traverse up the DOM to find the task container with an ID
        let current = element;
        while (current && current !== this.todoList) {
            if (current.id) {
                const id = parseInt(current.id);
                if (!isNaN(id)) {
                    return id;
                }
            }
            current = current.parentElement;
        }
        return null;
    }
}