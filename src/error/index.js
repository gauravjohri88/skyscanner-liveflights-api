export default class extends Error {
  constructor(message, config) {
    super(message);
    this.message = message;
    this.config = config;
  }
}
