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
exports.SqlByteWriteStream = void 0
var node_stream_1 = require('node:stream')
var mysql = require('mysql2')
var SqlByteWriteStream = /** @class */ (function (_super) {
    __extends(SqlByteWriteStream, _super)
    function SqlByteWriteStream() {
        var _this = _super.call(this, { objectMode: true }) || this
        _this.sql = 'INSERT INTO test2 (value) VALUES ?'
        _this.connection = mysql.createConnection({
            host: '192.168.50.33',
            user: 'root',
            password: '1234',
            database: 'test',
        })
        return _this
    }
    SqlByteWriteStream.prototype._construct = function (callback) {
        this.connection.connect(function (err) {
            if (err) callback(err)
            else callback()
        })
    }
    SqlByteWriteStream.prototype._write = function (chunk, encoding, callback) {
        var lines = Buffer.from(chunk).toString().split(/\r?\n/)
        var values = lines.map(function (x) {
            return [x]
        })
        this.connection.query(this.sql, [values], function (err, result) {
            if (err) callback(err)
            else callback()
        })
    }
    SqlByteWriteStream.prototype._destroy = function (error, callback) {
        this.connection.end()
    }
    return SqlByteWriteStream
})(node_stream_1.Writable)
exports.SqlByteWriteStream = SqlByteWriteStream
