import QueueMonitoring from "adapters/interfaceAdapters/queues/consumers/filaEnvioPagamento";

import "dotenv/config";

import API from "./app";

export default async function init() {
  const api = new API();
  api.start();
}

QueueMonitoring();
init();
