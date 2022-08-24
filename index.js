//dependencies required for the app
var express = require("express");
var bodyParser = require("body-parser");
const logger = require("./utils/logger");
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// global variables
var task = [];
var complete = [];

// post route for adding new task 
app.post("/addtask", function (req, res) {
    logger.info("Added task triggered!");
    logger.warn("Some warrning message");
    logger.debug("Some debug info");
    logger.error("Some error message");

    var newTask = req.body.newtask;
    logger.info("Added new task name : " + JSON.stringify(req.body, null, 2));
    if (newTask == '') return;
    task.push(newTask);
    res.redirect("/");
});

// post route for removing tasks 
app.post("/removetask", function (req, res) {
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