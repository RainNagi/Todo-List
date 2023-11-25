const newTaskInput = document.getElementById("newtask");
const addButton = document.getElementById("submit");
const taskToDoButton = document.getElementById("tasktodo");
const completedButton = document.getElementById("completed");
const trashallButton = document.getElementById("bin");
const clearButton = document.getElementById("clear");
const tasksContainer = document.getElementById("tasksContainer");

// Check if tasks are stored in localStorage
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];


tasks.forEach(function (task) {
    ViewTask(task);
});


addButton.addEventListener("click", function () {
    const taskText = newTaskInput.value.trim();
    if (taskText !== "") {
        const task = {
            text: taskText,
            completed: false,
        };
        tasks.push(task);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        ViewTask(task);
        newTaskInput.value = "";

        taskToDoButton.click();
    }
    else{
        alert("Please enter a task");
    }
});

function ViewTask(task) {
    const taskElement = document.createElement("span");
    taskElement.className = "tasks";
    taskElement.innerHTML = `
        <div class="task">
            <div class="content">
                <input type="checkbox" ${task.completed ? "checked" : ""}>
                <input type="text" class="text" value="${task.text}" readonly>
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </div>
        </div>
    `;

    // Add event listener for checkbox
    taskElement.querySelector("input[type='checkbox']").addEventListener("change", function () {
        task.completed = !task.completed;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        ViewTasks();
    });
    
    if (task.completed) {
        // Hide the Edit button
        taskElement.querySelector(".edit").style.display = "none";
        taskElement.querySelector(".delete").style.marginLeft = "100px";
          
    } else {
        // Show the Edit button
        taskElement.querySelector(".edit").style.display = "inline-block";
    }

    
    taskElement.querySelector(".edit").addEventListener("click", function () {
        const editInput = document.createElement("input");
        editInput.style.marginLeft = "42px"
        editInput.classList = "text"
        editInput.type = "text";
        editInput.value = task.text;
    
        const saveButton = document.createElement("button");
        saveButton.style.marginLeft = "3px";
        saveButton.style.marginRight = "4px";
        saveButton.classList = "edit"
        saveButton.innerText = "Save";
    
        const cancelButton = document.createElement("button");
        cancelButton.classList = "delete"
        cancelButton.innerText = "Cancel";
    
        // Replace the content with the edit input and buttons
        taskElement.querySelector(".content").innerHTML = "";
        taskElement.querySelector(".content").appendChild(editInput);
        taskElement.querySelector(".content").appendChild(saveButton);
        taskElement.querySelector(".content").appendChild(cancelButton);
        
        editInput.focus();
    
        //To save Edit
        saveButton.addEventListener("click", function () {
            task.text = editInput.value;
            localStorage.setItem("tasks", JSON.stringify(tasks));
            ViewTasks();
        });
    
        //To cancel Edit
        cancelButton.addEventListener("click", function () {
            ViewTasks();
        });
    });

    //Delete form localStorage
    taskElement.querySelector(".delete").addEventListener("click", function () {
        const index = tasks.indexOf(task);
        tasks.splice(index, 1);
        localStorage.setItem("tasks", JSON.stringify(tasks));
        ViewTasks();
    });

    tasksContainer.appendChild(taskElement);
}

function ViewTasks() {
    tasksContainer.innerHTML = "";
    const selectedButton = document.querySelector(".button-group .active");
    const showCompleted = selectedButton.id === "completed";

    tasks.forEach(function (task) {
        if ((showCompleted && task.completed) || (!showCompleted && !task.completed)) {
            ViewTask(task);
        }
    });

    // Update the text of the header based on the selected button
    const tasksHeader = document.querySelector(".task-container h2");
    tasksHeader.innerText = showCompleted ? "Completed Tasks" : "Tasks";
}


// for buttons to function
[taskToDoButton, completedButton].forEach(function (button) {
    button.addEventListener("click", function () {
        document.querySelector(".button-group .active").classList.remove("active");
        button.classList.add("active");
        ViewTasks();
    });
});

// Clear tasks in condition
clearButton.addEventListener("click", function () {
    const selectedButton = document.querySelector(".button-group .active");
    const showCompleted = selectedButton.id === "completed";

    const tasksToClear = showCompleted ? tasks.some(task => task.completed) : tasks.some(task => !task.completed);
    
    if (tasksToClear) {
        if (showCompleted) {
            // Clear only completed tasks
            if (confirm("Are you sure you want to clear all completed tasks?")) {
                const updatedTasks = tasks.filter(task => !task.completed);
                localStorage.setItem("tasks", JSON.stringify(updatedTasks));
                tasks.length = 0; // Clear the original array
                tasks.push(...updatedTasks); // Add the updated tasks back to the original array
                ViewTasks();
            }
        } else {
            // Clear only tasks that are not completed
            if (confirm("Are you sure you want to clear all tasks that are not completed?")) {
                const updatedTasks = tasks.filter(task => task.completed);
                localStorage.setItem("tasks", JSON.stringify(updatedTasks));
                tasks.length = 0; // Clear the original array
                tasks.push(...updatedTasks); // Add the updated tasks back to the original array
                ViewTasks();
            }
        }
    } else {
        alert("There are no tasks to clear.");
    }
});

// Clear all tasks
trashallButton.addEventListener("click", function () {
    if (tasks.length > 0) {
        if (confirm("Are you sure you want to clear all tasks?")) {
            localStorage.removeItem("tasks");
            tasks.length = 0; // Clear tasks 
            ViewTasks();
        }
    } else {
        alert("There are no tasks to clear.");
    }
});
ViewTasks();

