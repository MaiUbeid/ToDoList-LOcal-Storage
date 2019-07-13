var todoFunctions = {
  generateId: (function() {
    var idCounter = 0;
    function incrementCounter() {
      return (idCounter += 1);
    }
    return incrementCounter;
  })(),
  cloneArrayOfObjects: function(todos) {
    return todos.map(function(todo) {
      return JSON.parse(JSON.stringify(todo));
    });
  },
  addTodo: function(todos, newTodo) {
    var newArr = this.cloneArrayOfObjects(todos);
    var newObject = {
      id: this.generateId(),
      description: newTodo,
      done: false
    };
    newArr.push(newObject);
    return newArr;
  },
  deleteTodo: function(todos, idToDelete) {
    var newArr = this.cloneArrayOfObjects(todos);
    newArr = newArr.filter(e => e.id != idToDelete);
    return newArr;
  },
  markTodo: function(todos, idToMark) {
    var clonedArray = this.cloneArrayOfObjects(todos);
    clonedArray.forEach(todo => {
      if (todo.id === idToMark) {
        if (todo.done == true) todo.done = false;
        else todo.done = true;
      }
    });
    return clonedArray;
  },
  sortTodos: function(todos, sortFunction) {
    var clonedArray = this.cloneArrayOfObjects(todos);
    clonedArray.sort(sortFunction);
    return clonedArray;
  },
  editTodo: function(todos, toDoId, newTodo) {
    var newArr = this.cloneArrayOfObjects(todos);
    newArr = newArr.map(function(item) {
      if (item.id == toDoId) {
        item.description = newTodo;
      }
      return item;
    });
    return newArr;
  },
  clearAll: function(todos) {
    return [];
  }
};

// Why is this if statement necessary?
// The answer has something to do with needing to run code both in the browser and in Node.js
// See this article for more details:
// http://www.matteoagosti.com/blog/2013/02/24/writing-javascript-modules-for-both-browser-and-node/
if (typeof module !== 'undefined') {
  module.exports = todoFunctions;
}