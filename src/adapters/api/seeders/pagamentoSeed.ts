import { pagamentoModel } from "adapters/database/repository/pagamentoRepository";
import { v4 as uuidv4 } from "uuid";

import { PagamentoInput, statusPagamento } from "~domain/entities/types/pagamentoType";

const pagamentosFake: PagamentoInput[] = [
  {
    idPedido: uuidv4(),
    valorPedido: 25,
    valorPagamento: 25,
    metodoPagamento: "QR Code",
    statusPagamento: statusPagamento.AGUARDANDO_PAGAMENTO,
    createdAt: new Date(),
    deletedAt: null,
    updatedAt: null,
  },
  {
    idPedido: uuidv4(),
    valorPedido: 50,
    valorPagamento: 50,
    metodoPagamento: "QR Code",
    statusPagamento: statusPagamento.AGUARDANDO_PAGAMENTO,
    createdAt: new Date(),
    deletedAt: null,
    updatedAt: null,
  },
  {
    idPedido: uuidv4(),
    valorPedido: 12,
    valorPagamento: 12,
    metodoPagamento: "QR Code",
    statusPagamento: statusPagamento.PAGAMENTO_CONCLUIDO,
    createdAt: new Date(),
    deletedAt: null,
    updatedAt: new Date(),
  }
]

async function seedDb(listaItens: PagamentoInput[]): Promise<void> {
  await pagamentoModel.pagamento.insertMany(listaItens);
  // await mongoose.connection.close();
}

export { pagamentosFake, seedDb };
