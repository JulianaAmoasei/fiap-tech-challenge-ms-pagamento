import conectaNaDatabase from "dataSources/database/infra/dbConfig";
import express, { Express } from "express";

import routes from "./adapters/interfaceAdapters/routes/index";
import { metodosPagamento, seedDb } from "./dataSources/database/seeders/metodosPagamentoSeed";
const PORT = Number(process.env.PORT) || 3000;

async function conectaDb(): Promise<void> {
  const conexao = await conectaNaDatabase();
  conexao.on("error", (erro) => {
    console.error("erro de conexão", erro);
  });

  conexao.once("open", () => {
    console.log("Conexao com o banco feita com sucesso");
  });
  await seedDb(metodosPagamento);
}

conectaDb();

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
