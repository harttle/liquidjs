export abstract class TemplateImpl<T> {
  public token: T;
  public constructor (token: T) {
    this.token = token
  }
}
