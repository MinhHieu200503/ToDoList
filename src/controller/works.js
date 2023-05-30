const mongoose = require("mongoose");
const {Works,ToDoList} = require("../model/model.js");

const workController = {
    addWorks: async(req,res)=>{
        try {
            const newDate = await Works.insertMany({"date":req.body.date,works:req.body.works});
            res.status(200).json(newDate)
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

module.exports = workController