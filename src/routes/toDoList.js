const router = require("express").Router();
const ToDoListController = require("../controller/toDoList.js");
const WorksController = require("../controller/works.js")
router.get("/allWorks",WorksController.getAllWork);
router.post("/:idList/works",WorksController.checkIdList,WorksController.configTime,WorksController.addWorks);
router.get("/:idList/works",WorksController.checkIdList,WorksController.getAllWorksOnDate);
router.delete("/:idList/:idDate",WorksController.checkIdList,WorksController.deleteADate)
router.get("/:idList",ToDoListController.getAToDoList);
router.get("/",ToDoListController.getAllToDoList);

module.exports = router