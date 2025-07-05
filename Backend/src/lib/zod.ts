import {z} from "zod"

const updatedUserSchema=z.object({  //full name | username | email  | avatar | bio | role
        full_name:z.string().min(5).max(30).optional(),
        username:z.string().min(5).max(20).optional(),
        email:z.string().email().optional(),
        avatar:z.string().url().optional(),
        bio:z.string().max(100).optional(),
        role:z.string().max(30).optional()
})

export {updatedUserSchema};