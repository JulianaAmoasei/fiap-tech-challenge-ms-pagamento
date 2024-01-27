import mongoose from "mongoose";

export default class PagamentoModel {
  static init() {
    const pagamentoSchema = new mongoose.Schema(
      {
        // _id: { type: mongoose.Schema.Types.String },
        pedidoId: { type: mongoose.Schema.Types.String },
        valor: { type: mongoose.Schema.Types.Number },
        metodoDePagamento: { type: mongoose.Schema.Types.String },
        statusPagamento: { type: mongoose.Schema.Types.String },
        createdAt: { type: mongoose.Schema.Types.Date },
        deletedAt: { type: mongoose.Schema.Types.Date || null },
        updatedAt: { type: mongoose.Schema.Types.Date || null },
      },
      { versionKey: false }
    );

    const pagamento = mongoose.model("pagamentos", pagamentoSchema);
    return { pagamento, pagamentoSchema };
  }
}
