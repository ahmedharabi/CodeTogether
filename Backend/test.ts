import path from 'path';
import fs = require('fs');


const f=async ()=>{
    const BASE_VOLUMES_DIR = path.resolve("volumes");
    const volumesPath = path.join(BASE_VOLUMES_DIR, "dev-env", "5465465151651d561f65d1f56ds165f1ds65fds65f4");
    await fs.promises.mkdir(volumesPath,{recursive:true});
    console.log(volumesPath);
}
f().then()