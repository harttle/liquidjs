import { Emitter } from './emitter'

export class StreamedEmitter implements Emitter {
  public buffer = '';
  public stream: NodeJS.ReadableStream = null as any
  constructor () {
    throw new Error('streaming not supported in browser')
  }
  public write: (html: any) => void
  public error: (err: Error) => void
  public end: () => void
}
