let todoList, deletedTasks;

loadFromStorage();
function loadFromStorage() {
  todoList = JSON.parse(localStorage.getItem('todoList')) || [
  {
    name: 'Coding and Workout!',
    dueDate: "2027-12-2",

    completed: false,
    editing: false,
  },
  {
    name: 'Go Out!',
    dueDate: '2028-2-13',

    completed: false,
    editing: false,
  }];

  deletedTasks = JSON.parse(localStorage.getItem('deletedTasks')) || [];


}

function saveToStorage() {
  localStorage.setItem('todoList', JSON.stringify(todoList));
  localStorage.setItem('deletedTasks', JSON.stringify(deletedTasks))
}

document.querySelector('.js-add-btn').addEventListener('click', () => {
  addTodo();
})

document.querySelector('.js-task-input').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTodo();
  };
})

document.querySelector('.js-due-date-input').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTodo();
  };
})

document.querySelector('.js-menu-btn').addEventListener('click', 
  toggleSidebar
);

document.querySelector('.js-bin-header').addEventListener('click',
  toggleBin
)

document.querySelector('.js-search-btn').addEventListener('click',
  renderTodoList()
)

document.querySelector('.js-search-input').addEventListener('input',
  renderTodoList
)

document.querySelector('.js-about-header').addEventListener('click',
  toggleAbout
)

function toggleSidebar() {
  document.querySelector('.js-sidebar-left').classList.toggle('sidebar-left-open');

}

function toggleBin() {
  document.querySelector('.js-bin-panel').classList.toggle('bin-open');

  const arrow = document.querySelector('.js-bin-arrow');

  if (document.querySelector('.js-bin-panel').classList.contains('bin-open')
  ) {
    arrow.innerHTML = '▾';
  } else {
    arrow.innerHTML = '▸';
  }
}

function toggleAbout() {
  document.querySelector('.js-about-panel').classList.toggle('about-open')

  const arrow = document.querySelector('.js-about-arrow');

  if (document.querySelector('.js-about-panel').classList.contains('about-open')
  ) {
    arrow.innerHTML = '▾';
  } else {
    arrow.innerHTML = '▸';
  }
}

function addTodo() {
  const inputElement = document.querySelector('.js-task-input');
  const name = inputElement.value;
  const warningElement = document.querySelector('.js-warning');

  if (name.trim() === "") {
    warningElement.innerHTML = 'Please enter a task';
    return;
  } else {
    warningElement.innerHTML = '';
  }

  const dueDateElement = document.querySelector('.js-due-date-input');
  const dueDate = dueDateElement.value;

  pushValues(name, dueDate)

  saveToStorage();
  renderTodoList();
  updateStatistics();
  renderStatistics();

  inputElement.value = '';
  dueDateElement.value = '';

}

function renderTodoList() {
  let todoListHTML = '';

  if (todoList.length === 0) {
    document.querySelector('.js-todo-list').innerHTML = `
      <div class="empty-card">

        <h2>🌱Nothing here yet!</h2>

        <p>
          Plant your first task now!
        </p>
      </div>
    `;
    
    return;
  }

  const searchText = document.querySelector('.js-search-input').value;
  const filteredTodoList = todoList.filter((todo) => {
    
    return todo.name
      .toLowerCase()
      .includes(
        searchText.toLowerCase()
      );
  })

   if (filteredTodoList.length === 0) {
    document.querySelector('.js-todo-list').innerHTML = `
      <div class="empty-search-card">

        <h2>
          🔎 No matching tasks found
        <h2>

        <p>
          Try another keyword
        </p>

      </div>
    `;

    return;
   }

  filteredTodoList.forEach((task, index) => {
    const { name, dueDate, completed, editing } = task;

    if (editing) {
      const html = `
          <div class="edit-card">
            <div class="edit-info">
              <input type="checkbox" ${completed ? 'checked' : ''} onclick="
                toggleCompleted(${index});
              ">
              <input class="edit-name-input js-edit-name" value="${name}">

              <input class="edit-date-input js-edit-date" type="date" value="${dueDate}">
            </div>

            <div class="edit-buttons">
              <button class="save-btn" onclick="
                saveEdit(${index});
              ">Save</button>

              <button class="cancel-btn" onclick="cancelEdit(${index})">Cancel</button>

              <button class="delete-btn js-delete-btn" onclick="
                deleteTodo(${index});
              ">Delete</button>
            </div>
          </div>
      `;
      todoListHTML += html;

      updateStatistics();
      renderStatistics();
    } else {
      const html = `
        <div class="todo-card">
          <div class="task-info">
            <input type="checkbox" ${completed ? 'checked' : ''} onclick="
              toggleCompleted(${index});
              
            ">
            <p class="task-name ${completed ? 'completed' : ''}">${name}</p>

            <p class="task-date">${dueDate}</p>

          </div>

          <div class="edit-del-btn">
            <button class="edit-button" onclick="
              editTodo(${index});
            ">Edit</button>

            <button class="delete-btn js-delete-btn" onclick="
              deleteTodo(${index});
            ">Delete</button>
          </div>
        </div>
      `;
      todoListHTML += html;

      updateStatistics();
      renderStatistics();
    };
  });

  document.querySelector('.js-todo-list').innerHTML = todoListHTML;
}

function updateStatistics() {
  const totalTasks = todoList.length;
  let completedTask = 0;
  let pendingTask = 0;

  todoList.forEach((todo, index) => {
    if (todo.completed) {
      completedTask++;
    } else {
      pendingTask++;
    }
  })

  return {
    totalTasks,
    completedTask,
    pendingTask
  }
}

function renderStatistics() {
  const statsElement = document.querySelector('.js-stats-panel');
  const {totalTasks, completedTask, pendingTask} = updateStatistics();

  statsElement.innerHTML = `
    <h2 class="statistics-title">Statistics</h2>
    <div class="stat-card">
      <p class="stat-label">📝 Total Tasks</p>
      <p class="stat-number">${totalTasks}</p>
    </div>
    
    <div class="stat-card">
      <p class="stat-label">✅ Completed</p>
      <p class="stat-number">${completedTask}</p>
    </div>

    <div class="stat-card">
      <p class="stat-label">⏳ Pending</p>
      <p class="stat-number">${pendingTask}</p>
    </div>
  `;

}

function renderDeletedTasks() {

  document.querySelector('.js-bin-count').innerHTML = deletedTasks.length;

  let deletedTasksHTML = '';
  
  if (deletedTasks.length === 0) {
    document.querySelector('.js-deleted-tasks').innerHTML = `
      <div class="empty-bin-card">
        <div class="empty-bin-title">
          🌱 Recycle Bin Empty
        </div>

        <div class="empty-bin-message">

          Nothing awaits the void today.

        </div>

      </div>
    `;

    return;
  }

  deletedTasks.forEach((task, index) => {
    const {name, dueDate, completed} = task;
    const html = `
      <div class="deleted-card">
        <div class="task-info">

          <p class="task-name">${name}</p>
          <p class="task-date">${dueDate}</p>
        
        </div>

        <button class="restore-button" onclick="
          restoreTask(${index});
        ">
          ♻️ Restore
        </button>

        <button class="permanent-delete-btn" onclick="
          deletePermanently(${index});
        ">Delete
        </button>
      </div>
    `;

    deletedTasksHTML += html;
  });
  deletedTasksHTML += `
    <button class="empty-bin-button" onclick="
      emptyBin();
    ">☢️ Empty Bin</button>
  `;

  document.querySelector('.js-deleted-tasks').innerHTML = deletedTasksHTML;
}

function renderAbout() {
  document.querySelector('.js-about-panel').innerHTML = `
      <h2>
        🌱 TaskForge
      <h2>

      <p>
        A cozy productivity companion.
      </p>

      <p>
        Built by StarCoder 😎
      </p>

      <hr>

      <p>
        Made with:
      </p>
      
      <p>
        💻 HTML
      </p>
      <p>
        🎨 CSS
      </p>
      <p>
        ⚡ JavaScript
      </p>
      <p>
        Version 1.0
      </p>
      <p>
        "Small progress is still a progress."
      </p>
    </div>
  `
}

function toggleCompleted(index) {
  todoList[index].completed = !todoList[index].completed;

  renderTodoList();
  saveToStorage();
}

function editTodo(index) {
  todoList[index].editing = true;
  renderTodoList();
}

function deleteTodo(index) {
  deletedTasks.push(todoList[index]);
  todoList.splice(index, 1);

  renderTodoList();
  saveToStorage();
  updateStatistics();
  renderDeletedTasks();
  renderStatistics();
}

function restoreTask(index) {
  todoList.push(deletedTasks[index]);

  deletedTasks.splice(index, 1);

  saveToStorage();
  updateStatistics();  
  renderTodoList();
  renderDeletedTasks();
}

function deletePermanently(index) {
  if (confirm(
    'This task will be lost forever. Continue?'
  )){
    deletedTasks.splice(index, 1)

    saveToStorage();
    renderDeletedTasks();
  }
}

function emptyBin() {
  if (confirm(
    'All deleted tasks will be pernanently lost. Continue?'
  )) {

    deletedTasks = [];

    saveToStorage();
    renderDeletedTasks();
  }
}

function cancelEdit(index) {
  todoList[index].editing = false;

  renderTodoList();
}

function saveEdit(index) {
  let nameEditElement = document.querySelector(".js-edit-name").value;
  todoList[index].name = nameEditElement;

  let dateEditElement = document.querySelector(".js-edit-date").value;
  todoList[index].dueDate = dateEditElement;

  todoList[index].editing = false;

  saveToStorage();
  renderTodoList();
  updateStatistics();
}

function updateDateTime() {
  const {hour, minutes, day, year, month, weekday} = getDateTime();

  const monthName = getMonths(month);
  const weekdayName = getWeekDays(weekday);
  const currentDate = `${day} ${monthName} ${year}`;

  const {displayHour, displayMinutes, period} = getTime(hour, minutes);
  const currentTime = `${displayHour}:${displayMinutes} ${period}`;

  document.querySelector('.js-date-panel').innerHTML = `
    <p class="current-day js-current-day">📅 ${weekdayName}</p>
    <p class="current-date js-current-date">${currentDate}</p>
    <p class="current-time js-current-time">🕧 ${currentTime}</p>
  `;
}

function updateGreeting() {
  let greeting = '';
  const hour = getDateTime();

  if (hour >= 5 && hour < 12) {
    greeting = '☀️ Good Morning!';
  } else if (hour >= 12 && hour < 17) {
    greeting = '🌤️ Good Afternoon!'
  } else if (hour >= 17 && hour <= 21) {
    greeting = '🌆 Good Evening!'
  } else {
    greeting = '🌙 Good Night!'
  }
  
  document.querySelector('.js-greeting').innerHTML = greeting;
}

function updateQuote() {
  const quotes = [
    "Small progress is still a progress.",
    "Consistency beats intensity",
    "One task at a time.",
    "Discipline is remembering what you want.",
    "Done is better than perfect.",
    "Success is the sum of small efforts repeated daily.",
    "The best time to plant a tree was 20 years ago. The second best time is now.",
    "Little by little, a little becomes a lot."
  ]

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  document.querySelector('.js-quote').innerHTML = randomQuote;
}

function initializeSidebar() {
   updateGreeting();
   updateQuote();
   updateDateTime();
}

function pushValues(name, dueDate, completed=false, editing=false) {
  todoList.push({
    name,
    dueDate,
    completed,
    editing
  });
}

function getDateTime() {
  const now = new Date();

  const hour = now.getHours();
  const minutes = now.getMinutes();
  const day = now.getDate();
  const year = now.getFullYear();
  const month = now.getMonth();
  const weekday = now.getDay();

  return {
    hour,
    minutes,
    day,
    year,
    month,
    weekday
  }
}

function getMonths(month) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'Septemper', 'Octoper', 'November', 'December'
  ]

  return months[month];
}

function getWeekDays(weekday) {
  const weekdays = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday'
  ]

  return weekdays[weekday];
}

function getTime(hour, minutes) {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayMinutes = String(minutes).padStart(2,'0');

  let displayHour = hour % 12;

  if (displayHour === 0) {
    displayHour = 12;
  }

  return {
    period,
    displayMinutes,
    displayHour
  }
}

loadFromStorage();
initializeSidebar();
renderTodoList();
renderStatistics()
renderDeletedTasks();
renderAbout();