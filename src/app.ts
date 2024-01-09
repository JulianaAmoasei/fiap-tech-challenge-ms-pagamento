import express, { Express } from "express";

import routes from "./adapters/api/routes/index";

const PORT = Number(process.env.PORT) || 3000;

export default class API {
  private app: Express;

  constructor() {
    this.app = express();
  }

  start() {
    routes(this.app);
    this.app.listen(PORT, () => {
      console.log("servidor escutando!");
    });
  }
}
