const bcrypt = require("bcryptjs");
const User = require("../models/users");
const jwt = require("../utils/jwt");

const register = async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    if (!email) { 
        return res.status(400).send({ msg: "El email es requerido" });
    }

    if(!password) { 
        return res.status(400).send({ msg: "La constraseña es requerida" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    const user = new User({
        firstname,
        lastname,
        email: email.toLowerCase(),
        role: "user",
        active : false,
        password: hashPassword
    });

    try {
        const userStorage = await user.save();
        res.status(201).send(userStorage);
    }catch (error) {
        res.status(400).send({ msg: "Error al crear el usuario" })

    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password){
            throw new Error("El email y la constraseña son obligatorios")
        }

        const emailToLowerCase = email.toLowerCase();
        const userStorage = await User.findOne({ email: emailToLowerCase }).exec();
        if(!userStorage){
            throw new Error("El usuario no existe")
        }

        const check = await bcrypt.compare(password, userStorage.password)
        if(!check){
            throw new Error("Contraseña incorrecta")
        }

        if(!userStorage.active){
            throw new Error("Usuario no autorizado o no activo")
        }

        res.status(200).send({
            access: jwt.createAccesToken(userStorage),
            refresh: jwt.createRefreshToken(userStorage)
        })
    } catch (error) {
        res.status(400).send({ msg: error.message })
    }
}

function refreshAccessToken(req, res) {
    const { token } = req.body;

    if(!token){
        res.status(400).send({ msg: "Token requerido" })
    }

    const { user_id } = jwt.decoded(token)
    User.findOne({ _id: user_id }, (error, userStorage) => {
        if(error){
            res.status(500).send({ msg: "Error del servidor" })
        }else{
            res.status(200).send({ accesToken: jwt.createAccessToken(userStorage)})
        }
    })
}

module.exports = {
    register,
    login,
    refreshAccessToken
}
