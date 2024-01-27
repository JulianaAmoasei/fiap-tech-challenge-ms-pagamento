import MetodoPagamentoModel from "../../../../src/dataSources/database/models/metodoPagamentoModel";

describe("MetodoPagamento Model", () => {
  it("deve criar uma nova instância de MetodoPagamentoModel", () => {
    const metodoPagamentoModel = new MetodoPagamentoModel();
    expect(metodoPagamentoModel).toBeInstanceOf(MetodoPagamentoModel);
  });

  it("deve criar um schema para MetodoPagamentoModel", () => {
    const { metodoPagamentoSchema } = MetodoPagamentoModel.init();
    expect(metodoPagamentoSchema).toBeDefined();
  });
});
