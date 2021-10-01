import { Drop } from './drop'

export class BlockDrop extends Drop {
  constructor (
    // the block render from layout template
    private superBlockRender: () => Iterable<any> = () => ''
  ) {
    super()
  }
  /**
   * Provide parent access in child block by
   * {{ block.super }}
   */
  public super () {
    return this.superBlockRender()
  }
}
