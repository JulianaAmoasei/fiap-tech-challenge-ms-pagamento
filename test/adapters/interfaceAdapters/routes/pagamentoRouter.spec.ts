import express from "express";
import supertest from "supertest";
import { v4 as uuidv4 } from "uuid";

import PagamentoController from "../../../../src/adapters/interfaceAdapters/controllers/pagamentoController";
import routes from "../../../../src/adapters/interfaceAdapters/routes";
import { PagamentoDTO, statusPagamento } from "../../../../src/domain/entities/types/pagamentoType";

const app = express();
app.use(express.json());
routes(app);
const server = app.listen(3000);

afterAll(() => {
  server.close()
})

const pagamentoMock: PagamentoDTO = {
  _id: uuidv4(),
  pedidoId: uuidv4(),
  valor: 10,
  metodoDePagamento: "QR Code",
  statusPagamento: statusPagamento.AGUARDANDO_PAGAMENTO,
  createdAt: new Date(),
  updatedAt: null,
  deletedAt: null,
};

const idMock = "123";

describe("GET em /pagamentos/:id", () => {
  it("Deve buscar um pagamento pelo id", async () => {
    PagamentoController.listaPagamento = jest
      .fn()
      .mockResolvedValue(pagamentoMock);

    await supertest(server)
      .get(`/api/pagamentos/${idMock}`)
      .expect(200)
      .then((response) => {
        expect(response.body.pagamento.valor).toBe(pagamentoMock.valor);
        expect(response.body.pagamento.statusPagamento).toBe(
          statusPagamento.AGUARDANDO_PAGAMENTO
        );
      });
  });

  it("Deve retornar erro", async () => {
    PagamentoController.listaPagamento = jest
      .fn()
      .mockResolvedValue(null);

    await supertest(server).get("/api/pagamentos/1").expect(404);
  });
});

describe("GET em /pagamentos/processamento/:id", () => {
  it("Deve atualizar um pagamento pelo id", async () => {
    PagamentoController.atualizaStatusPagamento = jest
      .fn()
      .mockResolvedValue(pagamentoMock);

    await supertest(server)
      .get(`/api/pagamentos/processamento/${idMock}`)
      .expect(200);
  });

  it("Deve retornar na resposta quando o pagamento ja foi processado", async () => {
    pagamentoMock.statusPagamento = statusPagamento.PAGAMENTO_CONCLUIDO
    PagamentoController.atualizaStatusPagamento = jest.fn().mockImplementation(() => {
      throw new Error('pagamento_ja_processado')
    });

    await supertest(server)
      .get(`/api/pagamentos/processamento/${idMock}`)
      .expect(200)
      .then((response) => {
        expect(response?.body?.mensagem).toBe(
          "Processamento já foi realizado"
        );
      });
  });

  it("Deve retornar erro", async () => {
    PagamentoController.atualizaStatusPagamento = jest
      .fn()
      .mockImplementationOnce(() => {
        throw new Error("Erro ao processar pagamento");
      });

    await supertest(server).get("/api/pagamentos/processamento/1").expect(500);
  });
});
