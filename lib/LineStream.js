'use strict'
var __extends =
    (this && this.__extends) ||
    (function () {
        var extendStatics = function (d, b) {
            extendStatics =
                Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array &&
                    function (d, b) {
                        d.__proto__ = b
                    }) ||
                function (d, b) {
                    for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]
                }
            return extendStatics(d, b)
        }
        return function (d, b) {
            if (typeof b !== 'function' && b !== null)
                throw new TypeError('Class extends value ' + String(b) + ' is not a constructor or null')
            extendStatics(d, b)
            function __() {
                this.constructor = d
            }
            d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __())
        }
    })()
Object.defineProperty(exports, '__esModule', { value: true })
exports.LineStream = void 0
var node_stream_1 = require('node:stream')
var node_string_decoder_1 = require('node:string_decoder')
/**
 * A Transform stream that splits input data into lines based on end-of-line characters.
 * Supports both Unix (\n) and Windows (\r\n) line endings.
 */
var LineStream = /** @class */ (function (_super) {
    __extends(LineStream, _super)
    /**
     * Constructs a new LineStream instance.
     *
     * @param options - LineStreamOptions object. encoding: BufferEncoding (default 'utf8'), objectMode: boolean (default true)
     */
    function LineStream(options) {
        if (options === void 0) {
            options = {}
        }
        var _this = _super.call(this, { objectMode: options.objectMode !== false }) || this
        /**
         * Regular expression to match end-of-line characters (\n or \r\n).
         */
        _this.eol = /\r?\n/
        /**
         * Accumulator for storing partial lines between chunks.
         */
        _this.acc = ''
        _this.decoder = new node_string_decoder_1.StringDecoder(options.encoding || 'utf8')
        return _this
    }
    /**
     * Processes a chunk of data from the input stream.
     * Splits the chunk into lines and pushes each line to the output stream.
     *
     * @param chunk - The chunk of data to process.
     * @param encoding - The encoding of the chunk.
     * @param callback - Callback to signal that processing is complete.
     */
    LineStream.prototype._transform = function (chunk, encoding, callback) {
        var str = this.acc + this.decoder.write(chunk)
        var lines = str.split(this.eol)
        if (lines.length === 0) {
            return callback()
        }
        this.acc = lines.pop() || ''
        for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
            var line = lines_1[_i]
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
    LineStream.prototype._flush = function (callback) {
        var remaining = this.decoder.end()
        if (this.acc || remaining) {
            this.push(this.acc + remaining)
        }
        callback()
    }
    return LineStream
})(node_stream_1.Transform)
exports.LineStream = LineStream
