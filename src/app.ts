import conectaNaDatabase from "adapters/api/infra/dbConfig";
import { pagamentosFake, seedDb } from "adapters/api/seeders/pagamentoSeed";
import express, { Express } from "express";

import routes from "./adapters/api/routes/index";
const PORT = Number(process.env.PORT) || 3000;

async function conectaDb(): Promise<void> {
  const conexao = await conectaNaDatabase();
  conexao.on("error", (erro) => {
    console.error("erro de conexão", erro);
  });
  
  conexao.once("open", () => {
    console.log("Conexao com o banco feita com sucesso");
  })
  await seedDb(pagamentosFake);
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
