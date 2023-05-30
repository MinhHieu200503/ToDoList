const mongoose = require("mongoose");
const {Works,ToDoList} = require("../model/model.js");

const workController = {
    checkIdList:async(req,res,next)=>{
        try {
            
            const find = await ToDoList.findById(req.params.idList);
            
            if(find ===null){
                res.status(404).json("wrong id to do list");
                return 
            }
            next();
        } catch (error) {
            res.status(500).json("wrong type object to do list")
        }
    },
    configTime:async(req,res,next)=>{ //=> config hh:mm
        try {
            let configTime = req.body.works.map(async(work)=>{
                let time = work.time.split(":");
                //check time format hh:mm with h >=0 and <=23&&mm>=0 and <=59
                if(!(Number(time[0])>=0&&time[0]<=23&&time[1]>=0&&time[1]<=59)){
                    res.status(500).json("wrong time format hh:mm");
                    return
                }
                
                let newTime = new Date(req.body.date);
                newTime.setHours(time[0]);
                newTime.setMinutes(time[1])
                return newTime
            })
            for(let i = 0;i<configTime.length;i++){
                req.body.works[i].time = configTime[i]
                
            }
            next()
        } catch (error) {
            res.status(500).json("error config time")
            return 
        }
    },
    addWorks: async(req,res)=>{
        try {
            const newDate = await Works.insertMany({"date":req.body.date,"works":req.body.works});
           
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