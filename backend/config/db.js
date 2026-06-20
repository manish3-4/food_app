import mongoose from 'mongoose';
export const connectDb =  async ()=>{
    await mongoose.connect('mongodb+srv://manislpuhp_db_user:pTjAvEH7CCP5ogTo@cluster0.hcc8k7q.mongodb.net/?appName=Cluster0').then(()=>console.log("!!!    Db Connected Suceessfully    |||"));

}