import MetodoPagamentoController from "../../../../src/adapters/interfaceAdapters/controllers/metodoPagamentoController";
import MetodoPagamentoRepository from "../../../../src/adapters/repositories/database/metodoPagamentoRepository";
import {
  MetodoPagamentoDTO, MetodoPagamentoPadraoDTO
} from "../../../../src/domain/entities/types/MetodoPagamentoType";

describe("método de pagamento controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const data = new Date();

  it("deve retornar uma lista de métodos de pagamento disponíveis", async () => {
    const expected: MetodoPagamentoDTO[] = [
      { nome: "QR Code", ativo: true, createdAt: data, updatedAt: null, deletedAt: null },
    ];
    const metodoPagamentoRepositoryMock = jest
      .spyOn(MetodoPagamentoRepository, "listaMetodosPagamento")
      .mockResolvedValue(expected);

    const result = await MetodoPagamentoController.listaMetodosPagamento();

    expect(metodoPagamentoRepositoryMock).toHaveBeenCalled();
    expect(result).toEqual(expected);
  });

  it("deve retornar o ID do método de pagamento padrão", async () => {
    const expected: MetodoPagamentoPadraoDTO | Promise<MetodoPagamentoPadraoDTO> = { id: '123' };
    const metodoPagamentoRepositoryMock = jest
      .spyOn(MetodoPagamentoRepository, "getMetodoPagamentoPadraoId")
      .mockResolvedValue(expected);

    const result = await MetodoPagamentoController.retornaMetodoPagamentoPadraoId();

    expect(metodoPagamentoRepositoryMock).toHaveBeenCalled();
    expect(result).toEqual(expected);
  });
});
