import {Response,Request} from "express";
import {prisma} from "../lib/prisma";
import fs from 'fs';
import path from 'path';
import {createTheiaIDEContainer} from "../services/dockerService";


// create a dev env
// start a dev env
// delete dev env
 // /api/workspaces/:workspaceId/projects/:projectId/devenv/
// workspace and project exist -> project inside that workspace -> the project dosen't have a devenv -> the user is the owner fo the workspace

const createDevEnv=async (req:Request,res:Response):Promise<any>=>{
    try{
        const projectId = req.params.projectId;


        const devEnv = await prisma.devEnvironment.create({
            data: {
                projectId: projectId
            }
        })
        const BASE_VOLUMES_DIR = path.resolve("volumes");
        const volumesPath = path.join(BASE_VOLUMES_DIR, "dev-env", devEnv.id);

        await fs.promises.mkdir(volumesPath, {recursive: true});

        const updatedDevEnv = await prisma.devEnvironment.update({
            where: {id: devEnv.id},
            data: {path: volumesPath}
        })

        return res.status(201).json({
            "success": true,
            "message": "dev environment created successfully",
            "data": {
                devEnv
            }
        })

    }catch (error:any){
        console.error("Error creating dev environment:", error);
        return res.status(500).json({
            "success":false,
            "message":"Failed to create dev environment: "+ error.message
        })
    }
}

const startDevEnv=async (req:Request,res:Response):Promise<any>=>{
    // user authenticated -> workspace exists -> project exists -> dev env exists -> user memeber of workspace
    // /api/workspaces/:id/projects/:id/devenv/start
    try{
        const projectId = req.params.projectId;
        const project = await prisma.project.findUnique({
            where: {id: projectId},
            include: {dev_env: true}
        })
        const devEnv = project!.dev_env;
        const IDEContainer = createTheiaIDEContainer(devEnv!.path!)
        return res.status(200).json({
            "sucess":true,
            "message":"dev Envirnoment started successfully",
            "data":{IDEContainer}
        })
    }catch (error:any){
        console.log("an Error has occured"+error.message)
        return res.status(500).json({
            "success":false,
            "message":"Something went wrong"
        })
    }


}



export {createDevEnv,startDevEnv}


