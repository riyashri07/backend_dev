const jwt = require("jsonwebtoken")
require("dotenv").config();


const authenticate = (req, res, next) => {
    
    const token = req.headers.authorization
    if (token) {
        const decoded = jwt.verify(token, process.env.key)
        if (decoded) {
            const userID = decoded.userID
            console.log(decoded)
            req.body.userID = userID
            next()
        } else {
            res.status(400).send("Please Login First")
        }
    } else {
         res.status(400).send("Please Login First");
        }
}
module.exports = {
    authenticate
}