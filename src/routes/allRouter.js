const toDoList = require("./toDoList")
function routes(app){
    app.use("/toDoList",toDoList);
    
}

module.exports = routes