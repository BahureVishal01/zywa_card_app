const { mongoose } = require("mongoose");

const cardSchema = new mongoose.Schema({
    card_id:{
        type: String,
        required: true,
    }, 
    user_phone:{
        type: String,
        required: true,
        maxLength: 9,
    }, 
    status:{
        type:String,
    }, 
    comment: String, 
    date_time: {
        type : String,
    },
    createdAt : {
        type : Date,
        immutable : true,
        default : ()=>{
            return Date.now();
        }
    },
    updatedAt : {
        type : Date,
        default : ()=>{
            return Date.now();
        }
    },

})

module.exports = mongoose.model("Card", cardSchema);