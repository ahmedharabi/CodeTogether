import {Response, Request, NextFunction} from "express";
import {prisma} from "../lib/prisma";

const userIsWorkspaceOwner=async (req:Request,res:Response,next:NextFunction)=>{
    const workspaceId=req.body.workspaceId || req.params.workspaceId;
    // @ts-ignore
    const userId=req.user?.id;
    if(workspaceId && userId){
        const workspace=await prisma.workspace.findUnique({
            where:{id:workspaceId}
        });
        if(workspace && workspace.owner_id==userId){
            next();
        }
    }
}

