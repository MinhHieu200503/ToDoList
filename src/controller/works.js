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
                let warning = "Còn sớm mà làm ván đi từ từ làm sau"
                if(milisecond<0){
                    warning = "trễ cmnr khỏi làm nữa"
                }
                return {second,minute,hour,day,warning}
            }
            for(let i = 0;i<toDoList.dates.length;i++){
               for(let j = 0;j<toDoList.dates[i].works.length;j++){
                    let nowTime  = new Date()
                    let aDealine = toDoList.dates[i].works[j].time - nowTime;
                    let dealine = getDealine(aDealine);
                    try {
                        
                        const result = await Works.updateOne({"works._id":toDoList.dates[i].works[j]._id},
                        {$set:{[`works.${j}.dealine`]:`${dealine.day}:${dealine.hour}:${dealine.minute}:${dealine.second}:status=>${dealine.warning}`
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
            const listToDoList = await ToDoList.find().populate("dates");  
            function getDealine(milisecond){
                let second = Math.floor(milisecond/1000)%60;
                let minute = Math.floor(milisecond/1000/60)%60;
                let hour = Math.floor(milisecond/1000/60/60)%24;
                let day = Math.floor(milisecond/1000/60/60/24);
                let warning = "Còn sớm mà làm ván đi từ từ làm sau"
                if(milisecond<0){
                    warning = "trễ cmnr khỏi làm nữa"
                }
                return {second,minute,hour,day,warning,milisecond}
        }
        for(let k = 0;k<listToDoList.length;k++){
            let toDoList = listToDoList[k];
            for(let i = 0;i<toDoList.dates.length;i++){
                for(let j = 0;j<toDoList.dates[i].works.length;j++){
                     let nowTime  = new Date()
                     let aDealine = toDoList.dates[i].works[j].time - nowTime;
                     let dealine = getDealine(aDealine);
                     try {
                         
                         const result = await Works.updateOne({"works._id":toDoList.dates[i].works[j]._id},
                         {$set:{[`works.${j}.dealine`]:`${dealine.day}:${dealine.hour}:${dealine.minute}:${dealine.second}:status=>${dealine.warning}:${dealine.milisecond}`
                     }})
                         
                     } catch (error) {
                         console.log("error:"+error)
                     }
                }
             }
        }    
        const list = await ToDoList.find().populate("dates")
        let newDates = list.map((aList)=>{
         return aList.dates
        })
           res.status(200).json(newDates) 
        } catch (error) {
            res.status(500).json("error: "+error)
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
    // 1 => sort createdAt increased
            //*.1 => sort work createAt increased
            //*.-1 => sort work createAt descreased
    // -1 => sort createdAt descreased
    sortTime:async(req,res)=>{
        try {
            let toDoList  = await ToDoList.find().populate("dates");
            // console.log(typeof(req.query.list))
            const query = req.query.list.split(".")
            async function sortWorks(query){
                // sort by indexWork
                let newToDoList  
                const querytmp = req.query.list.split(".")
                if(querytmp[0]==1){newToDoList= await ToDoList.find().sort({index:1}).populate("dates");}
                if(querytmp[0]==-1){newToDoList= await ToDoList.find().sort({index:-1}).populate("dates");}

                if(query==-1){
                    let tmpToDos1=[];
                    for(let t of newToDoList){ // loop all toList
                        let tmpDates1 = [];
                        for(let a of t.dates){ //loop all aDate on todolist
                            let id = a._id;
                            // console.log(a.works[0].index[0])
                            let tmpDate = await Works.findOne({"_id":id})
                            for( let i = 0;i<tmpDate.works.length-1;i++){ //=> loop all works on a Date to compare index
                                for(let j = i+1;j<tmpDate.works.length;j++){  //=> bubble sort
                                    if(tmpDate.works[i].index<tmpDate.works[j].index){ 
                                        let tmp = tmpDate.works[i];
                                        tmpDate.works[i] = tmpDate.works[j];
                                        tmpDate.works[j] = tmp
                                    }
                                }
                            }
                            a = tmpDate
                            
                            // console.log(JSON.stringify(a))
                            tmpDates1.push(a)
                        }
                        tmpToDos1.push(tmpDates1)
                    }
                    newToDoList = tmpToDos1
                }else if(query==1){
                    let tmpToDos1=[];
                    for(let t of newToDoList){ // loop all toList
                        let tmpDates1 = [];
                        for(let a of t.dates){ //loop all aDate on todolist
                            let id = a._id;
                            // console.log(a.works[0].index[0])
                            let tmpDate = await Works.findOne({"_id":id})
                            for( let i = 0;i<tmpDate.works.length-1;i++){ //=> loop all works on a Date to compare index
                                for(let j = i+1;j<tmpDate.works.length;j++){  //=> bubble sort
                                    if(tmpDate.works[i].index>tmpDate.works[j].index){ 
                                        let tmp = tmpDate.works[i];
                                        tmpDate.works[i] = tmpDate.works[j];
                                        tmpDate.works[j] = tmp
                                    }
                                }
                            }
                            a = tmpDate
                            
                            // console.log(JSON.stringify(a))
                            tmpDates1.push(a)
                        }
                        tmpToDos1.push(tmpDates1)
                    }
                    newToDoList = tmpToDos1
                }
                
                return newToDoList
            }
            //^end function sortWorks

            // function update index base time deadline
            async function updateBaseDealine(toDoList){
                for(let t of toDoList){ // On
                    for(let d of t.dates){ // On
                        let arrTmp = []
                        let length = d.works.length
                        for(let i = 0;i<length;i++){
                            console.log(`i = ${i}`)
                            let k = 0;
                            let index = 0
                            let maxObj = d.works[k]
                            for(let h = 0;h<d.works.length;h++){
                                let sp1 = maxObj.dealine.split(":");
                                let sp2 = d.works[h].dealine.split(":");
                                if(sp1[5]<sp2[5]){
                                    maxObj = d.works[h]
                                    index = h
                                }
                                console.log(`h = ${h}`)
                            }
                            console.log(JSON.stringify(maxObj))
                            d.works.splice(index,1)
                            maxObj.index = i
                            arrTmp.push(maxObj)
                        } 
                        d.works = arrTmp
                    }
                }
               
            }
            // ^ end function updateBaseDealine
            if(query[0] == 1){
                async function index(arr){
                    for(let i = 0;i<arr.length;i++){
                        arr[i].index = i;
                        // console.log(`i = ${i}`)
                        await arr[i].save()
                    }  
                }
                index(toDoList)  
                async function indexWork(date){
                    for(let i = 0;i<date.works.length;i++){
                        date.works[i].index = i;
                        // console.log(`i = ${i}`)
                    }  
                   
                    await date.save()
                }
                for(let t of toDoList){
                    for(let a of t.dates){
                        indexWork(a)
                    }
                }
                // sort index base deadline increaed milisecond
                updateBaseDealine(toDoList)
                // sort works
                let newToDoList  = await sortWorks(query[1])
                res.status(200).json(newToDoList)
            }
            else if(query[0]==-1){
                async function index(arr){
                    for(let i = 0;i<arr.length;i++){
                        arr[i].index = i;
                        await arr[i].save()
                    }  
                }
                index(toDoList) 
                async function indexWork(date){
                    for(let i = 0;i<date.works.length;i++){
                        date.works[i].index = i;
                    }  
                    await date.save()
                }
                // update indexWork
                for(let t of toDoList){
                    for(let a of t.dates){
                        indexWork(a)
                    }
                }
                // sort index base deadline increaed milisecond
                updateBaseDealine(toDoList)
                // sort works
                let newToDoList2  = await sortWorks(query[1])

                res.status(200).json(newToDoList2)
            }
            else{
                res.status(404).json("not found")
            }
        } catch (error) {
            res.status(500).json("error: "+error)
        }
    }
}

module.exports = workController