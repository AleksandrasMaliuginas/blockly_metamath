import MetamathSet from "../MetamathSet";
import { MM, MMToken } from "../MMToken";
import { Parser } from "../Parser";
import SymbolsDB from "../SymbolsDB";


export class MMBlock extends MMToken {
  
  parse(fileStr, idx) {
    this.innerParser = new Parser(fileStr);

    let end;
    [end, this.tokens] = this.innerParser.parse(idx + 2);

    if (fileStr[end + 1] == '}') {
      return end + 2;
    }

    return end;
  }

  create() {
    return new MMBlock({
      key: '$B',
      type: MM.Block,
      value: this.tokens.map(el => el.create()),
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

  // _getInnerBlocks(depth= 0) {
  //   const currentBlock = {
  //     "block": this.value[depth].getBlock()
  //   };
    
  //   if (depth < this.value.length - 1) {
  //     currentBlock.block = this._getInnerBlocks(depth + 1);
  //   }
    
  //   return currentBlock;
  // }

  static _toolboxFlyoutCallback(workspace) {
    let blockList = [];
    const blocks = SymbolsDB.getSymbolsByType(MM.Block);

    for (const block of blocks) {
      blockList.push(
        block.getBlock()
      );
    }

    return blockList;
  }
}