import { ComponentBuilder } from './ComponentBuilder'

export class Parser {
  constructor(fileString) {
    this.fileStr = fileString;
    this.tokens = [];
  }

  parse(idx = 0) {
    this.parseNext(idx);
    return this.tokens;
  }

  parseNext(idx = 0) {
    if (this._isWhiteSpace(this.fileStr[idx])) {
      return this.parseNext(idx + 1);
    }

    const dolerIdx = this.fileStr.indexOf('$', idx);
    const token = this.fileStr[dolerIdx + 1];

    const mmComponent = ComponentBuilder.build(token);
    if (!mmComponent ) {
      return [idx, this.tokens];
    }

    idx = mmComponent.parse(this.fileStr, idx);
    
    if (mmComponent.constructor.name != 'MMComment') {
      this.tokens.push(mmComponent);
    }

    return this.parseNext(idx);
  }

  _isWhiteSpace(s) {
    return /\s/.test(s);
  }
}

/**
 * TODO:
 * file inclusion $[ ... $]
 * pre Parse to remove comments
 */