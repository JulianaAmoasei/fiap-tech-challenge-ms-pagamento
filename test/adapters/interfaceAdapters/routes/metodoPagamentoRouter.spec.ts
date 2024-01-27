import express from "express";
import supertest from "supertest";
import { v4 as uuidv4 } from "uuid";

import MetodoPagamentoController from "../../../../src/adapters/interfaceAdapters/controllers/metodoPagamentoController";
import routes from "../../../../src/adapters/interfaceAdapters/routes";

const app = express();
app.use(express.json());
routes(app);
const server = app.listen(4000);

afterAll(() => {
  server.close()
})

const createdAt = new Date();

const metodoPagamentoMock = {
  _id: uuidv4(),
  nome: "QR Code",
  ativo: true,
  createdAt,
  deletedAt: null,
  updatedAt: null,
};

const listaMetodosPagamentoMock = [
  {
    _id: uuidv4(),
    nome: "QR Code",
    ativo: true,
    createdAt,
    deletedAt: null,
    updatedAt: null,
  },
];

describe("GET em /api/metodo-pagamento", () => {
  it("Deve listar os métodos de pagamento", async () => {
    MetodoPagamentoController.listaMetodosPagamento = jest
      .fn()
      .mockResolvedValue(listaMetodosPagamentoMock);

    await supertest(server)
      .get("/api/metodo-pagamento")
      .expect(200)
      .then((response) => {
        expect(response.body.message[0].nome).toBe("QR Code");
      });
  });
  it("Deve receber 404 quando método de pagamento não encontrado", async () => {
    MetodoPagamentoController.listaMetodosPagamento = jest
      .fn()
      .mockResolvedValue([]);

    await supertest(server)
      .get("/api/metodo-pagamento")
      .expect(404)
      ;
  });
});

describe("GET em /api/metodo-pagamento/default", () => {
  it("Deve retornar o método de pagamento padrão", async () => {
    MetodoPagamentoController.retornaMetodoPagamentoPadraoId = jest
      .fn()
      .mockResolvedValue(metodoPagamentoMock);

    await supertest(server)
      .get("/api/metodo-pagamento/default")
      .expect(200)
      .then((response) => {
        expect(response.body.message.nome).toBe("QR Code");
      });
  });
  it("Deve receber 404 quando método de pagamento padrão não encontrado", async () => {
    MetodoPagamentoController.retornaMetodoPagamentoPadraoId = jest
      .fn()
      .mockResolvedValue(null);

    await supertest(server)
      .get("/api/metodo-pagamento/default")
      .expect(404)
      ;
  });
});
