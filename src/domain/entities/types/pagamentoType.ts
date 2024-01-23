export interface PagamentoDTO {
  _id?: string;
  pedidoId: string;
  valor: number;
  metodoDePagamento: string;
  statusPagamento: string;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
}

export interface PagamentoInput {
  _id?: string;
  pedidoId: string;
  valor: number;
  metodoDePagamento: string;
  statusPagamento: string;
  createdAt: Date;
  deletedAt: Date | null;
  updatedAt: Date | null;
}

export interface MsgPedidoPagamentoBody {
  pedidoId: string;
  metodoDePagamento: string;
  valor: number;
}

export interface MsgCobrancaBody {
  pedidoId: string;
  metodoDePagamento: string;
  valor: number;
}

export interface urlQrcodeQueueBody {
  pedidoId: string;
  qrUrl: string;
}

export interface MsgPagtoAtualizadoBody {
  pedidoId: string;
  statusPagamento: string;
}

export const statusPagamento = {
  AGUARDANDO_PAGAMENTO: "Aguardando pagamento",
  FALHA: "Falha no processo de pagamento",
  PAGAMENTO_CONCLUIDO: "Pagamento concluído",
} as const;

export type StatusPagamento =
  (typeof statusPagamento)[keyof typeof statusPagamento];
