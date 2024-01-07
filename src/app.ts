import express, { Express } from "express";
import swaggerUi from "swagger-ui-express";

import routes from "./routes/index";
import specs from "./routes/swaggerConfig";

export default class API {
  private app: Express;

  constructor() {
    this.app = express();
  }

  start() {
    routes(this.app);
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

    this.app.listen(3000, () => {
      console.log("servidor escutando!");
    });
  }
}
