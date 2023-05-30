const create = require("./create");
const toDoList = require("./toDoList")
function routes(app){
    app.use("/toDoList/create",create);
    app.use("/toDoList",toDoList);
}

module.exports = routes