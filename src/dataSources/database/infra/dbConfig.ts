import mongoose from "mongoose";

const CONNECTION_STRING = process.env.MONGODB_CONNECTIONSTRING as string;

async function conectaNaDatabase() {
  await mongoose.connect(CONNECTION_STRING);
  return mongoose.connection;
}

export default conectaNaDatabase;
