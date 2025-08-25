import {Response, Request, request} from "express";
import {prisma} from "../lib/prisma";
import {toSlug} from "../lib/slugify";


const createProject=async (req:Request,res:Response):Promise<any>=>{

    try{
        const workspaceId = req.params.workspaceId;
        // @ts-ignore
        const userId = req.user.id;

        const workspace = await prisma.workspace.findUnique({
            where: {id: workspaceId}
        })

        const name = req.body.name;

        const project = await prisma.project.create({
            data: {
                name, workspaceId, slug: toSlug(name)
            }
        })
        return res.status(200).json({
            "success":true,
            "message":"project created successfully",
            "data":project
        })
    }catch (error:any){
        console.log(error.message)
        return res.status(500).json({
            "success":false,
            "message":"Something went wrong"
        })
    }








}
const getProjectById=async (req:Request,res:Response):Promise<any>=>{
    try{
        const projectId = req.params.projectId;
        const project = await prisma.project.findUnique({
            where: {id: projectId},
            include:{dev_env:true}
        })
        return res.status(200).json({
            "success":true,
            "message":"Project found successfully",
            "data":project
        })
    }catch (error:any){
        console.log(error.message);
        return res.status(500).json({
            "success":false,
            "message":"Something went wrong",
        })
    }

}
const updateProject=async (req:Request,res:Response):Promise<any>=>{
    try{
        const projectId=req.params.projectId;
        const {name, repo_url} = req.body;
        const updateProject=await prisma.project.update({
            where:{id:projectId},
            data:{
                name,
                repo_url
            }
        })
        return res.status(200).json({
            "success":true,
            "message":"project updated successfully",
            data:{
                updateProject
            }
        })

    }catch (error:any){
        console.error(error.message);
        return res.status(500).json({
            "success":false,
            "message":"Something went wrong"
        })
    }

}
const deleteProject=async (req:Request,res:Response):Promise<any>=>{
    const projectId=req.params.projectId;
    const deletedProject=await prisma.project.update({
        where:{id:projectId},
        data:{
            deleted:true,
            deleted_at:new Date()
        }
    })
}


export {createProject,getProjectById,updateProject,deleteProject}