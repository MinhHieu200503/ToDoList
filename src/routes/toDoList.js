const router = require("express").Router();
const ToDoListController = require("../controller/toDoList.js");
const WorksController = require("../controller/works.js")
router.post("/:idList/works",WorksController.addWorks)
router.get("/:idList",ToDoListController.getAToDoList)
router.get("/",ToDoListController.getAllToDoList)

module.exports = router