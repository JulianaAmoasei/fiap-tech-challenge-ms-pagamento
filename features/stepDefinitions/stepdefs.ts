/* eslint-disable @typescript-eslint/no-explicit-any */

// eslint-disable-next-line unused-imports/no-unused-imports
import { Given, Then, When } from '@cucumber/cucumber'
import assert from 'assert';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from "uuid";

import MessageBrokerService from '../../src/dataSources/messageBroker/messageBrokerService';
import { MsgPedidoPagamentoBody } from '../../src/domain/entities/types/pagamentoType';

dotenv.config();
const url_endpoint = "http://localhost:8000/api"

const queueService = new MessageBrokerService();

let response: any;
let pagamento: any;
const pedidoId = uuidv4();

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


////////////////////////
Given('que o sistema de pagamento está ok', function () {
  return true;
});


When('eu invoco a api de metodos de pagamento', async function () {
  response = await fetch(`${url_endpoint}api/pagamento/metodo`);
});

Then('deve retornar um a lista dos metodos disponiveis no sistema', async function () {
  const respBody = await response.json();
  const temItens = respBody?.message?.length > 0;
  assert.equal(temItens, true);
  assert.equal(respBody?.status, 'success');

});

Then('o status da resposta deve ser {int}', function (status) {
  assert.equal(response.status, status);
});

////////////////////////
Given('recebe um pagamento na fila e crio no banco',{timeout: 3 * 5000},  async function () {
  await queueService.enviaParaFila<MsgPedidoPagamentoBody>({
    pedidoId,
    metodoDePagamento: uuidv4(),
    valor: 1,
  }, process.env.FILA_ENVIO_PAGAMENTO as string);

  await delay(10000);
});


When('eu invoco a api de de pagamento', async function () {
  response = await fetch(`${url_endpoint}/api/pagamento/${pedidoId}`);
});

Then('deve retornar os dados do pagamento criado', async function () {
  const respBody = await response.json();
  pagamento = respBody?.pagamento
  assert.equal(respBody?.pagamento?.pedidoId, pedidoId);
  assert.equal(respBody?.status, 'success');
});

Then('o status da resposta do pagamento deve ser {int}', function (status) {
  assert.equal(response.status, status);
});

////////////////////////
Given('existe um pagamento criado', function () {
  assert.equal(pagamento.pedidoId, pedidoId);
});

When('eu invoco a api para mudar o status do pagamento', async function () {
  response = await fetch(`${url_endpoint}/api/pagamento/processamento/${pedidoId}`);
});

Then('deve retornar a confirmacao da mudanca', async function () {
  const respBody = await response.json();
  assert.equal(respBody?.mensagem, 'Processamento realizado');

});

Then('o status da mudanca do pagamento deve ser {int}', function (status) {
  assert.equal(response.status, status);
});

////////////////////////
Given('existe um pagamento que já foi processado', function () {
  return true;
});

When('eu invoco a api para mudar o status do pagamento já processado', async function () {
  response = await fetch(`${url_endpoint}/api/pagamento/processamento/${pedidoId}`);
});

Then('deve retornar a mensagem que já foi processado', async function () {
  const respBody = await response.json();
  console.log(respBody)
  assert.equal(respBody?.mensagem, 'Processamento já foi realizado');

});

Then('o status do erro deve ser {int}', function (status) {
  assert.equal(response.status, status);
});

