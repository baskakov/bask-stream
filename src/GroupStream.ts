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
        if (this.acc) this.push(this.acc)
        this.end()
        this.destroy()
        callback()
    }
}
