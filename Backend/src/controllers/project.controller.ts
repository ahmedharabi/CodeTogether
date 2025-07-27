import {Response, Request, request} from "express";
import {prisma} from "../lib/prisma";


const creatProject=async (req:Request,res:Response)=>{
    if(!req.isAuthenticated()){
        return res.status(400).json({
            "success":false,
            "message":"user not authenticated"
        })
    }
    const workspaceId=req.params.workspaceId;
    // @ts-ignore
    const userId=req.user.id;
    if(!workspaceId || userId){
        return res.status(400).json({
            "success":false,
            "message":"workspaceid and userId must be valid"
        })
    }
    const workspace=await prisma.workspace.findUnique({
        where :{id:workspaceId}
    })
    if(!workspace){
        return res.status(404).json({
            "success":false,
            "message":"Invalid workspaceId"
        })
    }
    const isOwner=(workspace!.owner_id==userId)
    if(!isOwner){
        return res.status(403).json({
            "success":false,
            "message":"Only workspace owner can create projects"
        })
    }
    const project=await prisma.project.create({
        data:{
            
        }
    })







}
const getProjectById
const updateProject
const deleteProject