import dotenv from "dotenv";
import express, { Express } from "express";

import { DataBaseConfig } from "./adapter/driven/infra/config/db.config";
import Modelos from "./adapter/driven/infra/models";
import { Server } from "./adapter/driver/api/config/server.config";
import {
  categoriaRouter,
  produtoRouter,
} from "./adapter/driver/api/routers/index";

dotenv.config();

const database = new DataBaseConfig({
  database: process.env.DB_NAME ?? "projeto",
  host: process.env.DB_HOST ?? "fiap-soat-project_db",
  userName: process.env.DB_USERNAME ?? "root",
  password: process.env.DB_PASSWORD ?? "testtest",
  port: 3306,
});

database.authenticate();
database.synchronizeModels(Modelos);

const app: Express = express();

const server = new Server({ appConfig: app });

server.addRouter("/api/categoria", categoriaRouter);
server.addRouter("/api/produto", produtoRouter);

server.init();
