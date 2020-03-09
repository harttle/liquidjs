import { Cache } from './cache'

class Node<T> {
  constructor (
    public key: string,
    public value: T,
    public next: Node<T>,
    public prev: Node<T>
  ) {}
}

export class LRU<T> implements Cache<T> {
  private cache: { [key: string]: Node<T> } = {}
  private head: Node<T>
  private tail: Node<T>

  constructor (
    public limit: number,
    public size = 0
  ) {
    this.head = new Node<T>('HEAD', null as any, null as any, null as any)
    this.tail = new Node<T>('TAIL', null as any, null as any, null as any)
    this.head.next = this.tail
    this.tail.prev = this.head
  }

  write (key: string, value: T) {
    if (this.cache[key]) {
      this.cache[key].value = value
    } else {
      const node = new Node(key, value, this.head.next, this.head)
      this.head.next.prev = node
      this.head.next = node

      this.cache[key] = node
      this.size++
      this.ensureLimit()
    }
  }

  read (key: string): T | undefined {
    if (!this.cache[key]) return
    const { value } = this.cache[key]
    this.remove(key)
    this.write(key, value)
    return value
  }

  remove (key: string) {
    const node = this.cache[key]
    node.prev.next = node.next
    node.next.prev = node.prev
    delete this.cache[key]
    this.size--
  }

  clear () {
    this.head.next = this.tail
    this.tail.prev = this.head
    this.size = 0
    this.cache = {}
  }

  private ensureLimit () {
    if (this.size > this.limit) this.remove(this.tail.prev.key)
  }
}
