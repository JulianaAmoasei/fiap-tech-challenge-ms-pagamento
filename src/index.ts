import "dotenv/config";

import API from "./app";
import QueueMonitoring from "adapters/interfaceAdapters/queues/consumers/filaEnvioPagamento";

async function init() {
  const api = new API();
  api.start()
}

init();
QueueMonitoring();