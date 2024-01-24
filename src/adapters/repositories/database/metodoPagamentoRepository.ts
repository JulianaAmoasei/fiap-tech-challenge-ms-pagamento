import MetodoPagamentoModel from "dataSources/database/models/metodoPagamentoModel";

import { MetodoPagamentoDTO, MetodoPagamentoPadraoDTO } from "~domain/entities/types/MetodoPagamentoType";

export const metodoPagamentoModel = MetodoPagamentoModel.init();

export default class MetodoPagamentoRepository {
  static async listaMetodosPagamento(): Promise<MetodoPagamentoDTO[]> {
    return metodoPagamentoModel.metodoPagamento.find() as unknown as MetodoPagamentoDTO[];
  }
  static async getMetodoPagamentoPadraoId(): Promise<MetodoPagamentoPadraoDTO> {
    return metodoPagamentoModel.metodoPagamento.findOne({ nome: "QR Code" }) as unknown as MetodoPagamentoPadraoDTO;
  }
}
