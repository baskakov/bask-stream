# BASK Stream

Extension of Node.js Streams to provide additional functionality

## Array Stream

Duplex stream, that groups (buffers) incoming data into groups with specific size.

*Use-case: read extra-large files (100k+ lines) and write into database in chunks (batches) for example in 1k records.*

```sh
npm i bask-stream --save
```

Then import module in code:

```js
const { ArrayStream } = require('bask-stream');

const arrayStream = new ArrayStream({ size: 1000 });
```

Or
```js
import { ArrayStream } from 'bask-stream';

const arrayStream = new ArrayStream({ size: 1000 });
```

Then
```
readableFileStream.pipe(arrayStream).pipe(writeDbStream);
```
