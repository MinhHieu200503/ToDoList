const toDoList = require("./toDoList")
const work = require("./work")
function routes(app){
    app.use("/toDoList/work",work)
    app.use("/toDoList",toDoList);
}

module.exports = routes