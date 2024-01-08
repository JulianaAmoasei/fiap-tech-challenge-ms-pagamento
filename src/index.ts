import dotenv from "dotenv";

import API from "./app";

// import { DataBaseConfig } from "~datasources/database/config/db.config";

dotenv.config();

async function init() {

  // await database.authenticate();
  // await database.synchronizeModels(Modelos);
  const api = new API();
  api.start()

}

init();
