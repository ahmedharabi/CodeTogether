import {Request,Response} from "express";
import {updatedUserSchema} from "../lib/zod";
import {prisma} from "../lib/prisma";
import validator from "validator";


const getUserById=async (req:Request,res:Response)=>{
    const id=req.body.params.id;
    if(!validator.isUUID(id)){
        res.status(400).json({
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


const getAllUsers=async (req:Request,res:Response)=>{
    const page=parseInt(<string>req.query.page)||1;
    const pageSize=parseInt(<string>req.query.pageSize) || 10;

    const allowedSortFields=["full_name","email"];
    const sortBy=allowedSortFields.includes(<string>req.query.sortBy) ? req.query.sortBy : "full_name";
    const order= req.query.order==="desc" ? "desc":"asc";

    const skip=(page-1)*pageSize;

    try{
        const [users,total]=await Promise.all([
            prisma.user.findMany({
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
            soring:{sortBy,order}
        })
    }catch (err){
        res.status(500).json({
            error:"Failed to fetch users"
        })
    }
}



const updateUser=async (req:Request,res:Response)=>{
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
        if (err.code==="p2025"){
            return res.status(404).json({err:"User not found"});
        }

        return res.status(500).json({error:"Something went wrong"});
    }
}