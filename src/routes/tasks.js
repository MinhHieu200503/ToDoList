const router = require("express").Router();
const ToDoListController = require("../controller/toDoList.js");
const WorksController = require("../controller/works.js")

//test
router.post("/allWorks/test",WorksController.testQuery);
// router.get("/dealine",WorksController.checkDealine)

// routes /allworks
router.get("/allWorks",WorksController.getAllWork);

//routes /:idList
//# [POST]
//* addWorks => params(:idList)
router.post("/:idList/works",WorksController.checkIdList,WorksController.configTime,WorksController.addWorks);

//# [DELETE]
//*deleteADate => params(:idList/:idDate)
router.delete("/:idList/:idDate",WorksController.checkIdList,WorksController.deleteADate);
router.delete("/:idList",WorksController.deleteAList)
//*deleteAWork => params(:idList/:idDate/:idWork)
router.delete("/:idList/:idDate/:idWork",WorksController.checkIdList,WorksController.deleteAWork)

//#[PUT]
//*updateName => params(:idList/:name)
router.put("/:idList/updateName",WorksController.checkIdList,WorksController.updateName)
//*update A Date => params(:idList/:idDate)
router.put("/:idList/:idDate",WorksController.checkIdList,WorksController.configTime,WorksController.updateDate)
//# [GET]
//*getAllWorksOnDate => params(:idList)
router.get("/:idList/works",WorksController.checkIdList,WorksController.getAllWorksOnDate);
//*getAToDoList => params(:idList)
router.get("/:idList",ToDoListController.getAToDoList);

//route root /
router.post("/",ToDoListController.createToDoList)
router.get("/",ToDoListController.getAllToDoList);

module.exports = router