const taskFormEl = $('#task-form');
const taskNameInputEl = $('#project-name-input');
const taskTypeInputEl = $('#project-type-input');
const taskDateInputEl = $('#taskDueDate');

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
  const taskName = taskNameInputEl.val().trim();
  const taskType = taskTypeInputEl.val(); // don't need to trim select input
  const taskDate = taskDateInputEl.val(); // yyyy-mm-dd format
  
  const taskId = {
    // ? Here we use a Web API called `crypto` to generate a random id for our project. This is a unique identifier that we can use to find the project in the array. `crypto` is a built-in module that we can use in the browser and Nodejs.    id: crypto.randomUUID(),
    name: taskName,
    type: taskType,
    dueDate: taskDate,
    status: 'to-do',
  };
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = $('<div>')
    .addClass('card project-card draggable my-3')
    .attr('data-project-id', project.id);
  const cardHeader = $('<div>').addClass('card-header h4').text(project.name);
  const cardBody = $('<div>').addClass('card-body');
  const cardDescription = $('<p>').addClass('card-text').text(project.type);
  const cardDueDate = $('<p>').addClass('card-text').text(project.dueDate);
  const cardDeleteBtn = $('<button>')
    .addClass('btn btn-danger delete')
    .text('Delete')
    .attr('data-project-id', project.id);
  cardDeleteBtn.on('click', handleDeleteProject);
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    function printProjectData() {
        const projects = readProjectsFromStorage();
      
        // ? Empty existing project cards out of the lanes
        const todoList = $('#todo-cards');
        todoList.empty();
      
        const inProgressList = $('#in-progress-cards');
        inProgressList.empty();
      
        const doneList = $('#done-cards');
        doneList.empty();
      
        // ? Loop through projects and create project cards for each status
        for (let project of projects) {
          if (project.status === 'to-do') {
            todoList.append(createProjectCard(project));
          } else if (project.status === 'in-progress') {
            inProgressList.append(createProjectCard(project));
          } else if (project.status === 'done') {
            doneList.append(createProjectCard(project));
          }
        }
      
        // ? Use JQuery UI to make task cards draggable
        $('.draggable').draggable({
          opacity: 0.7,
          zIndex: 100,
          // ? This is the function that creates the clone of the card that is dragged. This is purely visual and does not affect the data.
          helper: function (e) {
            // ? Check if the target of the drag event is the card itself or a child element. If it is the card itself, clone it, otherwise find the parent card  that is draggable and clone that.
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

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    projectFormEl.on('submit', handleProjectFormSubmit);
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

});
