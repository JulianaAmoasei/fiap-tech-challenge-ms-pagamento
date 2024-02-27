import express from "express";
import supertest from "supertest";
import { v4 as uuidv4 } from "uuid";

import PagamentoController from "../../../../src/adapters/interfaceAdapters/controllers/pagamentoController";
import routes from "../../../../src/adapters/interfaceAdapters/routes";
import { RecebimentoDePagamentoGatewayBody } from "../../../../src/adapters/interfaceAdapters/routes/schemas/pagamentoRouter.schema";
import { PagamentoDTO, StatusPagamentoGateway,StatusPagamentoServico } from "../../../../src/domain/entities/types/pagamentoType";

const app = express();
app.use(express.json());
routes(app);
const server = app.listen(3000);

afterAll(() => {
  server.close()
})

const registroPagamentoMock: PagamentoDTO = {
  _id: uuidv4(),
  pedidoId: uuidv4(),
  valor: 10,
  metodoDePagamento: "QR Code",
  statusPagamento: StatusPagamentoServico.AGUARDANDO_PAGAMENTO,
  createdAt: new Date(),
  updatedAt: null,
  deletedAt: null,
};

const pagamentoSucessoMock: RecebimentoDePagamentoGatewayBody = {
  pedidoId: uuidv4(),
  statusPagamento: StatusPagamentoGateway.SUCESSO,
};

const pagamentoFalhaMock: RecebimentoDePagamentoGatewayBody = {
  pedidoId: uuidv4(),
  statusPagamento: StatusPagamentoGateway.FALHA,
};

const idMock = "123";

describe("GET em /api/pagamento/:id", () => {
  it("Deve buscar um pagamento pelo id", async () => {
    PagamentoController.listaPagamento = jest
      .fn()
      .mockResolvedValue(registroPagamentoMock);

    await supertest(server)
      .get(`/api/pagamento/${idMock}`)
      .expect(200)
      .then((response) => {
        expect(response.body.pagamento.valor).toBe(registroPagamentoMock.valor);
        expect(response.body.pagamento.statusPagamento).toBe(
          StatusPagamentoServico.AGUARDANDO_PAGAMENTO
        );
      });
  });

  it("Deve retornar erro", async () => {
    PagamentoController.listaPagamento = jest
      .fn()
      .mockResolvedValue(null);

    await supertest(server).get("/api/pagamento/1").expect(404);
  });
});

describe("POST em /api/pagamento/processamento/", () => {
  it("Deve atualizar um pagamento pelo id em caso de sucesso", async () => {
    PagamentoController.atualizaStatusPagamento = jest
      .fn()
      .mockResolvedValue(registroPagamentoMock);

    await supertest(server)
      .post(`/api/pagamento/processamento/`)
      .send(pagamentoSucessoMock)
      .set('Accept', 'application/json')
      .expect(200)
      .then(response => {
        expect(response.body.mensagem).toEqual('Pagamento realizado');
     })
  });

  it("Deve atualizar um pagamento pelo id em caso de falha", async () => {
    PagamentoController.atualizaStatusPagamento = jest
      .fn()
      .mockResolvedValue(registroPagamentoMock);

      await supertest(server)
      .post(`/api/pagamento/processamento/`)
      .send(pagamentoFalhaMock)
      .set('Accept', 'application/json')
      .expect(200)
      .then(response => {
        expect(response.body.mensagem).toEqual('Processamento não realizado');
     })
  });

  it("Deve retornar na resposta quando o pagamento ja foi processado", (done) => {
    registroPagamentoMock.statusPagamento = StatusPagamentoServico.PAGAMENTO_CONCLUIDO;
    PagamentoController.atualizaStatusPagamento = jest.fn().mockImplementation(() => {
      throw new Error('o pagamento já foi processado')
    });

    supertest(server)
      .post(`/api/pagamento/processamento/`)
      .expect(200)
      .then((response) => {
        expect(response.body.mensagem).toBe(
          "Processamento já foi realizado"
        );
      });
      done();
  });
});
