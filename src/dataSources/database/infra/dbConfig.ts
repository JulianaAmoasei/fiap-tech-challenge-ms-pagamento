import mongoose from "mongoose";

//TODO: passar strings de prod e dev para um obj
const CONNECTION_STRING = process.env.MONGODB_CONNECTIONSTRING as string;

async function conectaNaDatabase() {
  await mongoose.connect(CONNECTION_STRING);
  return mongoose.connection;
}

export default conectaNaDatabase;
