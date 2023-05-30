const mongoose = require("mongoose");

const toDoListSchema = new mongoose.Schema({
    "name":{
        "type":String,
        "require":true,
    },
    "dates":[
        {
            "type": mongoose.Schema.Types.ObjectId,
            "ref":"works",
        }
    ]
})

const worksSchema = new mongoose.Schema({
    "date":{
        "type":Date,
        default:Date.now
    },
    "works":[
        {
            "time":{
                "type":Date,

            },
            "work":{
                "type":String   ,
                
            }
        }
    ]
})

const Works = mongoose.model("works",worksSchema);
const ToDoList = mongoose.model("toDoList",toDoListSchema)

module.exports = {Works,ToDoList}