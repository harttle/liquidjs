import { Drop } from './drop'

export class BlockDrop extends Drop {
  constructor (
    // the block render from layout template
    private superBlockRender: () => Iterable<string> = () => ''
  ) {
    super()
  }
  public super () {
    return this.superBlockRender()
  }
}
