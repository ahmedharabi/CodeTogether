import {docker} from "../lib/dockerClient"
import {nanoid} from "nanoid";
import {getFreePort} from "../lib/get-port";



const startedContainers: string[]=[];

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
    startedContainers.push(container.id);
    return container
}
const stopAllContainers=async ()=>{
    for(const id of startedContainers){
        try {
            const container=docker.getContainer(id);
            await container.stop();
            console.log(`🛑 Stopped container: ${id}`);
        }catch (error:any){
            console.error(`❌ Error stopping container ${id}: ${error.message}`);
        }
    }
}



export {createTheiaIDEContainer,stopAllContainers}