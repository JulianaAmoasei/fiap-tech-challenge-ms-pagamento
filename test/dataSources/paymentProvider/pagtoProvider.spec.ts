import QRCode from "qrcode";

import PagtoProvider from "../../../src/dataSources/paymentProvider/pagtoProvider";
import PagamentoError from "../../../src/domain/entities/errors/PagamentoErrors";

describe("serviço externo de pagamento", () => {
  const pagamento = {
    pedidoId: "123",
    metodoDePagamento: "QR Code",
    valor: 10,
  };
  it("deve gerar url do qrcode", async () => {
    const pagtoProvider = new PagtoProvider();
    const result = await pagtoProvider.geraCobranca(pagamento);
    
    expect(result).toHaveProperty('pedidoId');
    expect(result).toHaveProperty('qrUrl');
    expect(result.pedidoId).toBe(pagamento.pedidoId);
  });
  it("deve lançar erro em caso de falha no gateway", async () => {
    QRCode.toDataURL = jest
    .fn()
    .mockImplementationOnce(() => {
      throw new Error("Erro do gateway");
    });

    const pagtoProvider = new PagtoProvider();
    await expect(pagtoProvider.geraCobranca(pagamento)).rejects.toThrow(PagamentoError);
  })
});
