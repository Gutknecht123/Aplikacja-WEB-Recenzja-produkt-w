const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {

    try{
    const decoded = jwt.decode(req.body.token, process.env.JWT);
    req.userData = decoded;
    next();
    }catch(e){
        return res.status(401).json({
            message: 'Unauthenticated'
        })
    }
   
};