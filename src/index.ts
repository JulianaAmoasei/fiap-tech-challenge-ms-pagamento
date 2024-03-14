import MonitoramentoPagamentos from "adapters/interfaceAdapters/queues/consumers/filaEnvioPagamento";
import MonitoramentoCancelamentos from "adapters/interfaceAdapters/queues/consumers/filaPedidoCancelado";

import "dotenv/config";

import API from "./app";

export default async function init() {
  const api = new API();
  api.start();
}

MonitoramentoCancelamentos();
MonitoramentoPagamentos();
init();
