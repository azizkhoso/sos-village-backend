function StatusMessageError(message, status) {
  const err = new Error(message);
  if (String(Number(status)) === 'NaN') {
    err.status = 500;
    return err;
  }
  err.status = status;
  return err;
}

module.exports = StatusMessageError;
