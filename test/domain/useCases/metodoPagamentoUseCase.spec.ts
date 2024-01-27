import MetodoPagamentoRepository from "../../../src/adapters/repositories/database/metodoPagamentoRepository";
import { MetodoPagamentoDTO } from "../../../src/domain/entities/types/MetodoPagamentoType";
import MetodoPagamentoUseCase from "../../../src/domain/useCases/metodoPagamentoUseCase";

describe("Metodo Pagamento Use Cases", () => {
  const createdAt = new Date();

  const mockListaPagamentos: MetodoPagamentoDTO[] = [
    {
      _id: "1234-1234-1234",
      nome: "QR Code",
      ativo: true,
      createdAt,
      deletedAt: null,
      updatedAt: new Date(),
    },
  ];

  const listaPagamentosMock = jest.fn();
  const listaMetodosPagamentoMock = jest.fn();

  listaPagamentosMock.mockReturnValue(mockListaPagamentos);
  listaMetodosPagamentoMock.mockReturnValue(mockListaPagamentos);

  beforeEach(() => {
    MetodoPagamentoUseCase.listaPagamentos = listaPagamentosMock;
    MetodoPagamentoRepository.listaMetodosPagamento = listaMetodosPagamentoMock;
  });

  it("Deve puxar uma lista de métodos de pagamento do repositório", async () => {
    const resultado = await MetodoPagamentoUseCase.listaPagamentos();
    expect(resultado).toEqual(expect.arrayContaining(mockListaPagamentos));
  });
  it("Deve retornar do repositório corretamente", async () => {
    const resultado = await MetodoPagamentoRepository.listaMetodosPagamento();
    expect(resultado).toEqual(expect.arrayContaining(mockListaPagamentos));
  });
});
