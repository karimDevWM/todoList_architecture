class Category{
    #title;
    #color;

    /**
     *
     */
    constructor({ title = '' } = {}) {
        this.title = '';
        this.#color = '';
        this.title = title;
    }

    static colorFor(title) {
        const t = String(title).trim().toLowerCase()
        if (t === 'work') return '#FF000099';
        if (t === 'house') return '#0000CD';
        return '#008000';
    }

    get title() { return this.#title; }
    set title(value) {
        this.#title = String(value);
        this.#color = Category.colorFor(this.#title);
    }

    get color() { return this.#color; }

    toObject() {
        return { title: this.#title, color: this.#color };
    }

    static from(obj = {}) {
        return new Category({ title: obj.title || '' });
    }
}