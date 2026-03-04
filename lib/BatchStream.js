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
exports.BatchStream = void 0
var node_stream_1 = require('node:stream')
var BatchStream = /** @class */ (function (_super) {
    __extends(BatchStream, _super)
    function BatchStream() {
        var _this = _super.call(this, { objectMode: true }) || this
        _this.acc = []
        return _this
    }
    BatchStream.prototype._transform = function (chunk, encoding, callback) {
        this.acc.push(chunk)
        if (this.acc.length === 10000) {
            this.push(this.acc)
            this.acc = []
        }
        callback()
    }
    BatchStream.prototype._flush = function (callback) {
        if (this.acc.length > 0) {
            this.push(this.acc)
        }
        callback()
    }
    return BatchStream
})(node_stream_1.Transform)
exports.BatchStream = BatchStream
