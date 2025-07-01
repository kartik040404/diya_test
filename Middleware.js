import jwt from 'jsonwebtoken';

export const auth = async (req, res, next) => {
    try{
        const token = req?.cookies?.token || req?.body?.token || req?.header("Authorization")?.replace("Bearer ", "");
        
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token Missing!!"
            })
        }
        // Verify the Token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decode;
        }
        catch(error){
            console.log(error);
            return res.status(401).json({
                success: false,
                message: "Invalid Token!!"
            })
        }
        next();
    }
    catch(error){
        console.log(error);
        return res.status(401).json({
            success: false,
            message: "Something went wrong while verifing the Token"
        })
    }
}


export const isInstitute = async (req, res, next) => {
    try{
        const user = req.user;
        if(user.type=="Institute"){
            next();
        }
        else{
            return res.status(401).json({
                success: false,
                message: "Restricted only for Institutes"
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(401).json({
            success: false,
            message: "Something went wrong while verifing the Token"
        })
    }
}

export const isStudent = async (req, res, next) => {
    try{
        const user = req.user;
        if(user.type=="Student"){
            next();
        }
        else{
            return res.status(401).json({
                success: false,
                message: "Restricted only for Student"
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(401).json({
            success: false,
            message: "Something went wrong while verifing the Token"
        })
    }
}