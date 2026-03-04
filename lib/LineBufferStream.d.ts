import { Transform, TransformCallback } from 'stream';
export declare class LineBufferStream extends Transform {
    readonly eol: RegExp;
    protected acc: any;
    protected i: number;
    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void;
    _flush(callback: TransformCallback): void;
    constructor();
}
