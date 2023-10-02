document.addEventListener('DOMContentLoaded', pageLoaded);

const todos = [];
const RENDER_EVENT = 'render-todo';

function pageLoaded() {
  const submitForm = document.getElementById('form');
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addTodo();
    event.target.reset();
  });
}

function addTodo() {
  const title = document.getElementById('title').value;
  const date = document.getElementById('date').value;

  const id = generatedId();
  const todo = generateTodo(id, title, date, false);
  todos.push(todo);

  document.dispatchEvent(new Event(RENDER_EVENT));
  //RENDER_EVENT for apply data after save to array todos
}

function generatedId() {
  return +new Date();
}

function generateTodo(id, title, date, state) {
  return {
    id,
    date,
    state,
    title,
  };
}

function createTodo(todo) {
  const titleElement = document.createElement('h2');
  titleElement.innerText = todo.title;

  const dateElement = document.createElement('p');
  dateElement.innerText = todo.date;

  const containerElement = document.createElement('div');
  containerElement.classList.add('inner');
  containerElement.append(titleElement, dateElement);

  const sectionElement = document.createElement('div');
  sectionElement.classList.add('item', 'shadow');
  sectionElement.append(containerElement);
  sectionElement.setAttribute('id', `todo-${todo.id}`);

  if (todo.state) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');

    undoButton.addEventListener('click', function () {
      undoTaskFromCompleted(todo.id);
    });

    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(todo.id);
    });

    sectionElement.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');

    checkButton.addEventListener('click', function () {
      addTaskToCompleted(todo.id);
    });

    sectionElement.append(checkButton);
  }

  return sectionElement;
}

function addTaskToCompleted(id) {
  const todoTarget = findTodo(id);

  if (todoTarget == null) return;

  todoTarget.state = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeTaskFromCompleted(id) {
  const todoTarget = findTodoIndex(id);

  if (todoTarget !== -1) {
    todos.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  return;
}

function undoTaskFromCompleted(id) {
  const todoTarget = findTodo(id);

  if (todoTarget !== null) {
    todoTarget.state = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  return;
}

function findTodo(id) {
  for (const todo of todos) {
    if (todo.id === id) {
      return todo;
    }
  }

  return null;
}

function findTodoIndex(id) {
  for (const index in todos) {
    if (todos[index].id === id) {
      return index;
    }
  }

  return -1;
}

function render() {
  const unCompletedTodoList = document.getElementById('uncompleted-todos');
  const completedTodoList = document.getElementById('completed-todos');

  unCompletedTodoList.innerHTML = '';
  completedTodoList.innerHTML = '';

  for (const todo of todos) {
    const todoElement = createTodo(todo);

    if (!todo.state) {
      unCompletedTodoList.append(todoElement);
    } else {
      completedTodoList.append(todoElement);
    }
  }
}

document.addEventListener(RENDER_EVENT, render);
