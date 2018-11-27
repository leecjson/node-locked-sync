# Usage
```shell
npm install --save locked-sync
```

Synchronize and serialize a piece of code.

Why do you need this in javascript or Node.js.
Consider the following code

```javascript
redis.get('key', function(err, value) {
  redis.set('key', value + 1);
});
```

If two users run concurrency, the execution order may like this
```text
user1: var val = redis.get('key');  => 1
user2: var val = redis.get('key');  => 1
user1: redis.set('key', val + 1) => 2
user2: redis.set('key', val + 1) => 2
```

So, you can use locked-sync to avoid it.
```javascript
const lockedSync = require('locked-sync');
const sync = lockedSync();

function getAndSet() {
  sync().then(end => {
    redis.get('key', (val, err) => {
      redis.set('key', val + 1);
      end();
    });
  });
}

getAndSet(); getAndSet(); getAndSet(); getAndSet(); // almost same time to get and set
```

```javascript
const lockedSync = require('locked-sync');
const sync = lockedSync();

async function getAndSet() {
  const end = await sync();
  try {
    const val = await redis.get('key');
    await redis.set('key', val + 1);
  } finally {
    end(); // Always put it in finally block.
  }
}

getAndSet(); getAndSet(); getAndSet(); getAndSet();
```