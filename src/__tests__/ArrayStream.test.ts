import { ArrayStream } from '../ArrayStream'

function waitFinish() {
    return new Promise(process.nextTick)
}

describe('ArrayStream', () => {
    it('process size 1', async () => {
        const result: number[][] = []
        const stream = new ArrayStream<number>({ size: 1 })
        let isFinished = false
        stream.on('data', (data: number[]) => {
            result.push(data)
        })
        stream.on('close', () => {
            isFinished = true
        })

        stream.write(1)
        await waitFinish()
        expect(result).toStrictEqual([[1]])
        stream.write(2)
        await waitFinish()
        expect(result).toStrictEqual([[1], [2]])
        stream.write(3)
        await waitFinish()
        expect(result).toStrictEqual([[1], [2], [3]])
        expect(isFinished).toBe(false)
        stream.write(4)
        await waitFinish()
        expect(result).toStrictEqual([[1], [2], [3], [4]])
        stream.end()
        await waitFinish()
        expect(isFinished).toBe(true)
    })

    it('process size 2', async () => {
        const result: number[][] = []
        const stream = new ArrayStream<number>({ size: 2 })
        let isFinished = false
        stream.on('data', (data: number[]) => {
            result.push(data)
        })
        stream.on('close', () => {
            isFinished = true
        })

        stream.write(1)
        await waitFinish()
        expect(result).toStrictEqual([])
        stream.write(2)
        await waitFinish()
        expect(result).toStrictEqual([[1, 2]])
        stream.write(3)
        await waitFinish()
        expect(result).toStrictEqual([[1, 2]])
        expect(isFinished).toBe(false)
        stream.write(4)
        await waitFinish()
        expect(result).toStrictEqual([
            [1, 2],
            [3, 4],
        ])
        stream.end()
        await waitFinish()
        expect(isFinished).toBe(true)
    })

    it('process size 0', async () => {
        const result: number[][] = []
        const stream = new ArrayStream<number>({ size: 0 })

        let isFinished = false

        stream.on('data', (data: number[]) => {
            result.push(data)
        })

        stream.on('close', () => {
            isFinished = true
        })

        stream.write(1)
        await waitFinish()
        expect(result).toStrictEqual([])
        stream.write(2)
        await waitFinish()
        expect(result).toStrictEqual([])
        stream.write(3)
        await waitFinish()
        expect(result).toStrictEqual([])
        expect(isFinished).toBe(false)
        stream.write(4)
        await waitFinish()
        expect(result).toStrictEqual([])
        stream.end()
        await waitFinish()
        expect(result).toStrictEqual([[1, 2, 3, 4]])
        expect(isFinished).toBe(true)
    })

    it('does not emit for empty input and size > 0', async () => {
        const result: number[][] = []
        const stream = new ArrayStream<number>({ size: 3 })
        let isFinished = false
        stream.on('data', (data: number[]) => {
            result.push(data)
        })
        stream.on('close', () => {
            isFinished = true
        })
        stream.end()
        await waitFinish()
        expect(result).toStrictEqual([])
        expect(isFinished).toBe(true)
    })

    it('emits remaining items on end if not full', async () => {
        const result: number[][] = []
        const stream = new ArrayStream<number>({ size: 3 })
        let isFinished = false
        stream.on('data', (data: number[]) => {
            result.push(data)
        })
        stream.on('close', () => {
            isFinished = true
        })
        stream.write(1)
        stream.write(2)
        await waitFinish()
        expect(result).toStrictEqual([])
        stream.end()
        await waitFinish()
        expect(result).toStrictEqual([[1, 2]])
        expect(isFinished).toBe(true)
    })

    it('delivers every batch (incl. a partial last one) via async iteration', async () => {
        const stream = new ArrayStream<number>({ size: 2 })
        for (const n of [1, 2, 3, 4, 5]) stream.write(n)
        stream.end()

        const batches: number[][] = []
        // Previously this threw ERR_STREAM_PREMATURE_CLOSE and dropped [5].
        for await (const batch of stream as AsyncIterable<number[]>) {
            batches.push(batch)
        }
        expect(batches).toStrictEqual([[1, 2], [3, 4], [5]])
    })

    it('handles negative size as never full, emits all on end', async () => {
        const result: number[][] = []
        const stream = new ArrayStream<number>({ size: -1 })
        let isFinished = false
        stream.on('data', (data: number[]) => {
            result.push(data)
        })
        stream.on('close', () => {
            isFinished = true
        })
        stream.write(1)
        stream.write(2)
        stream.write(3)
        await waitFinish()
        expect(result).toStrictEqual([])
        stream.end()
        await waitFinish()
        expect(result).toStrictEqual([[1, 2, 3]])
        expect(isFinished).toBe(true)
    })
})
