import { metodoPagamentoModel } from "adapters/repositories/database/metodoPagamentoRepository";
import { v4 as uuidv4 } from "uuid";

const metodosPagamento = [
  {
    id: 'ea3d6981-099d-49a5-9f45-9ed88affc9b5',
    nome: "QRCode",
    ativo: true,
    createdAt: new Date(),
    updateAt: null,
    deletedAt: null,
  },
  {
    id: '35acc5e5-c864-4653-956f-eba3c0209c4a',
    nome: "PIX",
    ativo: true,
    createdAt: new Date(),
    updateAt: null,
    deletedAt: null,
  }
]

async function seedDb(listaItens: any): Promise<void> {
  await metodoPagamentoModel.metodoPagamento.deleteMany();
  await metodoPagamentoModel.metodoPagamento.insertMany(listaItens);
}

export { metodosPagamento, seedDb };
