import { GroupStream } from './GroupStream';
export declare class LineStream extends GroupStream<any, string> {
    createAcc(): string;
    isFull(str: string): boolean;
    reducer(acc: string, chunk: any): string;
    acc: string;
    constructor();
}
