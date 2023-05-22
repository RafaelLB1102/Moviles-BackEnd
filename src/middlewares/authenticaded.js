const jwt = require("../utils/jwt")

const asureAuth = (req, res, next) => {
    const {authorization} = req.headers

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res
                .status(403)
                .send({ msg: "La petición no tiene la cabecera de autenticación" })
    }
    
    const token = authorization.split(" ")[1]

    try {
        const payload = jwt.decoded(token)
        const { expiration_date } = payload
        /* Verificar nombre currentDate o currentData */
        const currentTime = new Date().getTime()
        
        if(expiration_date <= currentTime){
            return res.status(400).send({ msg: "El token ha expirado" })
        }
        req.user = payload
        next()
    } catch (error) {
        return res.status(401).send({ msg: "Token no válido" })
    }
}

module.exports = { asureAuth }
