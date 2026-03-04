# BASK Stream

Extension of Node.js Streams to provide additional functionality

---

## GroupStream

`GroupStream<K, A>` is a flexible duplex stream for grouping incoming data into custom accumulators. You define how to accumulate, when to emit, and how to reset the accumulator.

**Constructor:**
```typescript
new GroupStream<K, A>(options: GroupStreamOptions<K, A>)
```
- `createAcc`: () => A — function to create a new accumulator
- `reducer`: (acc: A, item: K) => A — function to add an item to the accumulator
- `isFull`: (acc: A) => boolean — function to determine when to emit the accumulator

**Example:**
```typescript
import { GroupStream } from 'bask-stream'
const stream = new GroupStream<number, number[]>({
  createAcc: () => [],
  reducer: (acc, item) => [...acc, item],
  isFull: acc => acc.length === 3
})
```

**Behavior:**
- When `isFull(acc)` returns true, the accumulator is emitted and reset.
- Any remaining items are emitted when the stream ends.

---

## ArrayStream

`ArrayStream<K>` is a duplex stream that buffers incoming items into arrays of a specified size and emits each array as a chunk.

**Constructor:**
```typescript
new ArrayStream<K>(options: { size: number })
```
- `size`: number — the maximum number of items per emitted array (batch). If `size` is 0 or negative, all items are buffered and emitted as a single array when the stream ends.

**Example:**
```typescript
const arrayStream = new ArrayStream<number>({ size: 3 })
arrayStream.write(1)
arrayStream.write(2)
arrayStream.write(3)
// Emits: [1, 2, 3]
arrayStream.write(4)
arrayStream.end()
// Emits: [4] (remaining items on end)
```

**Behavior:**
- When the buffer reaches the specified `size`, it is emitted as an array.
- Any remaining items are emitted as an array when the stream ends.
- If `size` is 0 or negative, all items are emitted as a single array on stream end.

---

## LineStream

`LineStream` is a transform stream that splits incoming text data into lines, supporting both Unix (`\n`) and Windows (`\r\n`) line endings.

**Constructor:**
```typescript
new LineStream(options?: LineStreamOptions)
```
- `encoding`: BufferEncoding — optional, defaults to `'utf8'`
- `objectMode`: boolean — optional, defaults to `true`

**Example:**
```typescript
import { LineStream, LineStreamOptions } from 'bask-stream'
const lineStream = new LineStream({ encoding: 'utf8' })
readableFileStream.pipe(lineStream).on('data', line => {
  // Each 'line' is a string
})
```

**Behavior:**
- Emits each line as a separate chunk.
- Handles lines split across multiple chunks.
- Emits the last line on stream end, even if not newline-terminated.

---

## Installation & Usage

```sh
npm i bask-stream --save
```

```js
const { ArrayStream, GroupStream, LineStream } = require('bask-stream')
```

Or with TypeScript:
```typescript
import { ArrayStream, GroupStream, LineStream } from 'bask-stream'
```

---

## Example: Batch Processing a File

```typescript
import { createReadStream } from 'fs'
import { LineStream, ArrayStream } from 'bask-stream'

const fileStream = createReadStream('largefile.txt', { encoding: 'utf8' })
const lineStream = new LineStream({ encoding: 'utf8' })
const batchStream = new ArrayStream({ size: 1000 })

fileStream.pipe(lineStream).pipe(batchStream).on('data', (batch) => {
  // batch is an array of 1000 lines (or fewer for the last batch)
})
```
