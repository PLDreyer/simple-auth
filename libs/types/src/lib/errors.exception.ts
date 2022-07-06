export class SimpleAuthError extends Error {
  public readonly reason: undefined | Error;
  constructor(msg: string, reason?: Error) {
    super(msg);
    this.reason = reason;
  }
}
