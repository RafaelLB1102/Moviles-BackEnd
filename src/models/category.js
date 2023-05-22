const { default: mongoose } = require("mongoose")
const moongose = require("mongoose")
const mongoosePaginated = require("mongoose-paginate")

const cateogrySchema = new mongoose.Schema({
    name :{
        type: String,
        required : true
    },
    description : String,
    photo :String,
    created_at : {type : Date,default : Date.now}
})

cateogrySchema.plugin(mongoosePaginated)
module.exports = moongose.model("Category",cateogrySchema)
