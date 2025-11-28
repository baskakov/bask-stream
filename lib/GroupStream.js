"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupStream = void 0;
var stream_1 = require("stream");
var GroupStream = /** @class */ (function (_super) {
    __extends(GroupStream, _super);
    function GroupStream(options) {
        var _this = this;
        options = options !== null && options !== void 0 ? options : {};
        options.objectMode = true;
        _this = _super.call(this, options) || this;
        _this.createAcc = options.createAcc;
        _this.reducer = options.reducer;
        _this.isFull = options.isFull;
        _this.acc = _this.createAcc();
        return _this;
    }
    GroupStream.prototype._read = function (size) {
        return undefined;
    };
    GroupStream.prototype._write = function (chunk, encoding, callback) {
        this.acc = this.reducer(this.acc, chunk);
        if (this.isFull(this.acc)) {
            this.push(this.acc);
            this.acc = this.createAcc();
        }
        process.nextTick(function () {
            callback();
        });
    };
    GroupStream.prototype._final = function (callback) {
        this.push(this.acc);
        this.end();
        this.destroy();
        callback();
    };
    return GroupStream;
}(stream_1.Duplex));
exports.GroupStream = GroupStream;
exports.default = {
    GroupStream: GroupStream,
};
