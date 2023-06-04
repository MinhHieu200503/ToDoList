const mongoose = require("mongoose");
const {Works,ToDoList} = require("../model/model.js");



const workController = {
    // middleware check idList
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
    // middleware config time in work: input:hh:mm => output:yyyy/mm/ddThh:mm:ssZ
    configTime:async(req,res,next)=>{ //=> config hh:mm
        try {
            let configTime = req.body.works.map((work)=>{
                let time = work.time.split(":");
                //check time format hh:mm with h >=0 and <=23&&mm>=0 and <=59
                function checkTime(time){
                    if(!(Number(time[0])>=0&&time[0]<=23&&time[1]>=0&&time[1]<=59)){
                        return false
                    }
                }
                if(checkTime(time)===false){
                    
                    return false
                }
                let newTime = new Date(req.body.date);
                newTime.setHours(time[0]);
                newTime.setMinutes(time[1])
                return newTime
            })
            
            if(configTime.includes(false)){
                res.status(500).json("wrong time format hh:mm");
                return 
            }
            for(let i = 0;i<configTime.length;i++){
                req.body.works[i].time = configTime[i]
            }
            
            next()
        } catch (error) {
            res.status(500).json("error config time")
            return 
        }
    },
    // [POST] ADate(date,works[time,work])
    addWorks: async(req,res)=>{
        try {
            const newDate = await Works.insertMany({"date":req.body.date,"works":req.body.works});
            await ToDoList.updateOne({_id:req.params.idList},{$push:{dates:newDate[0]._id}})
            res.status(200).json(newDate)
        } catch (error) {
            res.status(500).json(error + "\nadd works wrong")
        }
    },
    //[GET] (params:idList)
    getAllWorksOnDate:async(req,res)=>{
        try {
            const toDoList = await ToDoList.findById(req.params.idList).populate("dates");  
            function getDealine(milisecond){
                let second = Math.floor(milisecond/1000)%60;
                let minute = Math.floor(milisecond/1000/60)%60;
                let hour = Math.floor(milisecond/1000/60/60)%24;
                let day = Math.floor(milisecond/1000/60/60/24);
                return {second,minute,hour,day}
            }
            for(let i = 0;i<toDoList.dates.length;i++){
               for(let j = 0;j<toDoList.dates[i].works.length;j++){
                    let nowTime  = new Date()
                    let aDealine = toDoList.dates[i].works[j].time - nowTime;
                    let dealine = getDealine(aDealine);
                    try {
                        
                        const result = await Works.updateOne({"works._id":toDoList.dates[i].works[j]._id},
                        {$set:{[`works.${j}.dealine`]:`${dealine.day}:${dealine.hour}:${dealine.minute}:${dealine.second}`
                    }})
                        
                    } catch (error) {
                        console.log("error:"+error)
                    }
               }
            }     
            const newToDoList = await ToDoList.findById(req.params.idList).populate("dates"); 
            res.status(200).json(newToDoList);
            
        } catch (error) {
            res.status(500).json(`error: ${error}`)
        }
    },
    // [GET]
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
    },
    // [DELETE] a date(idList,idDate)
    deleteADate:async(req,res)=>{
        try {
            
            const result = await Works.findByIdAndDelete(req.params.idDate); 
            await ToDoList.updateOne({_id:req.params.idList},{$pull:{dates:req.params.idDate}})
            res.status(200).json(result)
        } catch (error) {
            res.status(500).json(error+ " \nerror delete a date")
        }
    },
    // [DELETE] a work(params:idDate,params:idWork)
    deleteAWork:async(req,res)=>{
        try {
            const result = await Works.updateOne({_id:req.params.idDate},{$pull:{works:{_id:req.params.idWork}}})
            res.status(200).json(result)
        } catch (error) {
            res.status(500).json(error+ " \nerror delete a work")
        }
    },
    deleteAList:async(req,res)=>{
        try {
            const toDoList = await ToDoList.findById(req.params.idList);
            toDoList.dates.map(async(toDo)=>{
                await Works.findByIdAndDelete(toDo)
            })

            const result = await ToDoList.findByIdAndDelete(req.params.idList);
            res.status(200).json(result)
        } catch (error) {
            res.status(500).json(error+ " \nerror delete a to do list")
        }
    },
    // [PUT] update name of list (params(idList),json.name)
    updateName:async(req,res)=>{
        try {
            const result = await ToDoList.updateOne({_id:req.params.idList},{$set:{name:req.body.name}})
            res.status(200).json(result);
        } catch (error) {
            res.status(500).json(error+ " \nerror updateName");
        }
    },
    // [PUT] update a date of list (params(idList),json.date)
    updateDate:async(req,res)=>{
        try {
            const result = await Works.updateOne({_id:req.params.idDate},{$set:req.body})
            res.status(200).json(`req.body: ${req.body}
            result:${result}`)
        } catch (error) {
            res.status(500).json(error+ " \nerror updateDate");
        }
    },
    testQuery:(req,res)=>{
        console.log(req.query);
        const arr = req.query.age.split(",")
        console.log(arr);
        res.status(200).json(req.query)
    },

    
}

module.exports = workController