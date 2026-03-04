import { Transform, TransformCallback } from 'node:stream'
import { StringDecoder } from 'node:string_decoder'

/**
 * Options for LineStream constructor.
 */
export interface LineStreamOptions {
    encoding?: BufferEncoding
    objectMode?: boolean
}

/**
 * A Transform stream that splits input data into lines based on end-of-line characters.
 * Supports both Unix (\n) and Windows (\r\n) line endings.
 */
export class LineStream extends Transform {
    /**
     * Regular expression to match end-of-line characters (\n or \r\n).
     */
    readonly eol = /\r?\n/

    /**
     * Accumulator for storing partial lines between chunks.
     */
    protected acc: string = ''

    /**
     * String decoder to handle multi-byte characters in the input stream.
     */
    protected decoder: StringDecoder

    /**
     * Processes a chunk of data from the input stream.
     * Splits the chunk into lines and pushes each line to the output stream.
     *
     * @param chunk - The chunk of data to process.
     * @param encoding - The encoding of the chunk.
     * @param callback - Callback to signal that processing is complete.
     */
    _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback) {
        const str = this.acc + this.decoder.write(chunk)
        const lines = str.split(this.eol)
        if (lines.length === 0) {
            return callback()
        }
        this.acc = lines.pop() || ''
        for (const line of lines) {
            this.push(line)
        }
        callback()
    }

    /**
     * Flushes any remaining data in the accumulator to the output stream.
     * Called when the input stream ends.
     *
     * @param callback - Callback to signal that flushing is complete.
     */
    _flush(callback: TransformCallback) {
        const remaining = this.decoder.end()
        if (this.acc || remaining) {
            this.push(this.acc + remaining)
        }
        callback()
    }

    /**
     * Constructs a new LineStream instance.
     *
     * @param options - LineStreamOptions object. encoding: BufferEncoding (default 'utf8'), objectMode: boolean (default true)
     */
    constructor(options: LineStreamOptions = {}) {
        super({ objectMode: options.objectMode !== false })
        this.decoder = new StringDecoder(options.encoding || 'utf8')
    }
}
