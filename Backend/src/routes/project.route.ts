import express, {RequestHandler} from "express";
import {isAuthenticated} from "../middlewares/authMiddleware";
import {workspaceExists} from "../middlewares/workspaceMiddleware";
import {userIsWorkspaceOwner} from "../middlewares/userMiddleware";
import {createProject} from "../controllers/project.controller"
import {router as devEnvRoutes} from "./devEnv.route";

const router=express.Router({ mergeParams: true });

router.use("/:projectId/devenv",devEnvRoutes);
router.post("/",isAuthenticated,workspaceExists,userIsWorkspaceOwner,createProject)

export {router}