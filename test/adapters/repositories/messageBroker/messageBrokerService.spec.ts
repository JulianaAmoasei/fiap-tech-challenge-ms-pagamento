import { SQSClient } from "@aws-sdk/client-sqs";

import { SQSResponse } from "../../../../src/adapters/repositories/messageBroker/messageBrokerRepository";
import MessageBrokerService from "../../../../src/dataSources/messageBroker/messageBrokerService";

interface MockType {
  id: string;
  test: number;
}

describe("MessageBrokerService", () => {
  const messageService = new MessageBrokerService();
  const sendQueue = "MOCK_SQS";

  jest.mock("@aws-sdk/client-sqs", () => ({
    SQSClient: jest.fn(() => ({
      send: jest.fn(),
    })),
    DeleteMessageCommand: jest.fn(),
    ReceiveMessageCommand: jest.fn(),
  }));

  it("Teste enviar para fila", async () => {
    const mockTest: MockType = {
      id: "1",
      test: 0,
    };

    const mockSend = jest.fn().mockResolvedValueOnce({
      Messages: mockTest,
    });
    SQSClient.prototype.send = mockSend;

    const result = await messageService.enviaParaFila<MockType>(
      mockTest,
      sendQueue
    );

    expect(result).toBeTruthy();
  });

  it("Teste enviar para fila DLQ", async () => {
    const mockTest: MockType = {
      id: "1",
      test: 0,
    };

    const mockSend = jest.fn().mockResolvedValueOnce({
      Messages: mockTest,
    });
    SQSClient.prototype.send = mockSend;

    const mockSQSResponse: SQSResponse = {
      ReceiptHandle: "test",
      Body: "mock",
    };

    const result = await messageService.enviaParaDLQ(
      sendQueue,
      `${sendQueue}_dlq`,
      mockSQSResponse
    );

    expect(result).toBeTruthy();
  });

  it("Teste deletar mensagem processada", async () => {
    const mockReceiptHandle = "test";

    const mockSend = jest.fn().mockResolvedValueOnce({
      Messages: null,
    });
    SQSClient.prototype.send = mockSend;

    const result = await messageService.deletaMensagemProcessada(
      sendQueue,
      mockReceiptHandle
    );

    expect(result).toBeTruthy();
  });

  it("Teste receber mensagem", async () => {
    const mockReceiptHandle = "test";
    const mockTest: MockType = {
      id: "1",
      test: 0,
    };

    const mockSend = jest.fn().mockResolvedValueOnce({
      Messages: [
        { Body: JSON.stringify(mockTest), ReceiptHandle: mockReceiptHandle },
      ],
    });
    SQSClient.prototype.send = mockSend;

    const result = await messageService.recebeMensagem(sendQueue);

    expect(result).toMatchObject([
      { body: mockTest, receiptHandle: mockReceiptHandle },
    ]);
  });

  it("Teste receber sem ter mensagem", async () => {
    const mockSend = jest.fn().mockResolvedValueOnce({
      Messages: [],
    });
    SQSClient.prototype.send = mockSend;

    const result = await messageService.recebeMensagem(sendQueue);

    expect(result).toBeNull();
  });

  it("Teste receber mensagem com formato invalido", async () => {
    const mockReceiptHandle = "test";
    const mockTest = "invalid json";

    const mockSend = jest.fn().mockResolvedValueOnce({
      Messages: [{ Body: mockTest, ReceiptHandle: mockReceiptHandle }],
    });
    SQSClient.prototype.send = mockSend;

    const result = await messageService.recebeMensagem(sendQueue);

    expect(result?.length).toBe(0);
  });
});
