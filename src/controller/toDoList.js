const {Works,ToDoList} = require("../model/model.js");
const Task = require("../model/tasks.js") 
const ToDoListController ={
    createToDoList:async(req,res)=>{
        // (POST) => (name)
        try {
            if(req.body.name.trim()===""){
               res.status(200).render("messCreate",{
                "status":"Thất bại!!! . vui lòng nhập tên to Do List",
                "pageTitle":"Status"
                
               }) 
               return
            }
            const newToList = await ToDoList.insertMany({name:req.body.name}) 
            res.status(200).render("messCreate",{
                "pageTitle":"Status",
                "status":`Tạo thành công
                To do list: ${JSON.stringify(req.body)}`
            });
        } catch (error) {
            res.status(500).render("messCreate",{
                "pageTitle":"Status",
                "status":`Thất bại`
            });
        }        
    },
    getAllToDoList:async(req,res)=>{
        try {
            const list = await ToDoList.find();
            const task = await Task.ToDoList.find()
            console.log(list)
            res.status(200).render("home",{
                "list":list,
                "task":task,
                "pageTitle":"Home Page"
            })
        } catch (error) {
            res.status(500).json(error)           
        }
    },
    getAToDoList:async(req,res)=>{
        try {
            const aToDo = await ToDoList.findById(req.params.idList).populate('dates');
            console.log(aToDo)
            res.status(200).render("toDo",{
                "pageTitle":`${aToDo.name}`,
                "toDo":aToDo,
                "signal":"-"
            })
        } catch (error) {
            res.status(500).json(error)
        }
    }


}

module.exports = ToDoListController