import {Request,Response} from "express";
import {updatedUserSchema} from "../lib/zod";
import {prisma} from "../lib/prisma";
import validator from "validator";
import {Prisma} from "@prisma/client";


const getUserById=async (req:Request,res:Response):Promise<any>=>{
    const id=req.params.id;
    if(!validator.isUUID(id)){
        return res.status(400).json({
            error:"Invalid user id"
        })
    }
    try{
        const user=await prisma.user.findUnique({
            where:{id},
            select:{
                full_name:true,
                email:true,
                joined_at :true,
                bio:true,
                role:true,
                avatar_url:true
            }
        })
        if(!user){
            return res.status(404).json({
                error:"User not found"
            })
        }
        return res.status(200).json({
            message:"User fetched successfully",
            user
        })

    }catch (err:any){
        return res.status(500).json({
            error:"Something went wrong"
        })
    }
}
const getAllUsers=async (req:Request,res:Response):Promise<any>=>{
    const page=parseInt(<string>req.query.page)||1;
    const pageSize=parseInt(<string>req.query.pageSize) || 10;

    const allowedSortFields=["full_name","email"];
    const sortBy=allowedSortFields.includes(<string>req.query.sortBy) ? req.query.sortBy : "full_name";
    const order= req.query.order==="desc" ? "desc":"asc";

    const skip=(page-1)*pageSize;

    try{
        const [users,total]=await Promise.all([
            prisma.user.findMany({
                where:{deleted:false},
                skip,
                take:pageSize,
                orderBy:{
                    [<string>sortBy]:order
                },
                select:{
                    full_name:true,
                    email:true,
                    joined_at :true,
                    bio:true,
                    role:true,
                    avatar_url:true
                }
            }),prisma.user.count()
        ])

        res.status(200).json({
            message:"Users fetched successfully",
            data:users,
            pagination:{
                page,
                pageSize,
                total
            },
            sorting:{sortBy,order}
        })
    }catch (err){
        res.status(500).json({
            error:"Failed to fetch users"
        })
    }
}
const updateUser=async (req:Request,res:Response):Promise<any>=>{
    const id=req.params.id;
    //data validation using zod
    const validation=updatedUserSchema.safeParse(req.body);

    if(!validation.success){
        return res.status(400).json({
            error:"validation error",
            issues: validation.error.flatten().fieldErrors
        })
    }

    try{
        const updatedUser=await prisma.user.update({
            where: {id},
            data:validation.data
        })
        return res.status(200).json({
            message:"User updated sucessfully",
            user:updatedUser
        })
    }catch (err:any){
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code==="P2025"){
            return res.status(404).json({err:"User not found"});
        }

        return res.status(500).json({error:"Something went wrong"});
    }
}
const deleteUser=async (req:Request,res:Response):Promise<any>=>{
    const id=req.params.id;
    if(!validator.isUUID(id)){
        return res.status(400).json( {
            error:"Invalid user Id"
        })
    }
    try {
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.deleted) {
            return res.status(400).json({ error: 'User already deleted' });
        }

        await prisma.user.update({
            where:{id},
            data:{
                deleted:true,
                deletedAt: new Date()
            }
        })
        return res.status(200).json({
            message:"User deleted successfully"
        })
    }catch (err:any){
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.status(500).json({
            error:"Something went wrong"
        })
    }
}
const getCurrentUser=async (req:Request,res:Response):Promise<any>=>{
    if(!req.isAuthenticated()){
        return res.status(400).json({
            "success": false,
            "message": "User not authenticated",
        })
    }
    const user=req.user;
    // @ts-ignore
    const { deletedAt ,deleted,github_id,google_id,password_hash,...safeUser}=user;
    return res.status(200).json({
        "success":true,
        "message":"User found successfully",
        "data":{
            ...safeUser
        }
    })
}

export {deleteUser,getUserById,getAllUsers,updateUser,getCurrentUser}