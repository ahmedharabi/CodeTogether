import express, {RequestHandler} from "express";
import {isAuthenticated} from "../middlewares/authMiddleware";
import {workspaceExists} from "../middlewares/workspaceMiddleware";
import {userIsWorkspaceMember, userIsWorkspaceOwner} from "../middlewares/userMiddleware";
import {createProject, getProjectById,updateProject,deleteProject} from "../controllers/project.controller"
import {router as devEnvRoutes} from "./devEnv.route";
import {projectExists, projectExistsInWorkspace} from "../middlewares/projectMiddleware";

const router=express.Router({ mergeParams: true });

router.use("/:projectId/devenv",devEnvRoutes);
router.post("/",isAuthenticated,workspaceExists,userIsWorkspaceOwner,createProject)
router.get("/:projectId",isAuthenticated,workspaceExists,projectExists,userIsWorkspaceMember,projectExistsInWorkspace,getProjectById)
router.put("/:projectId",isAuthenticated,workspaceExists,projectExists,userIsWorkspaceOwner,projectExistsInWorkspace,updateProject)
router.delete("/:projectId",isAuthenticated,workspaceExists,projectExists,userIsWorkspaceOwner,projectExistsInWorkspace,deleteProject)
export {router}