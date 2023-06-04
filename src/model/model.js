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
},{
    timestamps:{
        createdAt:true, //=> time create
        updatedAt:true
    }
})

const worksSchema = new mongoose.Schema({
    "date":{
        "type":Date,
        default:Date.now
    },
    "works":[
        {
            "time":Date, //=> time target
            "work":String,
            "dealine":{
                type:String,
                default:""
            } 
        }
    ]
},{
    timestamps:{
        createdAt:true,
        updatedAt:true
    }
})

const Works = mongoose.model("works",worksSchema);
const ToDoList = mongoose.model("toDoList",toDoListSchema)

module.exports = {Works,ToDoList}