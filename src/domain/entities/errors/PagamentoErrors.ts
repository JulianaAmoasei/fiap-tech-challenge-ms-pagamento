class PagamentoError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export default PagamentoError;
