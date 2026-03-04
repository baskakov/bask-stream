import { Transform, TransformCallback } from 'node:stream';
export declare class BatchStream extends Transform {
    protected acc: string[];
    _transform(chunk: string, encoding: BufferEncoding, callback: TransformCallback): void;
    _flush(callback: TransformCallback): void;
    constructor();
}
