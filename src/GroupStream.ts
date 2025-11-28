import { ArrayOptions, Duplex, DuplexOptions, ReadableOptions, WritableOptions } from 'stream';

export interface GroupStreamOptions<K = any, A = any[]> extends DuplexOptions {
    createAcc: () => A;
    reducer: (acc: A, item: K) => A;
    isFull: (acc: A) => boolean;
}

export class GroupStream<K = any, A = any[]> extends Duplex {
    readonly createAcc: () => A;
    readonly reducer: (acc: A, item: K) => A;
    readonly isFull: (acc: A) => boolean;
    private acc: A;

    constructor(options: GroupStreamOptions<K, A>) {
        options = options ?? {};
        options.objectMode = true;

        super(options);

        this.createAcc = options.createAcc;
        this.reducer = options.reducer;
        this.isFull = options.isFull;
        this.acc = this.createAcc();
    }

    _read(size: number) {
        return undefined;
    }

    _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
        this.acc = this.reducer(this.acc, chunk);
        if (this.isFull(this.acc)) {
            this.push(this.acc);
            this.acc = this.createAcc();
        }
        process.nextTick(() => {
            callback();
        });
    }

    _final(callback: (error?: Error | null) => void): void {
        this.push(this.acc);
        this.end();
        this.destroy();
        callback();
    }
}

export default {
    GroupStream,
};
