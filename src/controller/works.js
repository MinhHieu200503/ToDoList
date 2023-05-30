const mongoose = require("mongoose");
const {Works,ToDoList} = require("../model/model.js");

const workController = {
    checkIdList:async(req,res,next)=>{
        try {
            
            const find = await ToDoList.findById(req.params.idList);
            console.log(find)
            if(find ===null){
                res.status(404).json("wrong id to do list");
                return 
            }
            next();
        } catch (error) {
            res.status(500).json("wrong type object to do list")
        }
    },
    addWorks: async(req,res)=>{
        try {
            const newDate = await Works.insertMany({"date":req.body.date,"works":req.body.works});
            console.log(newDate[0]._id)
            await ToDoList.updateOne({_id:req.params.idList},{$push:{dates:newDate[0]._id}})
            res.status(200).json(newDate)
        } catch (error) {
            res.status(500).json(error)
        }
    },
    getAllWorksOnDate:async(req,res)=>{
        try {
            const toDoList = await ToDoList.findById(req.params.idList).populate("dates");            
            res.status(200).json(toDoList.dates);
            
        } catch (error) {
            res.status(500).json("error")
        }
    },
    getAllWork:async(req,res)=>{
        try {
           const list = await ToDoList.find().populate("dates")
           let newDates = list.map((aList)=>{
            return aList.dates
           })
           res.status(200).json(newDates) 
        } catch (error) {
            res.status(500).json("error")
        }
    }
}

module.exports = workController