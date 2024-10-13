const mongoose = require('mongoose');
const { Schema } = mongoose;

const ResourceSchema=mongoose.Schema({
    name:{
        type:String,
        required: true
    },units:{
        type:Number,
        required: true
    },
    curr:{
        type:Number,
        required: true
    }
})

const Resource=mongoose.model("Resource",ResourceSchema)
module.exports=Resource