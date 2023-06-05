const WorkController = require("../controller/works");
const router = require("express").Router();

router.get("/sort",WorkController.sortTime)

module.exports = router
