// Dependencies required for the app
var express = require("express");
var bodyParser = require("body-parser");
var expressWinston = require('express-winston');
var winston = require('winston'); // for transports.Console

const session = require('express-session');
const logger = require("./utils/logger");
const router = express.Router();


var app = express();

// Global session variable
global.globalSessionID = "";

app.use(session({
    secret: 'y7t7Ld3rQc',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30
    }
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// express-winston logger makes sense BEFORE the router
app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'logs/todolog.log'
        })
    ],
    format: winston.format.combine(
        winston.format.label({
            label: 'API'
        }),
        winston.format.simple(),
        winston.format.json(),
        winston.format.timestamp({
            format: 'DD-MM-YYYY HH:mm:ss:SSS'
        }),
        winston.format.printf(info => {
            var reqObj = JSON.stringify(info.meta);
            var reqEndpoing = info.meta.req.url;
            var reqMethod = info.meta.req.method;

            let out = `[${info.label}][${info.level}][ReqId:${globalSessionID}][${[info.timestamp]}][${reqMethod}:${reqEndpoing}] ${reqObj}`;
            return out;
        })
    ),
    meta: true
}));

// Now we can tell the app to use our routing code:
app.use(router);

var task = [];
var complete = [];

app.get('/', (req, res, next) => {
    globalSessionID = req.sessionID;
    next();
});

// post route for adding new task 
app.post("/addtask", function (req, res) {
    var newTask = req.body.newtask;
    logger.info("Added new task name : " + JSON.stringify(req.body, null, 2));
    if (newTask == '') return;
    task.push(newTask);
    res.redirect("/");
});

// post route for removing tasks 
app.post("/removetask", function (req, res) {
    globalSessionID = req.sessionID;

    logger.info("Removed task triggered!");
    var completeTask = req.body.removed;
    logger.info("Removed task name : " + JSON.stringify(req.body, null, 2));
    if (typeof completeTask === "string") {
        complete.push(completeTask);
        task.splice(task.indexOf(completeTask), 1);
    } else if (typeof completeTask === "object") {
        for (var i = 0; i < completeTask.length; i++) {
            complete.push(completeTask[i]);
            task.splice(task.indexOf(completeTask[i]), 1);
        }
    }
    res.redirect("/");
});

// render the index page
app.get("/", function (req, res) {
    res.render("index", { task: task, complete: complete });
});

// start server listening on port 3000
app.listen(3000, function () {
    logger.info("server is running on port 3000");
});