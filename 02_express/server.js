import express from 'express';
import colors from 'colors';
import logger from "./logger.js";
import morgan from "morgan";

const morganFormat = ":method :url :status :response-time ms";


const app = express();
const PORT = 8080;

app.use(express.json());

// ✅ Improved logging middleware with colors
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        let statusColor = res.statusCode >= 500 ? colors.red : res.statusCode >= 400 ? colors.yellow : colors.green;
        console.log(colors.cyan(`[${new Date().toISOString()}]`) + 
                    colors.blue(` ${req.method}`) +
                    colors.magenta(` ${req.url}`) +
                    statusColor(` - Status: ${res.statusCode}`) +
                    colors.gray(` - ${duration}ms`));
    });
    next();
});


app.use(
    morgan(morganFormat, {
      stream: {
        write: (message) => {
          const logObject = {
            method: message.split(" ")[0],
            url: message.split(" ")[1],
            status: message.split(" ")[2],
            responseTime: message.split(" ")[3],
          };
          logger.info(JSON.stringify(logObject));
        },
      },
    })
  );
let teaData = [];
let nextId = 1;

// Add a new tea
app.post('/teas', (req, res) => {
    const { name, price } = req.body;
    const newTea = {
        id: nextId++,
        name,
        price
    };
    teaData.push(newTea);
    res.status(201).json(newTea);
});

// Check if server is alive
app.get("/server-alive", (req, res) => {
    res.send("Server is alive");
});

// Get all teas
app.get("/teas", (req, res) => {
    res.json(teaData);
});

// Get the tea with the id
app.get("/teas/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const tea = teaData.find(tea => tea.id === id);

    if (tea) {
        res.json(tea);
    } else {
        res.status(404).send("Tea not found");
    }
});

// Update the tea with the id
app.put("/teas/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { name, price } = req.body;
    const tea = teaData.find(tea => tea.id === id);

    if (tea) {
        tea.name = name;
        tea.price = price;
        res.json(tea);
    } else {
        res.status(404).send("Tea not found");
    }
});

// Delete the tea with the id
app.delete("/teas/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = teaData.findIndex(tea => tea.id === id);
    
    if (index !== -1) {
        const deletedTea = teaData.splice(index, 1);
        res.json(deletedTea);
    } else {
        res.status(404).send("Tea not found");
    }
});

app.listen(PORT, () => {
    console.log(colors.green(`Server is running on http://localhost:${PORT}`));
});