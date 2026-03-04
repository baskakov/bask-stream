'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
var node_fs_1 = require('node:fs')
var LineStream_1 = require('./LineStream')
var stream_1 = require('stream')
var monitor = new stream_1.PassThrough({ objectMode: true })
monitor.on('data', function () {
    // console.log('X', Buffer.from(x).toString())
})
var monitor2 = new stream_1.PassThrough({ objectMode: true })
monitor2.on('data', function () {
    // console.log('Y', Buffer.from(x).toString())
})
var monitor3 = new stream_1.PassThrough({ objectMode: true })
var i = 0
monitor3.on('data', function () {
    // console.log('Z', x)
    i++
    // tslint:disable-next-line:no-console
    // console.log(i*1000+'')
})
// tslint:disable-next-line:no-console
// console.time('stream')
var reader = (0, node_fs_1.createReadStream)('file.txt', { encoding: 'utf8' })
var transformToLines = new LineStream_1.LineStream()
var stream = reader.pipe(transformToLines)
stream.on('finish', function () {
    // tslint:disable-next-line:no-console
    // console.timeEnd('stream')
})
var _maxMemoryConsumption = 0
process.nextTick(function () {
    var memUsage = process.memoryUsage()
    if (memUsage.rss > _maxMemoryConsumption) {
        _maxMemoryConsumption = memUsage.rss
    }
})
process.on('exit', function () {
    // tslint:disable-next-line:no-console
    // console.log(`Max memory consumption: ${Math.ceil(_maxMemoryConsumption/1024/1024)} Mb`)
})
