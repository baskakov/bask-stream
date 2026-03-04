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
exports.LineBufferStream = void 0
var stream_1 = require('stream')
var LineBufferStream = /** @class */ (function (_super) {
    __extends(LineBufferStream, _super)
    function LineBufferStream() {
        var _this = _super.call(this) || this
        _this.eol = /\r?\n/
        _this.acc = Buffer.alloc(0)
        _this.i = 0
        return _this
    }
    LineBufferStream.prototype._transform = function (chunk, encoding, callback) {
        var lastIndex = chunk.lastIndexOf(10)
        var tillIndex = lastIndex
        if (tillIndex > 0 && chunk[tillIndex - 1] === 13) tillIndex -= 1
        if (tillIndex > 0 && this.acc.length > 0) {
            var toSend = Buffer.concat([this.acc, chunk.subarray(0, tillIndex)])
            this.push(toSend)
        }
        this.acc = chunk.subarray(lastIndex + 1, chunk.length)
        callback()
    }
    LineBufferStream.prototype._flush = function (callback) {
        if (this.acc) {
            this.push(this.acc)
        }
        callback()
    }
    return LineBufferStream
})(stream_1.Transform)
exports.LineBufferStream = LineBufferStream
