import {Response,Request,NextFunction} from "express";
import {prisma} from "../lib/prisma";

const workspaceExists=async (req:Request,res:Response,next:NextFunction)=>{
    const workspaceId=req.params.workspaceId;
    console.log(workspaceId);
    if(workspaceId){
        const workspace=await prisma.workspace.findUnique({
            where:{id:workspaceId}
        });
        if(workspace){
            next();
        }else{
            throw new Error("Workspace doesn't exist");
        }
    }
    else{
        throw new Error("invalid workspaceId")
    }
}

export {workspaceExists}