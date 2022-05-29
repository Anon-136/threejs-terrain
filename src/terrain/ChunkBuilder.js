import { Chunk } from './Chunk'

export class ChunkBuilder {
  pool = {}
  constructor() {
    this.reset()
  }
  reset() {
    this.generator = null
    this.queue = []
    this.old = []
    this.new = []
  }
  get busy() {
    return !!this.generator || this.queue.length > 0
  }

  allocateChunk(group, ...params) {
    const [w] = params
    ensure(this.pool, w, [])

    let chunk = null
    // if pool has some chunks
    if (this.pool[w].length > 0) {
      // remove and get last chunk from the pool
      // reuse chunk object
      chunk = this.pool[w].pop()
      chunk.setParam(...params) // set new param
    } else {
      chunk = new Chunk(...params) // generate new chunk by param
      group.add(chunk.mesh)
    }

    chunk.hide() // hide the chunk
    this.queue.push(chunk) // push chunk to queue
    return chunk // return the new chunk
  }

  update() {
    // if active
    if (this.generator) {
      // generate next step and get result from generator

      const result = this.generator.next()
      // if r is done remove active
      if (result.done) {
        this.generator = null
      }
      // if it's not active
    } else {
      // get last element in the queue
      const chunk = this.queue.pop()

      // if there's last element
      if (chunk) {
        // set generator to the rebuild
        this.generator = chunk.rebuild()
        // push chunk to new
        this.new.push(chunk)
      }
    }

    if (this.generator || this.queue.length) {
      return
    }
    // if queue is empty and not generating anything
    // i assume this means 'everything is ready'

    // recycle the old chunks
    this.recycleChunks()
    // show new all chunks
    for (const chunk of this.new) {
      chunk.show()
    }
    // reset this
    this.reset()
  }

  pushOldChunks(recycle) {
    for (const { chunk } of recycle) {
      this.old.push(chunk)
    }
  }

  recycleChunks() {
    for (const chunk of this.old) {
      const w = chunk.width
      ensure(this.pool, w, [])
      // hide the chunk
      chunk.hide()
      // push into the pool
      this.pool[w].push(chunk)
    }
  }
}

function ensure(obj, prop, val) {
  if (!(prop in obj)) {
    obj[prop] = val
  }
}
