import { LineStream, LineStreamOptions } from '../LineStream'
import { Readable } from 'stream'

describe('LineStream', () => {
    it('splits input into lines with unix newlines', (done) => {
        const input = 'line1\nline2\nline3\n'
        const readable = Readable.from([input])
        const lineStream = new LineStream()
        const result: string[] = []
        lineStream.on('data', (line) => result.push(line))
        lineStream.on('end', () => {
            expect(result).toEqual(['line1', 'line2', 'line3'])
            done()
        })
        readable.pipe(lineStream)
    })

    it('splits input into lines with windows newlines', (done) => {
        const input = 'line1\r\nline2\r\nline3\r\n'
        const readable = Readable.from([input])
        const lineStream = new LineStream()
        const result: string[] = []
        lineStream.on('data', (line) => result.push(line))
        lineStream.on('end', () => {
            expect(result).toEqual(['line1', 'line2', 'line3'])
            done()
        })
        readable.pipe(lineStream)
    })

    it('handles input with no trailing newline', (done) => {
        const input = 'line1\nline2\nline3'
        const readable = Readable.from([input])
        const lineStream = new LineStream()
        const result: string[] = []
        lineStream.on('data', (line) => result.push(line))
        lineStream.on('end', () => {
            expect(result).toEqual(['line1', 'line2', 'line3'])
            done()
        })
        readable.pipe(lineStream)
    })

    it('handles empty input', (done) => {
        const input = ''
        const readable = Readable.from([input])
        const lineStream = new LineStream()
        const result: string[] = []
        lineStream.on('data', (line) => result.push(line))
        lineStream.on('end', () => {
            expect(result).toEqual([])
            done()
        })
        readable.pipe(lineStream)
    })

    it('handles chunked input with lines split across chunks', (done) => {
        const chunks = ['line1\nline', '2\nline3\n', 'line4']
        const readable = Readable.from(chunks)
        const lineStream = new LineStream()
        const result: string[] = []
        lineStream.on('data', (line) => result.push(line))
        lineStream.on('end', () => {
            expect(result).toEqual(['line1', 'line2', 'line3', 'line4'])
            done()
        })
        readable.pipe(lineStream)
    })
})
