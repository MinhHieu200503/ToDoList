const toDoList = require("./toDoList")
const work = require("./work")
const taskList = require("./tasks.js")
function routes(app){
    app.use("/toDoList/work",work)
    app.use("/toDoList",toDoList);
    app.use("/task",taskList)
    app.get("/",(req,res)=>{
        res.status(200).render("work",{
            hi:"hhi"
        })
    })
}

module.exports = routes