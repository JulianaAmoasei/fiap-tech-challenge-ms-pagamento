import MetodoPagamentoRepository, {
  metodoPagamentoModel,
} from "../../../../src/adapters/repositories/database/metodoPagamentoRepository";
import {
  MetodoPagamentoDTO,
} from "../../../../src/domain/entities/types/MetodoPagamentoType";

describe("método de pagamento repository", () => {
  const createdAt = new Date();
  it("Deve listar todos os métodos de pagamento", async () => {
    const metodoPagamento: MetodoPagamentoDTO[] = [{
      _id: "1234-1234-1234",
      nome: "QR Code",
      ativo: true,
      createdAt,
      deletedAt: null,
      updatedAt: null,
    }];

    metodoPagamentoModel.metodoPagamento.find = jest.fn().mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValue([{
        _id: "1234-1234-1234",
        nome: "QR Code",
        ativo: true,
        createdAt,
        deletedAt: null,
        updatedAt: null,
      }])
     }))

    const listaPagamentos = await MetodoPagamentoRepository.listaMetodosPagamento();
    expect(listaPagamentos).toEqual(expect.arrayContaining(metodoPagamento));
  });

  it("Deve retornar um método de pagamento padrão", async () => {

    const metodoPagamento: MetodoPagamentoDTO = {
      _id: "1234-1234-1234",
      nome: "QR Code",
      ativo: true,
      createdAt,
      deletedAt: null,
      updatedAt: null,
    };

    metodoPagamentoModel.metodoPagamento.findOne = jest.fn().mockImplementationOnce(() => ({
      select: jest.fn().mockResolvedValue({
        _id: "1234-1234-1234",
        nome: "QR Code",
        ativo: true,
        createdAt,
        deletedAt: null,
        updatedAt: null,
      })
     }))

    const metodoPagamentoPadrao = await MetodoPagamentoRepository.getMetodoPagamentoPadraoId();
    expect(metodoPagamentoPadrao).toMatchObject(metodoPagamento);
  });
});
