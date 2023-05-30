const {Works,ToDoList} = require("../model/model.js");
const ToDoListController ={
    createToDoList:async(req,res)=>{
        // (POST) => (name)
        try {
            const newToList = await ToDoList.insertMany({name:req.body.name}) 
            res.status(200).json(newToList);
        } catch (error) {
            res.status(500).json(error);
        }        
    },
    getAllToDoList:async(req,res)=>{
        try {
            const list = await ToDoList.find();
            res.status(200).json(list)
        } catch (error) {
            res.status(500).res.json(error)           
        }
    },
    getAToDoList:async(req,res)=>{
        try {
            const aToDo = await ToDoList.findById(req.params.idList);
            res.status(200).json(aToDo)
        } catch (error) {
            res.status(500).json(error)
        }
    }


}

module.exports = ToDoListController