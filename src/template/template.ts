export default abstract class Template<T> {
  public token: T;
  public constructor (token: T) {
    this.token = token
  }
}
