import slugify from "slugify";

const toSlug=(title:string)=>{
    return slugify(title,{lower:true,strict:true});
}
export {toSlug};