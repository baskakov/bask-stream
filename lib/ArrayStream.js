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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrayStream = void 0;
var GroupStream_1 = require("./GroupStream");
var ArrayStream = /** @class */ (function (_super) {
    __extends(ArrayStream, _super);
    function ArrayStream(options) {
        var _this = this;
        options.size = options.size || 10;
        var createAcc = function () { return []; };
        var isFull = function (array) { return options.size > 0 && array.length >= options.size; };
        var reducer = function (acc, item) {
            acc.push(item);
            return acc;
        };
        _this = _super.call(this, __assign(__assign({}, options), { createAcc: createAcc, isFull: isFull, reducer: reducer })) || this;
        _this.size = options.size;
        return _this;
    }
    return ArrayStream;
}(GroupStream_1.GroupStream));
exports.ArrayStream = ArrayStream;
