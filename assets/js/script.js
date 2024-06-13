const taskFormEl = $('#task-form');
const taskTitleInputEl = $('#task-title-input');
const taskDateInputEl = $('#task-due-date');
const taskDescriptionInputEl = $('#task-description-input');

// Reads tasks from local storage and returns array of task objects.
// If there are no tasks in localStorage, it initializes an empty array ([]) and returns it.
function readTasksFromStorage() {
  let tasks = JSON.parse(localStorage.getItem('tasks'));

  // If no tasks were retrieved from localStorage, assign tasks to a new empty array to push to later.
  if (!tasks) {
    tasks = [];
  }

  // Return the tasks array either empty or with data in it 
  return tasks;
}

// Accepts an array of tasks, stringifys them, and saves them in localStorage.
function saveTasksToStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// function to generate a unique task id
function generateTaskId() {
  const taskTitle = taskTitleInputEl.val().trim();
  const taskDate = taskDateInputEl.val(); // yyyy-mm-dd format
  const taskDescription = taskDescriptionInputEl.val(); 
  
  const task = {
    // uses a Web API called `crypto` to generate a random id for tasks. 
    id: crypto.randomUUID(),
    title: taskTitle,
    dueDate: taskDate,
    description: taskDescription,
    status: 'to-do',
  };
}

// function to create a task card
function createTaskCard(task) {
    const taskCard = $('<div>')
    .addClass('card task-card draggable my-3')
    .attr('data-task-id', task.id);
  const cardHeader = $('<div>').addClass('card-header h4').text(task.title);
  const cardBody = $('<div>').addClass('card-body');
  const cardDueDate = $('<p>').addClass('card-text').text(task.dueDate);
  const cardDescription = $('<p>').addClass('card-text').text(task.description);
  const cardDeleteBtn = $('<button>')
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-task-id', task.id);
  cardDeleteBtn.on('click', handleDeleteProject);
}

// function to render the task list and make cards draggable
function renderTaskList() {
    function printTaskData() {
        const tasks = readTasksFromStorage();
      
        // ? Empty existing task cards out of the lanes
        const todoList = $('#todo-cards');
        todoList.empty();
      
        const inProgressList = $('#in-progress-cards');
        inProgressList.empty();
      
        const doneList = $('#done-cards');
        doneList.empty();
      
        // ? Loop through tasks and create task cards for each status
        for (let task of tasks) {
          if (task.status === 'to-do') {
            todoList.append(createTaskCard(task));
          } else if (task.status === 'in-progress') {
            inProgressList.append(createTaskCard(task));
          } else if (task.status === 'done') {
            doneList.append(createTaskCard(task));
          }
        }
      
        // Use JQuery UI to make task cards draggable
        $('.draggable').draggable({
          opacity: 0.7,
          zIndex: 100,
          // This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
          helper: function (e) {
            // Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
            const original = $(e.target).hasClass('ui-draggable')
              ? $(e.target)
              : $(e.target).closest('.ui-draggable');
            // ? Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
            return original.clone().css({
              width: original.outerWidth(),
            });
          },
        });
      }
}

// function to handle adding a new task
function handleAddTask(event){
// Add event listener to the form element, listen for a submit event, and call the `handleTaskFormSubmit` function.
taskFormEl.on('submit', handleTaskFormSubmit);
}

// function to handle deleting a task
function handleDeleteTask(event){
  taskDisplayEl.on('click', '.btn-delete-project', handleDeleteTask);
}

// function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
 // Read tasks from localStorage
 const tasks = readTasksFromStorage();

 // Get the task id from the event
 const task = ui.draggable[0].dataset.task;

 // Get the id of the lane that the card was dropped into
 const newStatus = event.target.id;

 for (let task of tasks) {
   // Find the task card by the `id` and update the project status.
   if (task.id === task) {
     task.status = newStatus;
   }
 }
 // Save the updated projects array to localStorage (overwritting the previous one) and render the new project data to the screen.
 localStorage.setItem('tasks', JSON.stringify(tasks));
 printTaskData();
}

// when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  // Print task data to the screen on page load if there is any
  printTaskData();

  $('#taskDueDate').datepicker({
    changeMonth: true,
    changeYear: true,
  });

  // Make lanes droppable
  $('.lane').droppable({
    accept: '.draggable',
    drop: handleDrop,
  });
});

