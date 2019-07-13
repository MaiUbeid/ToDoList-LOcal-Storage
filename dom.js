(function () {
  var container = document.getElementById("todo-container");
  var addTodoForm = document.getElementById("add-todo");
  var x = document.getElementsByTagName("BODY")[0];

  var state = [
    { id: -3, description: "first todo", done: false },
    { id: -2, description: "second todo", done: false },
    { id: -1, description: "third todo", done: false }
  ];

  var heading = document.createElement("h1");
  heading.classList.add("heading");
  heading.textContent = "To Do List";
  x.insertBefore(heading, addTodoForm);

  var idSort = document.createElement("button");
  idSort.classList.add("id-sort");
  idSort.textContent = "Sort By Time";

  var descriptionSort = document.createElement("button");
  descriptionSort.classList.add("description-sort");
  descriptionSort.textContent = "Sort By Description";

  var doneSort = document.createElement("button");
  doneSort.classList.add("done-sort");
  doneSort.textContent = "Sort By Done";

  var div = document.createElement("div");
  div.appendChild(descriptionSort);
  div.appendChild(idSort);
  div.appendChild(doneSort);

  div.addEventListener("click", e => {
    e.preventDefault();
    var newState;
    if (e.target.classList.contains("id-sort")) {
      newState = todoFunctions.sortTodos(state, (x, y) => {
        return x.id - y.id;
      });
      update(newState);
    }
    else if (e.target.classList.contains("description-sort")) {
      newState = todoFunctions.sortTodos(state, (x, y) => {
        return x.description.localeCompare(y.description);
      });
      update(newState);
    }
    else if (e.target.classList.contains("done-sort")) {
      newState = todoFunctions.sortTodos(state, (x, y) => {
        return y.done - x.done;
      });
      update(newState);
    }
  });
  addTodoForm.appendChild(div);

  var clearAllButton = document.createElement("button");
  clearAllButton.textContent = "Clear All";
  clearAllButton.addEventListener("click", function (event) {
    event.preventDefault();
    var newState = todoFunctions.clearAll(state);
    update(newState);
  });
  addTodoForm.appendChild(clearAllButton);

  var createTodoNode = function (todo) {
    var todoNode = document.createElement("li");
    var span = document.createElement("span");
    span.textContent = todo.description;
    todoNode.appendChild(span);

    var deleteButtonNode = document.createElement("button");
    deleteButtonNode.classList.add("fas", "fa-trash-alt");
    deleteButtonNode.setAttribute("aria-label", "delete");
    deleteButtonNode.addEventListener("click", function (event) {
      var newState = todoFunctions.deleteTodo(state, todo.id);
      update(newState);
    });
    todoNode.appendChild(deleteButtonNode);

    var markBtn = document.createElement("button");
    markBtn.classList.add("fa", "fa-check");
    markBtn.setAttribute("aria-label", "mark");
    if (todo.done) {
      markBtn.classList.add("done");
      todoNode.firstChild.style.color = "rgb(147, 253, 84) ";
    }
    markBtn.addEventListener("click", function (event) {
      var newState = todoFunctions.markTodo(state, todo.id);
      update(newState);
    });
    todoNode.appendChild(markBtn);

    span.addEventListener("click", function(event) {
      span.contentEditable = "true";
      var newText = event.target.textContent;
    });
    var EditButtonNode = document.createElement("button");
    EditButtonNode.classList.add("fas", "fa-edit");
    EditButtonNode.setAttribute("aria-label", "edit");
    EditButtonNode.addEventListener("click", function(event) {
      var newState = todoFunctions.editTodo(state, todo.id, span.textContent);
      update(newState);
    });
    todoNode.appendChild(EditButtonNode);

    span.classList.add("todo-container-span");
    todoNode.classList.add("todo-container-item");
    div.classList.add("button-container");
    clearAllButton.classList.add("todo-container-clear");
    idSort.classList.add("item-idSort");
    descriptionSort.classList.add("item-descriptionSort");
    doneSort.classList.add("item-doneSort");
    markBtn.classList.add("item-mark");
    EditButtonNode.classList.add("item-edit");
    deleteButtonNode.classList.add("item-delete");

    return todoNode;
  };
  addTodoForm.appendChild(div);

  if (addTodoForm) {
    addTodoForm.addEventListener("submit", function (event) {
      event.preventDefault();
      var description = event.target.querySelector("input").value;
      if (description.trim() == "") {
        alert("Invalid Input");
        return;
      }
      if (!/^[a-zA-Z0-9]|\s+$/.test(description)) {
        alert("Invalid Input");
        return;
      }
      var newState = todoFunctions.addTodo(state, description);
      update(newState);
      event.target.querySelector("input").value = "";
    });
  }

  var update = function (newState) {
    state = newState;
    renderState(state);
    localStorage.setItem('state', JSON.stringify(state));
  };

  var renderState = function (state) {
    var todoListNode = document.createElement("ul");

    state.forEach(function (todo) {
      todoListNode.appendChild(createTodoNode(todo));
    });

    container.replaceChild(todoListNode, container.firstChild);

  };

  if (container) renderState(state);

  if (localStorage.getItem('state') != null) {
    var storage = JSON.parse(localStorage.getItem('state'));
    update(storage);

    var maxid = 0;
    storage.forEach(function (todo) {
      if (todo.id > maxid)
        maxid = todo.id;
    });

    while (maxid > 0) {
      todoFunctions.generateId();
      maxid--;
    }
  }
})();
