import { GroupStream, GroupStreamOptions } from './GroupStream';
import { DuplexOptions } from 'stream';

export interface ArrayStreamOptions<K = any> extends DuplexOptions {
    size: number;
}

export class ArrayStream<K = any> extends GroupStream<K, K[]> {
    readonly size: number;

    constructor(options: ArrayStreamOptions<K>) {
        options.size = options.size || 10;
        const createAcc = () => [];
        const isFull = (array: K[]) => options.size > 0 && array.length >= options.size;
        const reducer = (acc: K[], item: K) => {
            acc.push(item);
            return acc;
        };

        super({ ...options, createAcc, isFull, reducer });

        this.size = options.size;
    }
}
