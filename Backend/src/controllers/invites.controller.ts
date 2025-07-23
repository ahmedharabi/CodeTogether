import {Response,Request} from "express";
import {createInvite,verifyInvite,acceptInvite} from "../services/invites.service";

//create invite req -> /api/invite
// verify invite    get req ->/api/invite/token
//accept invite -> get req -> /api/invite/token/accept
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

const createInvitation=async (req:AuthenticatedRequest,res:Response):Promise<any>=>{
    // req body must have workspace id
    if(!req.isAuthenticated()){
        return res.status(401).json({
            "success":false,
            "message":"User not authenticated"
        })

    }
    try{
        const userId = req.user.id;
        const workspaceId = req.body.workspaceId;
        if (!userId || !workspaceId) {
            return res.status(400).json({
                "success": false,
                "message": "userId or workspaceId is missing"
            })

        }
        const invite = await createInvite(workspaceId, userId);
        return res.status(201).json({
            "success": true,
            "message": "invite created successfully",
            "data": invite
        })

    }catch (err){
        return res.status(500).json({
            "success":false,
            "message":"Something went wrong"
        })

    }
}

const verifyInvitation=async (req:AuthenticatedRequest,res:Response):Promise<any>=>{
    if(!req.isAuthenticated()){
        return res.status(400).json({
            "success":false,
            "message":"User not authenticated"
        })
    }
    const token=req.params.token;
    try{
        const isValid=await verifyInvite(token);
        if(!isValid){
            return res.status(400).json({
                "success":false,
                "message":"invalid or expired invite"
            })
        }
        return res.status(200).json({
            "success":true,
            "message":"invite code is valid"
        })

    }catch (error){
        return res.status(500).json({
            "success":false,
            "message":"Something went wrong"
        })
    }
}
const acceptInvitation=async (req:AuthenticatedRequest,res:Response):Promise<any>=> {
    if (!req.isAuthenticated()) {
        return res.status(400).json({
            "success": false,
            "message": "User not authenticated"
        })
    }
    const token = req.params.token;
    const userId = req.user.id;
    const workspaceId = req.body.workspaceId;

    try {
        const isValid = await verifyInvite(token);
        if (!isValid) {
            return res.status(400).json({
                "success": false,
                "message": "invite code is invalid or expired"
            })
        }
        const workspaceMember = await acceptInvite(token, workspaceId, userId);
        return res.status(200).json({
            "success": true,
            "message": "user added successfully",
            "data": workspaceMember
        })

    } catch (error:any) {
        return res.status(500).json({
            "success": false,
            "message": error.message
        })
    }
}

export {acceptInvitation,createInvitation,verifyInvitation};