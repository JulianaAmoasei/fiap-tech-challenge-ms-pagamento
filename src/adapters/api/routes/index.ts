import express, { Express } from "express";

import pagamentoRouter from "./pagamentoRouter"

const routes = (app: Express) => {
  app.route('/teste').get((req, res) => res.status(200).send("Curso de Node.js"));
  app.use(express.json(), pagamentoRouter);
};

export default routes;
