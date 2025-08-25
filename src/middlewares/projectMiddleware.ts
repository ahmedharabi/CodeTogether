import {Response, Request, NextFunction} from "express";
import {prisma} from "../lib/prisma";

const projectExists=async (req:Request,res:Response,next:NextFunction)=>{
    const projectId=req.body.projectId || req.params.projectId;
    if(projectId){
        const project=await prisma.project.findUnique({
            where:{id:projectId}
        });
        if(project){
            next();
        }else {
            throw new Error("Project does not exist")
        }

    }else {
        throw new Error("invalid projectId")
    }
}
const projectExistsInWorkspace=async (req:Request,res:Response,next:NextFunction)=>{
    const projectId=req.body.projectId || req.params.projectId;
    const workspaceId=req.body.workspaceId || req.params.workspaceId;
    if(projectId && workspaceId){
        const project=await prisma.project.findUnique({
            where:{id:projectId}
        });
        if(project!.workspaceId==workspaceId){
            next();
        }else {
            throw new Error("Project doesn't exist in this workspace")
        }
    }else {
        throw new Error("Invalid projectId or WorkspaceId")
    }
}
const projectHasNoDevEnv=async (req:Request,res:Response,next:NextFunction)=>{
    const projectId=req.params.projectId;
    const project=await prisma.project.findUnique({
        where:{id:projectId},
        include:{dev_env:true}
    })
    if(!(project!.dev_env)){
        next();
    }else {
        throw new Error("Project has a dev Environment")
    }
}
const projectHasDevEnv=async (req:Request,res:Response,next:NextFunction)=>{
    const projectId=req.params.projectId;
    const project=await prisma.project.findUnique({
        where:{id:projectId},
        include:{dev_env:true}
    })
    if(project!.dev_env){
        next();
    }
}

export {projectHasNoDevEnv,projectHasDevEnv,projectExists,projectExistsInWorkspace,}