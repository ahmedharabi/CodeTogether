import {stopAllContainers}from "../services/dockerService"

const setupSignalHandler= ()=>{
    const cleaup=async ()=>{
        console.log('\n🚨 Received termination signal. Cleaning up...');
        await stopAllContainers();
        process.exit();
    }

    process.on("SIGINT",cleaup);
    process.on("SIGTERM",cleaup);

}

export {setupSignalHandler}