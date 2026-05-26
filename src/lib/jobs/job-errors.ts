export class JobRetryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JobRetryError";
  }
}

export class JobFatalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "JobFatalError";
  }
}
