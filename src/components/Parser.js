import { ComponentBuilder } from './ComponentBuilder'

export class Parser {
  constructor(fileString) {
    this.fileStr = fileString;
    this.tokens = [];
    this.fLength = this.fileStr.length;
  }

  parse(idx = 0) {
    if (this._isWhiteSpace(this.fileStr[idx])) {
      return this.parse(idx + 1);
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

    return this.parse(idx);
  }

  _isWhiteSpace(s) {
    return /\s/.test(s);
  }

  getParsedTokens() {
    return this.tokens;
  }
}

/**
 * TODO:
 * file inclusion $[ ... $]
 * 
 */