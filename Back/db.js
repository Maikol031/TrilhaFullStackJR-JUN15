import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

mongoose.set("strictQuery", true)

async function main() {
    await mongoose.connect(process.env.URI)
    console.log('Conectado ao mongoDB com sucesso')
}

main().catch((err) => console.log(err))

export default main;
