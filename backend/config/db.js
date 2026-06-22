import mongoose from 'mongoose';
export const connectDb =  async ()=>{
    const connection_url = process.env.MONGO_URL;
    await mongoose.connect(connection_url).then(()=>console.log("!!!    Db Connected Suceessfully    |||"));

}