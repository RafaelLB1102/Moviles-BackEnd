const Category = require("../models/category")

const createCategory = async (req, res) => {
    try {
        const category = new Category({
            name: req.body.name,
            description: req.body.description
        })
        const categoryStored = await Category.save()
        if(!categoryStored){
            return res.status(404).send({
                msg : "No se ha poddido guardar la categoria"
            })
        }
        res.status(200).send({category : categoryStored})
    } catch (error) {
        return res.status(500).send({
            msg : "Error en el servidor"
        })
    }
}

const getCategories = async (req,res) => {
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
        const categories = await Category.paginate({},options)

        if(!categories || categories.totalPages === 0){
            return res.status(400).send({
                msg : "No se ha encontrado ninguna categoría"
            })
        }

        res.status(200).send({categories})
    }catch(error){
        return res.status(500).send({
            msg : "Error en el servidor"
        })
    }
}

module.exports = {createCategory,getCategories}
