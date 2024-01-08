import express, { Express } from "express";
import swaggerUi from "swagger-ui-express";

import routes from "./adapters/api/routes/index";
import specs from "./adapters/api/routes/swaggerConfig";

const PORT = Number(process.env.PORT) || 3000;

export default class API {
  private app: Express;

  constructor() {
    this.app = express();
  }

  start() {
    routes(this.app);
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

    this.app.listen(PORT, () => {
      console.log("servidor escutando!");
    });
  }
}
