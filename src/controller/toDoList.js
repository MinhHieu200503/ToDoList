const {Works,ToDoList} = require("../model/model.js");
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
            res.status(200).render("home",{
                "list":list,
                "pageTitle":"Home Page"
            })
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