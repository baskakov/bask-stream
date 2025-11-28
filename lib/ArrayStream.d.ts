import { GroupStream } from './GroupStream';
import { DuplexOptions } from 'stream';
export interface ArrayStreamOptions<K = any> extends DuplexOptions {
    size: number;
}
export declare class ArrayStream<K = any> extends GroupStream<K, K[]> {
    readonly size: number;
    constructor(options: ArrayStreamOptions<K>);
}
