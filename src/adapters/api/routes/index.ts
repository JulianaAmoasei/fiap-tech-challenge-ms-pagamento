import express, { Express } from "express";
import swaggerUi from "swagger-ui-express";

import pagamentoRouter from "./pagamentoRouter"
import specs from "./swaggerConfig";

const routes = (app: Express) => {
  app.route('/teste').get((req, res) => res.status(200).send("Curso de Node.js"));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  app.use("/api/pagamentos", pagamentoRouter);
  app.use(express.json());
};

export default routes;
