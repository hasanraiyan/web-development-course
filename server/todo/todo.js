const fs = require('fs');
const filePath = "./tasks.json";

const loadTasks = () => {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (err) {
        return [];
    }
};

const saveTasks = (tasks) => {
    const dataJSON = JSON.stringify(tasks, null, 2); // Formatting for readability
    fs.writeFileSync(filePath, dataJSON);
    console.log("Task list updated successfully");
};

const addTask = (task) => {
    if (!task) {
        console.log("Error: Task cannot be empty");
        return;
    }

    const tasks = loadTasks();
    tasks.push({ task }); // Store tasks as objects with a `task` property
    saveTasks(tasks);
    console.log(`Task added: ${task}`);
};

const listTasks = () => {
    const tasks = loadTasks();
    if (tasks.length === 0) {
        console.log("No tasks found.");
        return;
    }

    console.log("Your Tasks:");
    tasks.forEach((task, index) => {
        console.log(`${index + 1} - ${task.task}`); // Access `task.task`
    });
};

const removeTask = (index) => {
    let tasks = loadTasks();
    if (isNaN(index) || index < 1 || index > tasks.length) {
        console.log("Invalid task number.");
        return;
    }

    const removedTask = tasks.splice(index - 1, 1);
    saveTasks(tasks);
    console.log(`Removed task: ${removedTask[0].task}`);
};

const command = process.argv[2];
const argument = process.argv[3];

if (command === "add") {
    addTask(argument);
} else if (command === "list") {
    listTasks();
} else if (command === "remove") {
    removeTask(parseInt(argument));
} else {
    console.log("Command not recognized. Use 'add', 'list', or 'remove'.");
}
