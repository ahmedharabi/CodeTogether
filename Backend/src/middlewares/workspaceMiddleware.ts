import {Response,Request,NextFunction} from "express";
import {prisma} from "../lib/prisma";

const workspaceExists=async (req:Request,res:Response,next:NextFunction)=>{
    const workspaceId=req.body.workspaceId || req.params.workspaceId;
    if(workspaceId){
        const workspace=await prisma.workspace.findUnique({
            where:{id:workspaceId}
        });
        if(workspace){
            next();
        }
    }
}