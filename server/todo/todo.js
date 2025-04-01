const fs = require('fs');
const filePath = "./tasks.json";

const loadTasks = ( ) => {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (err) {
        return []
    }
}

const saveTasks = (tasks) => {
   const dataJSON =  JSON.stringify(tasks);
   fs.writeFileSync(filePath, dataJSON);
   console.log("Task added successfully");
}


const addTask = (task) => {
    const tasks = loadTasks();
    tasks.push({task})
    saveTasks(tasks);
}

const command = process.argv[2];
const argument = process.argv[3];

if (command === "add") {
    addTask(argument);
} else if (command === "list" ){
    listTasks()
} else if (command === "remove") {
    removeTask(parseInt(argument));
} else {
    console.log("Command not recognised");
}


