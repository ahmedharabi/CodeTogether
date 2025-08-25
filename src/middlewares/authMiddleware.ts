import {Response,Request,NextFunction} from "express";


const isAuthenticated=(req:Request,res:Response,next:NextFunction)=>{
    if(req.isAuthenticated()){
        next();
    }
    else{
        throw new Error("user not authenticated")
    }

}

export {isAuthenticated}