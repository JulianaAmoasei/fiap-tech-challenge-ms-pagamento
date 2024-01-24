import mongoose from "mongoose";

export default class MetodoPagamentoModel {
  static init() {
    const metodoPagamentoSchema = new mongoose.Schema(
      {
        _id: { type: mongoose.Schema.Types.String },
        nome: { type: mongoose.Schema.Types.String },
        ativo: { type: mongoose.Schema.Types.Boolean },
        createdAt: { type: mongoose.Schema.Types.Date },
        deletedAt: { type: mongoose.Schema.Types.Date || null },
        updatedAt: { type: mongoose.Schema.Types.Date || null },
      },
      { versionKey: false }
    );

    const metodoPagamento = mongoose.model(
      "metodoPagamentos",
      metodoPagamentoSchema
    );
    return { metodoPagamento, metodoPagamentoSchema };
  }
}
