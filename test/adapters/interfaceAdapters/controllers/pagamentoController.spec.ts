import PagamentoController from "../../../../src/adapters/interfaceAdapters/controllers/pagamentoController";
import PagamentoRepository from "../../../../src/adapters/repositories/database/pagamentoRepository";
import { StatusPagamentoServico } from "../../../../src/domain/entities/types/pagamentoType";

describe("pagamento controller", () => {
  it("listaPagamento deve chamar PagamentoRepository", async () => {
    const id = "123";
    const pagamento = {
      _id: "123",
      pedidoId: "123",
      valor: 10,
      metodoDePagamento: "QR Code",
      statusPagamento: StatusPagamentoServico.AGUARDANDO_PAGAMENTO,
      createdAt: new Date(),
      deletedAt: null,
      updatedAt: null,
    };
    const listaPagamentoMock = jest
    .spyOn(PagamentoRepository, "listaPagamento")
    .mockResolvedValue(pagamento);
    
    const result = await PagamentoController.listaPagamento(id);
    
    expect(listaPagamentoMock).toHaveBeenCalledWith(id);
    expect(result).toEqual(pagamento);
    
    listaPagamentoMock.mockRestore();
  });
  // it("ao receber status de pagamento 'FALHA' deve atualizar de acordo no banco de dados e enviar dados corretos para a fila", async () => {
  //   const queueService = new MessageBrokerService();
  //   const resultPagamentoResponse: RecebimentoDePagamentoGatewayBody = {
  //     pedidoId: "123",
  //     statusPagamento: PagamentoStatus.FALHA,
  //   };

  //   const dadosPagto: PagamentoDTO = {
  //     _id: "123",
  //     pedidoId: "123",
  //     valor: 10,
  //     metodoDePagamento: "QR Code",
  //     statusPagamento: StatusPagamentoServico.AGUARDANDO_PAGAMENTO,
  //     createdAt: new Date(),
  //     deletedAt: null,
  //     updatedAt: null,
  //   };

  //   const pagtoAtualizado: PagamentoDTO = {
  //     _id: "123",
  //     pedidoId: "123",
  //     valor: 10,
  //     metodoDePagamento: "QR Code",
  //     statusPagamento: StatusPagamentoServico.FALHA,
  //     createdAt: new Date(),
  //     deletedAt: null,
  //     updatedAt: null,
  //   };

  //   const enviaDadosPagtoAtualizadosMock = jest
  //     .spyOn(PagamentoUseCase, "enviaDadosPagtoAtualizados")
  //     .mockImplementation();

  //   const listaPagamentoMock = jest
  //     .spyOn(PagamentoRepository, "listaPagamento")
  //     .mockResolvedValue(dadosPagto);

  //   const atualizaPagamentoMock = jest
  //     .spyOn(PagamentoRepository, "atualizaPagamento")
  //     .mockResolvedValue(pagtoAtualizado);

  //   const result = await PagamentoController.atualizaStatusPagamento(
  //     queueService,
  //     resultPagamentoResponse
  //   );

  //   expect(result).toEqual(pagtoAtualizado);
  //   expect(listaPagamentoMock).toHaveBeenCalledWith(
  //     resultPagamentoResponse.pedidoId
  //   );
  //   expect(atualizaPagamentoMock).toHaveBeenCalledWith(
  //     dadosPagto._id as string,
  //     {
  //       ...dadosPagto,
  //       statusPagamento: StatusPagamentoServico.FALHA,
  //     }
  //   );
  //   expect(enviaDadosPagtoAtualizadosMock).toHaveBeenCalledWith(
  //     queueService,
  //     pagtoAtualizado
  //   );
  // });
});
