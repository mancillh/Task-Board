const taskFormEl = $('#task-form');
const buttonToSubmitForm = $('#buttonToSubmitForm');
const taskDisplayEl = $('#task-display');
const taskTitleInputEl = $('#task-title-input');
const taskDateInputEl = $('#taskDueDate');
const taskDescriptionInputEl = $('#task-description-input');

console.log(dayjs());
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
};

// Accepts an array of tasks, stringifys them, and saves them in localStorage.
function saveTasksToStorage(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
};

//function to create a task card
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
  cardDeleteBtn.on('click', handleDeleteTask);

  // Sets the card background color based on due date. Only apply the styles if the due Date exists and the status is not done.
  if (task.dueDate && task.status !== 'done') {
    const now = dayjs();
    console.log(now);
    const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY'); 

  // If the task is due today, make the card yellow. If it is overdue, make it red.
  if (now.isSame(taskDueDate, 'day')) {
    taskCard.addClass('bg-warning text-white');
  } else if (now.isAfter(taskDueDate)) {
    taskCard.addClass('bg-danger text-white');
    cardDeleteBtn.addClass('border-light');
  }
 };

  //Gather all the elements created above and append them to the correct elements.
  cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
  taskCard.append(cardHeader, cardBody);
      
  // Return the card so it can be appended to the correct lane.
  return taskCard;
}
          
// function to render the task list and make cards draggable
function renderTaskData() {
  const tasks = readTasksFromStorage();
      
  //Empty existing task cards out of the lanes
  const todoList = $('#todo-cards');
  todoList.empty();
      
  const inProgressList = $('#in-progress-cards');
  inProgressList.empty();
      
  const doneList = $('#done-cards');
  doneList.empty();
  
    //Loop through tasks and create task cards for each status
  for (task of tasks) {
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
    // Return the clone with the width set to the width of the original card. This is so the clone does not take up the entire width of the lane. This is to also fix a visual bug where the card shrinks as it's dragged to the right.
        return original.clone().css({
          width: original.outerWidth(),
        });
      }
    });
  }; 

// function to handle deleting a task
function handleDeleteTask() {
  const taskId = $(this).attr('data-task-id');
  const tasks = readTasksFromStorage();
  
  // Remove task from the array. 
  tasks.forEach((task) => {
    if (task.id === taskId) {
      tasks.splice(tasks.indexOf(task), 1);
    }
  });
};

// Use helper function to save the tasks to localStorage
let tasks = JSON.parse(localStorage.getItem('tasks'));  
saveTasksToStorage(tasks);
 
// Render task data back to screen
renderTaskData();

// function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  // Read user input from form  
  const taskTitle = taskTitleInputEl.val().trim();
  const taskDate = taskDateInputEl.val(); 
  const taskDescription = taskDescriptionInputEl.val(); 

  const newTask = {
    // uses a Web API called `crypto` to generate a random id for tasks. 
    id: crypto.randomUUID(),
    title: taskTitle,
    dueDate: taskDate,
    description: taskDescription,
    status: 'to-do',
  };
  
  // Pull the tasks from localStorage and push the new task to the array
  const tasks = readTasksFromStorage();
  tasks.push(newTask);
   
  // Save the updated tasks array to localStorage
  saveTasksToStorage(tasks);

  // Render task data back to the screen
  renderTaskData();

  // Clear the form inputs
  taskTitleInputEl.val('');
  taskDateInputEl.val('');
  taskDescriptionInputEl.val('');
};

// function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  // Read tasks from localStorage
  const tasks = readTasksFromStorage();
 
  // Get the task id from the event
  const otherId = ui.draggable[0].dataset.taskId;
 
  // Get the id of the lane that the card was dropped into
  const newStatus = event.target.id;
 
  for (let task of tasks) {
    // Find the task card by the `id` and update the task status.
    if (task.id === otherId) {
      task.status = newStatus;
    }
  }
  // Save the updated tasks array to localStorage (overwritting the previous one) and render the new task data to the screen.
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTaskData();
 }

// Listen for a click on the parent element, and THEN check if the target of the click is the delete button. If it is, we call the `handleDeleteProject` function
taskDisplayEl.on('click', '.btn-delete-task', handleDeleteTask);

// when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  // Render task data to the screen on page load if there is any
  renderTaskData();

  $('#taskDueDate').datepicker({
    changeMonth: true,
    changeYear: true,
  });

  // Make lanes droppable
  $('.lane').droppable({
    accept: '.draggable',
    drop: handleDrop,
  });
})