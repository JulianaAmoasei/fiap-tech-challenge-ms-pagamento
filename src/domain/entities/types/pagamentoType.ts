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

export interface RecebimentoDePagamentoGatewayBody {
  pedidoId: string;
  statusPagamento: string;
}

export enum ProcessPagamentoReturnBody {
  SUCESSO = "Pagamento realizado",
  FALHA = "Processamento não realizado",
  ERRO_JA_PROCESSADO = "Processamento já foi realizado"
}

export enum StatusPagamentoServico {
  AGUARDANDO_PAGAMENTO = "Aguardando pagamento",
  FALHA = "Falha no processo de pagamento",
  PAGAMENTO_CONCLUIDO = "Pagamento concluído",
}

export enum PagamentoErrorCodes {
  FALHA_CONEXAO_PROVIDER = "falha na conexão com provedor de pagamento. pedido cancelado.",
  FALHA_PAGAMENTO = "falha no pagamento. pedido cancelado. contate sua instituição bancária.",
  FALHA_PRODUCAO = "seu pedido não pôde ser produzido. pedido cancelado. o pagamento será estornado.",
  FALHA_JA_PROCESSADO = "o pagamento já foi processado"
}

export enum StatusPagamentoGateway {
  SUCESSO = "Pagamento efetuado com sucesso",
  FALHA = "Falha no pagamento",
}

export type StatusPagamento =
  (typeof StatusPagamentoServico)[keyof typeof StatusPagamentoServico];
