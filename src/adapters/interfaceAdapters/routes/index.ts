import express, { Express } from "express";
import swaggerUi from "swagger-ui-express";

import metodoPagamentoRouter from "./metodoPagamentoRouter";
import pagamentoRouter from "./pagamentoRouter"
import specs from "./swaggerConfig";

const routes = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  app.use(express.json(), metodoPagamentoRouter, pagamentoRouter);
};

export default routes;
