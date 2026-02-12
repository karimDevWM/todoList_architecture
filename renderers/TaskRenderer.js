/**
 * @class TaskRenderer
 * Abstract base class for rendering tasks
 */
class TaskRenderer {
    constructor() {
        if (new.target === TaskRenderer) {
            throw new TypeError("Cannot construct TaskRenderer instances directly - it's an abstract class");
        }
    }

    /**
     * Render a list of tasks
     * @param {Array} tasks - Array of task objects to render
     * @param {HTMLElement} container - Container element to render into
     * @abstract
     */
    render(tasks, container) {
        throw new Error("Method 'render()' must be implemented");
    }

    /**
     * Create an HTML element
     * @param {string} tag - HTML tag name
     * @param {string} className - Optional CSS class name
     * @returns {HTMLElement}
     */
    createElement(tag, className) {
        const element = document.createElement(tag);
        if (className) element.classList.add(className);
        return element;
    }

    /**
     * Clear all children from a container
     * @param {HTMLElement} container
     */
    clearContainer(container) {
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }
    }
}
