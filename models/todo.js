class Todo {

    //attributes
    #id;
    #title;
    #complete;

    constructor({ id= `${Date.now().toString(36)}`, title = '', complete = false}) {
        this.#id = id;
        this.#title = title;
        this.#complete = complete;
    }

    // getters and setters
    get id() { return this.#id; }

    get title() { return this.#title; }
    set title(title) {
        return this.#title = title
    }

    get complete() { return this.#complete; }
    set complete(complete) {
        this.#complete = complete
    }

    // methodes CRUD
    
}