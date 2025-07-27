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
        }
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
        }
    }
}
const projectHasNoDevenv=async (req:Request,res:Response)=>{

}