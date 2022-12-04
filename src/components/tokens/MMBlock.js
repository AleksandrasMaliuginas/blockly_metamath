import { MM, MMToken } from "../MMToken";
import { Parser } from "../Parser";
import {TokenManager} from "../TokenManager";


export class MMBlock extends MMToken {
  
  parse(fileStr, startIdx) {
    this.innerParser = new Parser(fileStr);

    let endIdx;
    [endIdx, this.tokens] = this.innerParser.parseNext(startIdx + 2);

    if (fileStr[endIdx + 1] == '}') {
      return endIdx + 2;
    }

    return endIdx;
  }

  register() {
    return new MMBlock({
      key: '$B',
      type: MM.Block,
      value: this.tokens.map(el => el.register()),
    });
  }

  getBlock() {
    return {
      'kind': 'block',
      'type': MM.Block,
      'inputs': {
        'DEF': {
          //                  add only last statement
          'block': this.value[this.value.length - 1].getBlock()
        } // this._getInnerBlocks()
      }
    };
  }

  static _toolboxFlyoutCallback(workspace) {
    let blockList = [];
    const blocks = TokenManager.getTokensByType(MM.Block);

    for (const block of blocks) {
      blockList.push(
        block.getBlock()
      );
    }

    return blockList;
  }
}