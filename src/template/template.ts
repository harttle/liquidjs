export default abstract class Template<T> {
  token: T;
  constructor (token: T) {
    this.token = token
  }
}
