const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProcessSchema=mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    burst:{
        type:Number,
    
        default:2
    },
    allocation:[
        {
            rid:{
                type:mongoose.Types.ObjectId,
                required:true
            },
            units:{
                type:Number,
                required:true

            },
            need:{
                type:Number,
                required:true

            }
        }
    ],
    max:[
        {
            rid:{
                type:mongoose.Types.ObjectId,
                required:true
            },
            unit:{
                type:Number,
                required:true

            }
        }
    ]
})

const Process=mongoose.model("Process",ProcessSchema)
module.exports=Process