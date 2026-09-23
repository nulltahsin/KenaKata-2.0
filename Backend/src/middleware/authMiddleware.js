const jwt = require("jsonwebtoken");
const { isTokenRevoked } = require("./tokenBlacklist");


const verifyToken = (req,res,next)=>{

    try{

        const authHeader = req.headers.authorization;

        if(!authHeader){

            return res.status(401).json({
                message:"Access denied. No token provided"
            });

        }


        const token = authHeader.split(" ")[1];


        if(!token){

            return res.status(401).json({
                message:"Invalid token format"
            });

        }

        if(isTokenRevoked(token)){
            return res.status(401).json({
                message:"Token has been revoked"
            });
        }



        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        req.user = decoded;


        next();

    }

    catch(error){

        return res.status(401).json({
            message:"Invalid or expired token"
        });

    }
};



module.exports = verifyToken;
