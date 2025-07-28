import getPort, {portNumbers} from 'get-port';

const getFreePort = async (rangeStart = 3000, rangeEnd = 3999) => {
    console.log(await getPort({port: portNumbers(rangeStart, rangeEnd)}))
    return await getPort({port: portNumbers(rangeStart, rangeEnd)}) // ⛔ this won’t work
};
export {getFreePort}