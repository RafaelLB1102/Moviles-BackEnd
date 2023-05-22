const express = require("express")
const multiparty = require("connect-multiparty")
const CategoryController = require("../controllers/category")
const middleware_authentication = require("../middlewares/authenticaded")

const md_upload = multiparty({ uploadDir : "./uploads/categories"})
const api = express.Router()

api.post("/new",[middleware_authentication.asureAuth,md_upload],CategoryController.createCategory)
api.get("/",CategoryController.getCategories)

module.exports = api
