export function drainStream (stream: NodeJS.ReadableStream) {
  return new Promise((resolve, reject) => {
    let html = ''
    stream.on('data', data => { html += data })
    stream.on('end', () => resolve(html))
    stream.on('error', (err: Error) => reject(err))
  })
}
