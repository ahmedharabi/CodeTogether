import { app } from './app'
//import logger from './utils/logger'

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3002;

app.listen(PORT, () => {
    console.log(`Server is running on pt ${PORT}`);
})