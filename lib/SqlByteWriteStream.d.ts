import { Writable } from 'node:stream';
import * as mysql from 'mysql2';
export declare class SqlByteWriteStream extends Writable {
    protected connection: mysql.Connection;
    readonly sql = "INSERT INTO test2 (value) VALUES ?";
    constructor();
    _construct?(callback: (error?: Error | null) => void): void;
    _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void): void;
    _destroy(error: Error | null, callback: (error?: Error | null) => void): void;
}
