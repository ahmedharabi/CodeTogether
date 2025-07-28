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
        else {
            throw new Error("user must be the owner of this workspace")
        }
    }
    else {
        throw new Error("workspaceId and userId must be valid")
    }
}
const userIsWorkspaceMember=async (req:Request,res:Response,next:NextFunction)=>{
    // @ts-ignore
    const userId:string=req.user.id;
    const workspaceId=req.params.workspaceId;
    const workspaceMember=await prisma.workspaceMember.findUnique({
        where:{userId_workspaceId:{
            userId,workspaceId
            }}
    })
    if(workspaceMember){
        next();
    }
    else{
        throw new Error("User is not memeber of this workspace");
    }
}



export {userIsWorkspaceOwner,userIsWorkspaceMember}

