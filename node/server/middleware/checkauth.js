const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    try{
        console.log("To token!");
        console.log(req.query["token"]);
    const token = req.query["token"];
    console.log("To token!");
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT);
    req.userData = decoded;
    next();
    }catch(e){
        return res.status(401).json({
            message: 'Unauthenticated'
        })
    }
   
};