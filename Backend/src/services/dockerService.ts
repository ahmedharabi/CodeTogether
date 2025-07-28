import {docker} from "../lib/dockerClient"
import {nanoid} from "nanoid";
import {getFreePort} from "../lib/get-port";

const createTheiaIDEContainer=async (volume:string)=>{
    const port=await getFreePort();
    console.log("port from docker:",port)
    const container=await docker.createContainer({
        Image:"theiaide/sadl",
        Cmd:["echo"," A TheiaIDE instance has started"],
        name:"TheiaIDE"+nanoid(10),
        HostConfig:{
            Binds:[volume],
            PortBindings: {
                '3000/tcp': [{ HostPort: `${port}` }]
            }
        }
    })
    await container.start();
    return container
}
export {createTheiaIDEContainer}