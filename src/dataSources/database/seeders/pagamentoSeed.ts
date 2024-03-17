import { pagamentoModel } from "adapters/repositories/database/pagamentoRepository";
import { v4 as uuidv4 } from "uuid";

import { PagamentoInput, StatusPagamentoServico } from "~domain/entities/types/pagamentoType";

const pagamentosFake: PagamentoInput[] = [
  {
    pedidoId: uuidv4(),
    valor: 25,
    metodoDePagamento: "QR Code",
    statusPagamento: StatusPagamentoServico.AGUARDANDO_PAGAMENTO,
    createdAt: new Date(),
    deletedAt: null,
    updatedAt: null,
  },
  {
    pedidoId: uuidv4(),
    valor: 50,
    metodoDePagamento: "QR Code",
    statusPagamento: StatusPagamentoServico.AGUARDANDO_PAGAMENTO,
    createdAt: new Date(),
    deletedAt: null,
    updatedAt: null,
  },
  {
    pedidoId: uuidv4(),
    valor: 12,
    metodoDePagamento: "QR Code",
    statusPagamento: StatusPagamentoServico.PAGAMENTO_CONCLUIDO,
    createdAt: new Date(),
    deletedAt: null,
    updatedAt: new Date(),
  }
]

async function seedDb(listaItens: PagamentoInput[]): Promise<void> {
  await pagamentoModel.pagamento.insertMany(listaItens);
}

export { pagamentosFake, seedDb };
