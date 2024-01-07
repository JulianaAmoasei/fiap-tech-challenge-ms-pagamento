import express, { Express } from "express";

import pagamentoRouter from "./pagamentoRouter"

const routes = (app: Express) => {
  app.use(express.json(), pagamentoRouter);
};

export default routes;
