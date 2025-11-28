import { Duplex, DuplexOptions } from 'stream';
export interface GroupStreamOptions<K = any, A = any[]> extends DuplexOptions {
    createAcc: () => A;
    reducer: (acc: A, item: K) => A;
    isFull: (acc: A) => boolean;
}
export declare class GroupStream<K = any, A = any[]> extends Duplex {
    readonly createAcc: () => A;
    readonly reducer: (acc: A, item: K) => A;
    readonly isFull: (acc: A) => boolean;
    private acc;
    constructor(options: GroupStreamOptions<K, A>);
    _read(size: number): undefined;
    _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void): void;
    _final(callback: (error?: Error | null) => void): void;
}
declare const _default: {
    GroupStream: typeof GroupStream;
};
export default _default;
