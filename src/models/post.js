const mongoose = require("mongoose")
const mongoosePaginated = require("mongoose-paginate")
const PostSchema = mongoose.Schema({
    title : String,
    miniature : String,
    created_at : { type : Date, default : Date.now},
    category : { type: mongoose.Schema.Types.ObjectId, ref : "Category"},
    path : {type : String, unique: true}
})

PostSchema.plugin(mongoosePaginated)
module.exports = mongoose.model("Post",PostSchema)
