const router = require("express").Router();
const ToDoListController = require("../controller/toDoList");

router.post("/",ToDoListController.createToDoList)

module.exports = router