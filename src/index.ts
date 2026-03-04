import { createReadStream } from 'node:fs'
import { LineStream } from './LineStream'

import { PassThrough } from 'stream'

const monitor = new PassThrough({ objectMode: true })
monitor.on('data', () => {
    // console.log('X', Buffer.from(x).toString())
})

const monitor2 = new PassThrough({ objectMode: true })
monitor2.on('data', () => {
    // console.log('Y', Buffer.from(x).toString())
})

const monitor3 = new PassThrough({ objectMode: true })
let i = 0
monitor3.on('data', () => {
    // console.log('Z', x)
    i++
    // tslint:disable-next-line:no-console
    // console.log(i*1000+'')
})
// tslint:disable-next-line:no-console
// console.time('stream')

const reader = createReadStream('file.txt', { encoding: 'utf8' })
const transformToLines = new LineStream()
const stream = reader.pipe(transformToLines)

stream.on('finish', () => {
    // tslint:disable-next-line:no-console
    // console.timeEnd('stream')
})

let _maxMemoryConsumption = 0

process.nextTick(() => {
    const memUsage = process.memoryUsage()
    if (memUsage.rss > _maxMemoryConsumption) {
        _maxMemoryConsumption = memUsage.rss
    }
})

process.on('exit', () => {
    // tslint:disable-next-line:no-console
    // console.log(`Max memory consumption: ${Math.ceil(_maxMemoryConsumption/1024/1024)} Mb`)
})
