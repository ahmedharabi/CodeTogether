import {Response,Request} from "express";
import {prisma} from "../lib/prisma";
import {toSlug} from "../lib/slugify";
import { User } from '@prisma/client';


interface AuthenticatedRequest extends Request {
    user: {
    id: string;
    full_name: string | null;
    username: string | null;
    email: string;
    password_hash: string | null;
    google_id: string | null;
    github_id: string | null;
    avatar_url: string | null;
    bio: string | null;
    role: string | null;
    workspaceMembers: any;
    joined_at: Date;
    last_active: Date | null;
    deleted: boolean;
    deleted_at: Date | null;
    }
}

const getWorkspacesForUser=async (req:AuthenticatedRequest,res:Response):Promise<any>=>{
    if(!req.isAuthenticated()){
        return res.status(400).json({
            "success":false,
            "message":"User not authenticated"
        })
    }

    try{

        const userId = req.user.id;
        const user = await prisma.user.findUnique({
            where: {id: userId},
            include: {
                workspaceMembers: {
                    include: {
                        workspace: true,
                    }
                }
            }
        });
        if(!user){
            return res.status(404).json({
                "success":false,
                "message":"User not found"
            })
        }
        const worspaces = user!.workspaceMembers;
        return res.status(200).json({
            "success": true,
            "message": "Workspaces found successfully",
            "data": {
                ...worspaces
            }
        })
    }catch (err){
        return res.status(500).json({
            "sucess":false,
            "message":"Something went wrong",
            "data":{}
        })
    }
}
const createWorkSpace=async (req:AuthenticatedRequest,res:Response):Promise<any>=>{
    if(!req.isAuthenticated()){
        return res.status(400).json({
            "success":false,
            "message":"User not authenticated"
        })
    }
    try {
        const userId=req.user.id;
        const user=await prisma.user.findUnique({
            where:{id:userId}
        })
        const workspace=await prisma.workspace.create({
            data:{
                name:req.body.name,
                owner_id:user!.id,
                plan:user!.plan,
                slug:toSlug(req.body.name)
            }
        })
        return res.status(201).json({
            "success":true,
            "message":"Workspace created successfully",
            "data":workspace
        })

    }catch (error){
        return res.status(500).json({
            "success":false,
            "message":"Something went wrong"
        })
    }
}


const getWorkspaceById=async (req:Request,res:Response):Promise<any>=>{
    if(!req.isAuthenticated()){
        return res.status(400).json({
            "success":false,
            "message":"User not authenticated"
        })
    }

    try {
        const workspaceId=req.body.workspaceId;
        const workspace=await prisma.workspace.findUnique({
            where:{id:workspaceId},
            select:{
                name:true,
                owner_id:true,
                logo_url:true,
                workspaceMembers:true
            }
        })
        if(!workspace){
            return res.status(404).json({
                "success":false,
                "message":"workspace not found"
            })
        }

        return res.status(200).json({
            "success":true,
            "message":"Workspace found successfully",
            data:workspace
        })
    }catch (error){
        return res.status(500).json({
            "success":false,
            "message":"Something went wrong",
        })
    }
}
const updateWorkspace=async (req:AuthenticatedRequest,res:Response):Promise<any>=>{
    //[workspaceid,name,avatarlogo]
    // is the user authenticated ? -> does the workspace exists ? -> does the user own this workspace ? -> if yes updates it
    if(!req.isAuthenticated()){
        return res.status(401).json({
            "success":false,
            "message":"User not authenticated"
        })
    }
    try{
        const workspaceId=req.body.workspaceId;
        const userId=req.user.id;
        const user=await prisma.user.findUnique({
            where:{id:userId}
        })
        let workspace=await prisma.workspace.findUnique({
            where:{id:workspaceId}
        })
        if(!user){
            return res.status(404).json({
                "success":false,
                "message":"User not found"
            })
        }
        if(!workspace){
            return res.status(404).json({
                "success":false,
                "message":"Workspace not found"
            })
        }
        if(workspace.owner_id!=user.id){
            return res.status(403).json({
                "success":false,
                "message":"You do not have permission to perform this action"
            })
        }
        const updatedWorkspace={name:req.body.workspaceName,avatar_url:req.body.workspaceAvatarUrl};
        workspace=await prisma.workspace.update({
            where:{id:workspace.id},
            data:updatedWorkspace
        })
        return res.status(200).json({
            "success":true,
            "message":"workspace updated successfully",
            "data":workspace
        })
    }catch (error){
        return res.status(500).json({
            "success":false,
            "message":"Something went wrong"
        })
    }
}
const deleteWorkspace=async (req:AuthenticatedRequest,res:Response):Promise<any>=>{
    if(!req.isAuthenticated()){
        return res.status(401).json({
            "success":false,
            "message":"User not authenticated"
        })
    }
    try {
        const userId=req.user.id;
        const workspaceId=req.body.workspaceId;
        const user=await prisma.user.findUnique({
            where:{id:userId,deleted:false}

        })
        let workspace=await prisma.workspace.findUnique({
            where:{id:workspaceId,deleted:false}

        })

        if(!user){
            return res.status(404).json({
                "success":false,
                "message":"User not found"
            })
        }
        if(!workspace){
            return res.status(404).json({
                "success":false,
                "message":"Workspace not found"
            })
        }
        workspace=await prisma.workspace.update({
            where:{id:workspaceId},
            data:{
                deleted:true
            }
        })
        return res.status(200).json({
            "success":true,
            "message":"workspace deleted successfully",
        })

    }catch (error){
        return res.status(500).json({
            "success":false,
            "message":"Something went wrong"
        })
    }
}

export {createWorkSpace,getWorkspaceById,updateWorkspace,deleteWorkspace,getWorkspacesForUser};