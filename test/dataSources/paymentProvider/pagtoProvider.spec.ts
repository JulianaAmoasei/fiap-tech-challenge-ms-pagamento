import PagtoProvider from "../../../src/dataSources/paymentProvider/pagtoProvider";

describe("serviço externo de pagamento", () => {
  it("deve gerar url do qrcode", async () => {
    const pagamento = {
      pedidoId: "123",
      metodoDePagamento: "QR Code",
      valor: 10,
    };

    const pagtoProvider = new PagtoProvider();
    const result = await pagtoProvider.geraCobranca(pagamento);

    expect(result.pedidoId).toBe(pagamento.pedidoId);
    expect(result.qrUrl).toBeDefined();
  });
});
