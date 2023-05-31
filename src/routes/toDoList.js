const router = require("express").Router();
const ToDoListController = require("../controller/toDoList.js");
const WorksController = require("../controller/works.js")

// routes /allworks
router.get("/allWorks",WorksController.getAllWork);

//routes /:idList
//# [POST]
//* addWorks => params(:idList)
router.post("/:idList/works",WorksController.checkIdList,WorksController.configTime,WorksController.addWorks);

//# [DELETE]
//*deleteADate => params(:idList/:idDate)
router.delete("/:idList/:idDate",WorksController.checkIdList,WorksController.deleteADate);
//*deleteAWork => params(:idList/:idDate/:idWork)
router.delete("/:idList/:idDate/:idWork",WorksController.checkIdList,WorksController.deleteAWork)

//#[UPDATE]

//# [GET]
//*getAllWorksOnDate => params(:idList)
router.get("/:idList/works",WorksController.checkIdList,WorksController.getAllWorksOnDate);
//*getAToDoList => params(:idList)
router.get("/:idList",ToDoListController.getAToDoList);

//route root /
router.post("/",ToDoListController.createToDoList)
router.get("/",ToDoListController.getAllToDoList);

module.exports = router