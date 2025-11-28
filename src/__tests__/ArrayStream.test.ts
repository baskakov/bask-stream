import { ArrayStream } from '../ArrayStream';

function waitFinish() {
    return new Promise(process.nextTick);
}

describe('ArrayStream', () => {
    it('process size 1', async () => {
        const result: number[] = [];
        const stream = new ArrayStream<number>({ size: 1 });
        let isFinished = false;
        stream.on('data', (data) => {
            result.push(data);
        });
        stream.on('close', () => {
            isFinished = true;
        });

        stream.write(1);
        await waitFinish();
        expect(result).toStrictEqual([[1]]);
        stream.write(2);
        await waitFinish();
        expect(result).toStrictEqual([[1], [2]]);
        stream.write(3);
        await waitFinish();
        expect(result).toStrictEqual([[1], [2], [3]]);
        expect(isFinished).toBe(false);
        stream.write(4);
        await waitFinish();
        expect(result).toStrictEqual([[1], [2], [3], [4]]);
        stream.end();
        await waitFinish();
        expect(isFinished).toBe(true);
    });

    it('process size 2', async () => {
        const result: number[] = [];
        const stream = new ArrayStream<number>({ size: 2 });
        let isFinished = false;
        stream.on('data', (data) => {
            result.push(data);
        });
        stream.on('close', () => {
            isFinished = true;
        });

        stream.write(1);
        await waitFinish();
        expect(result).toStrictEqual([]);
        stream.write(2);
        await waitFinish();
        expect(result).toStrictEqual([[1, 2]]);
        stream.write(3);
        await waitFinish();
        expect(result).toStrictEqual([[1, 2]]);
        expect(isFinished).toBe(false);
        stream.write(4);
        await waitFinish();
        expect(result).toStrictEqual([
            [1, 2],
            [3, 4],
        ]);
        stream.end();
        await waitFinish();
        expect(isFinished).toBe(true);
    });

    it('process size 0', async () => {
        const result: number[] = [];
        const stream = new ArrayStream<number>({ size: 0 });

        let isFinished = false;

        stream.on('data', (data) => {
            result.push(data);
        });

        stream.on('close', () => {
            isFinished = true;
        });

        stream.write(1);
        await waitFinish();
        expect(result).toStrictEqual([]);
        stream.write(2);
        await waitFinish();
        expect(result).toStrictEqual([]);
        stream.write(3);
        await waitFinish();
        expect(result).toStrictEqual([]);
        expect(isFinished).toBe(false);
        stream.write(4);
        await waitFinish();
        expect(result).toStrictEqual([]);
        stream.end();
        await waitFinish();
        expect(result).toStrictEqual([[1, 2, 3, 4]]);
        expect(isFinished).toBe(true);
    });
});
