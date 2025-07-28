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
// const getProjectById
// const updateProject
// const deleteProject


export {createProject}