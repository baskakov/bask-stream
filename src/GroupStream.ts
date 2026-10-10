import { Duplex, DuplexOptions } from 'stream'

export interface GroupStreamOptions<K = any, A = any[]> extends DuplexOptions {
    createAcc: () => A
    reducer: (acc: A, item: K) => A
    isFull: (acc: A) => boolean
}

export class GroupStream<K = any, A = any[]> extends Duplex {
    readonly createAcc: () => A
    readonly reducer: (acc: A, item: K) => A
    readonly isFull: (acc: A) => boolean
    private acc: A | null = null

    constructor(options: GroupStreamOptions<K, A>) {
        options = options ?? {}
        options.objectMode = true

        super(options)

        this.createAcc = options.createAcc
        this.reducer = options.reducer
        this.isFull = options.isFull
    }

    _read(size: number) {
        return undefined
    }

    _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
        if (!this.acc) this.acc = this.createAcc()
        this.acc = this.reducer(this.acc, chunk)
        if (this.isFull(this.acc)) {
            this.push(this.acc)
            this.acc = null
        }
        process.nextTick(() => {
            callback()
        })
    }

    _final(callback: (error?: Error | null) => void): void {
        if (this.acc) {
            this.push(this.acc)
            this.acc = null
        }
        // End the readable side cleanly so consumers receive the last batch and
        // a proper 'end' event. Destroying here instead dropped the final batch
        // and raised ERR_STREAM_PREMATURE_CLOSE for pipe/async-iterator readers.
        this.push(null)
        callback()
    }
}
