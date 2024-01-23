import "dotenv/config";

import API from "./app";

async function init() {
  const api = new API();
  api.start()
}

init();
