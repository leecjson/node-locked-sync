'use strict';

module.exports = function () {
  const _dict = new Map();
  let __lock;
  const _release = (lock, end) => lock.next ? lock.next() : end();
  const __reptr = lock => __lock = lock;
  const __end = () => __lock = undefined;
  return key => {
    let _lock, _reptr, _end;
    if (typeof key == 'undefined') {
      _lock = __lock;
      _reptr = __reptr;
      _end = __end;
    } else {
      _lock = _dict.get(key);
      _reptr = lock => _dict.set(key, lock);
      _end = () => _dict.delete(key);
    }
    if (_lock) {
      return new Promise(resolve => {
        const lock = Object.create(null);
        _lock.next = () => resolve(_release.bind(undefined, lock, _end));
        _reptr(lock);
      });
    } else {
      const lock = Object.create(null);
      _reptr(lock);
      return Promise.resolve(
        _release.bind(undefined, lock, _end));
    }
  }
}