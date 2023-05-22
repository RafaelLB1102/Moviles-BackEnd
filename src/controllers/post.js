const Post = require("../models/post")
const Category = require("../models/category")
const mongoose = require("mongoose")

const createPost = async (req,res) => {
    try{
        const {title,miniature,content,category,path} = req.body
        if(!category){
            return res.status(400).send({msg : "La categoría es obligatoria"})
        }
        const existingCategory = await Category.findOne({_id : category})
        if(!category){
            return res.status(400).send({msg : "La categoría no existe"})
        }
        const post = new Post({
            title,
            miniature,
            content,
            category,
            path
        })
        const postStored = await post.save()
        if(!postStored){
            return res.status(400).send({msg : "No se ha podido guardar el post"})
        }
        res.status(200).send({post : postStored})
    }catch(error){
        return res.status(500).send({
            msg : "Error en el servidor"
        })
    }
}

const getPosts = async (req,res) => {
    try{
        const {page = 1, limit = 10} = req.query
        const pageNumber = parseInt(page)
        const limitNumber = parseInt(limit)
        if(isNaN(pageNumber) || isNaN(limitNumber)){
            return res.status(400).send({
                msg : "Los parametros de paginación deben ser números válidos"
            })
        }
        const options = {
            page:pageNumber,
            limit:limitNumber,
            sort:{date:"desc"}
        }
        const posts = await Post.paginate({},options)
        if(!posts || posts.totalPages === 0){
            return res.status(400).send({
                msg : "No se ha encontrado ninguna categoría"
            })
        }
        req.status(200).send({posts})
    }catch(error){
        return res.status(500).send({
            msg : "Error en el servidor"
        })
    }
}

const getPost = async (req,res) => {
    try{
        const {id} = req.params
        if(!id){
            return res.status(400).send({
                msg : "El id es obligatorio"
            })
        }

        const post = await Post.findById(id)
        if(!post){
            return res.status(404).send({
                msg : "No se ha encontrado ningún post"
            })
        }
        res.status(200).send({
            post
        })
    }catch(error){
        return res.status(500).send({
            msg : "Error en el servidor"
        })
    }
}

const getPostByCategory = async (req,res) => {
    try{
        const {category} = req.params
        if(!mongoose.Types.ObjectId.isValid(category)){
            return res.status(400).send({
                msg : "El ID de la categoría no es válido"
            })
        }

        const posts = await Post.find({category})

        if(!posts || posts.length === 0){
            return res.status(404).send({
                msg : "No se encontraron posts para esta categoría"
            })
        }

        res.status(200).send({
            posts
        })
    }catch(error){
        return res.status(500).send({
            msg : "Error en el servidor"
        })
    }
}

const getPostBySearch = async (req,res) => {
    try{
        const { search } = req.params
        if(!search){
            return res.status(400).send({
                msg : "El término de búsqueda es obligatorio"
            })
        }

        const posts = await Post.find({
            $or : [
                {title : {$regex:search,$options : "i"}},
                {content : {$regex : search,$options : "i"}}
            ]
        })

        if(posts.length === 0){
            return res.status(404).send({
                msg : "No se han encontrado posts para el término de búsqueda especificado"
            })
        }

        res.status(200).send({posts})

    }catch(error){
        return res.status(500).send({
            msg : "Error en el servidor"
        })
    }
}

const updatePost = async (req, res) => {
    try{
        const {id} = req.params
        if(!id){
            return res.status(400).send({
                msg : "El id del post es obligatorio"
            })
        }

        const updates = req.body
        const post = await Post.findByIdAndUpdate(id,updates,{new:true})
        if(!post){
            return res.status(404).send({
                msg : "No se encontró ningún post"
            })
        }

        res.status(200).send(post)

    }catch(error){
        return res.status(500).send({
            msg : "Error en el servidor"
        })
    }
}

const deletePost = async (req,res) => {
    try{
        const {id} = req.params
        if(!id){
            return res.status(400).send({
                msg : "El id del post es obligatorio"
            })
        }

        const deletedPost = await Post.findByIdAndDelete(id)

        if(!deletedPost){
            return res.status(404).send({
                msg : "No se encontró ningún post"
            })
        }
        res.status(200).send(deletedPost)

    }catch(error){
        return res.status(500).send({
            msg : "Error en el servidor"
        })
    }
}

module.exports = {
    createPost,
    getPosts,
    getPost,
    getPostByCategory,
    getPostBySearch,
    updatePost,
    deletePost
}
