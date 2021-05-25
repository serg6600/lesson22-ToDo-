'use strict';

class ToDo {
    constructor(form, input, todoList, todoCompleted) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todoData = new Map(JSON.parse(localStorage.getItem('todoList')));
    }

    addToStorage(){
        localStorage.setItem('todoList', JSON.stringify([...this.todoData]));
    }
    render() {
        this.todoCompleted.textContent = '';
        this.todoList.textContent = '';
        this.todoData.forEach(this.createItem, this);
        this.addToStorage();
    }

    createItem(item) {
        const li = document.createElement('li');
        li.classList.add('todo-item');
        li.key = item.key;
        li.insertAdjacentHTML('beforeend', `
            <span class="text-todo">${item.value}</span>
            <div class="todo-buttons">
                <button class="todo-remove"></button>
                <button class="todo-complete"></button>
            </div>
        `);
        if (item.completed) {
            this.todoCompleted.append(li);
        } else {
            this.todoList.append(li);
        }
    }

    addTodo(e) {
        e.preventDefault();
        if (this.input.value.trim()) {
            const newTodo = {
                value: this.input.value,
                completed: false,
                key: this.generateKey()
            };
            this.todoData.set(newTodo.key, newTodo);
            this.input.value = '';
            this.render();
        } else { alert('Пустое дело - это не дело!'); }
    }

    generateKey() {
        return Math.random().toString(16).substring(2, 10);
    }

    deleteItem(li){
        this.todoData.delete(li.key);
        this.render();
    }

    completedItem(li){
        this.todoData.forEach((item) => {
            if (li.key === item.key) {
                item.completed = !item.completed;
            }
        });
        this.render();
    }

    handler(){
        const container = document.querySelector('.todo-container');
        container.addEventListener('click', (event) => {
            const target = event.target;
            const li = target.parentNode.parentNode;
            if (target.classList.contains('todo-remove')) { this.deleteItem(li); }
            else if (target.classList.contains('todo-complete')) { this.completedItem(li); }
        });
    }

    init() {
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.render();
        this.handler();
    }
}

const todo = new ToDo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();