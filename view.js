/**
 * @class View
 *
 * Visual representation of the model.
 */

class View {
    constructor(taskRenderer = new ListTaskRenderer()) {
        this.taskRenderer = taskRenderer;
        this.app = this.getElement('#root')
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
        this.title = this.createElement('h1')
        this.title.textContent = 'Todos'
        this.todoList = this.createElement('ul', 'todo-list')
        this.app.append(this.title, this.form, this.todoList)

        this._temporaryTodoText = ''
        this._initLocalListeners()
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
        // Delegate rendering to the abstract TaskRenderer
        this.taskRenderer.render(todos, this.todoList);

        // Debugging
        console.log(todos)
    }

    _initLocalListeners() {
        this.todoList.addEventListener('input', event => {
            if (event.target.className === 'editable') {
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
            if (event.target.className === 'delete') {
                const id = parseInt(event.target.parentElement.id)

                handler(id)
            }
        })
    }

    bindEditTodo(handler) {
        this.todoList.addEventListener('focusout', event => {
            if (this._temporaryTodoText) {
                const id = parseInt(event.target.parentElement.id)

                handler(id, this._temporaryTodoText)
                this._temporaryTodoText = ''
            }
        })
    }

    bindToggleTodo(handler) {
        this.todoList.addEventListener('change', event => {
            if (event.target.type === 'checkbox') {
                const id = parseInt(event.target.parentElement.id)

                handler(id)
            }
        })
    }
}