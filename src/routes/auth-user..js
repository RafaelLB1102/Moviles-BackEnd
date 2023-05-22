const express = require("express")
const multiparty = require("connect-multiparty")
const UserController = require("../controllers/user")
const middleware_authentication = require("../middlewares/authenticaded")

const fs = require("fs")

const uploadDir = "./uploads/avatar"

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const md_upload = multiparty({ uploadDir: "./uploads/avatar" })
const api = express.Router()

api.get("/me",[middleware_authentication.asureAuth],UserController.getMe)
api.get("/",[middleware_authentication.asureAuth],UserController.getUsers)
api.get("/:id",[middleware_authentication.asureAuth],UserController.getUser)
api.post("/user",[middleware_authentication.asureAuth],UserController.createUser)
api.patch("/:id",[middleware_authentication.asureAuth],UserController.updateUser)
api.delete("/:id",[middleware_authentication.asureAuth],UserController.deleteUser)

module.exports = api
