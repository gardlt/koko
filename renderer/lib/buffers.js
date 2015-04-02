import Logs from './logs';

class Buf { // Buffer exists as a default class
  constructor(name) {
    this.name = name;
    this.logs = new Logs();
    this._current = false;
  }

  current(set) {
    if (typeof set === 'undefined') {
      return this._current;
    } else {
      this._current = set;
    }
  }
}

export default class Buffers {
  constructor(rootBufName) {
    let rootBuf = new Buf(rootBufName);
    rootBuf.current(true);
    this._buffers = [rootBuf];
  }

  send(to, nick, text) {
    let target = this.target(to);
    target.logs.say(nick, text);
  }

  join(channel, nick, message, isMe=false) {
    let target = this.target(channel);
    if (isMe) {
      this.setCurrent(channel);
    }
    target.logs.join(nick, message);
  }

  part(channel, nick, reason, message, isMe=false) {
    if (isMe) {
      let index = this.remove(channel);
      this.setCurrent(this._buffers[0].name);
    } else {
      let target = this.target(channel);
      target.logs.part(nick, reason, message);
    }
  }

  target(name) {
    let target = this._buffers.filter(c => (c.name === name))[0];
    if (!target) {
      target = new Buf(name);
      this._buffers.push(target);
    }

    return target;
  }

  remove(name) {
    this._buffers = this._buffers.filter(c => (c.name !== name));
  }

  setCurrent(bufName) {
    this._buffers = this._buffers.map(function (buffer) {
      if (buffer.name === bufName) {
        buffer.current(true);
      } else {
        buffer.current(false);
      }
      return buffer;
    });
  }

  current() {
    return this._buffers.filter(c => c.current())[0];
  }

  map(func) {
    return this._buffers.map(func);
  }
}