export default interface IContext {
  [key: string]: any;
  liquid_method_missing?: (key: string) => any; // eslint-disable-line
}
