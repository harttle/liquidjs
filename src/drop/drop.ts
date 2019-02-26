export abstract class Drop {
  abstract valueOf(): any;

  liquid_method_missing (name: string) { // eslint-disable-line
  }
}
