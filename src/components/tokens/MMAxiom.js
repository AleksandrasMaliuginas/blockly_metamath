import SymbolsDB from "../SymbolsDB";
import { MM, MMToken } from "../MMToken";


export class MMAxiom extends MMToken {

  parse(fileStr, idx) {
    const end = fileStr.indexOf('$.', idx);

    let params = fileStr.slice(idx, end - 1).split(' ');
    this.label = params[0];
    this.params = params.slice(2);

    return end + 2;
  }

  create() {
    return new MMAxiom({
      key: this.label,
      type: MM.Axiom,
      value: this.params.map(el => SymbolsDB.getSymbol(el)),
    });
  }

  getBlock() {
    return {
      'kind': 'block',
      'type': MM.Axiom,
      'inputs': {
        'DEF': this._getInnerBlocks()
      }
    };
  }

  _getInnerBlocks(depth= 0) {
    const currentBlock = {
      "block": this.value[depth].getBlock()
    };
    
    if (depth < this.value.length - 1) {
      currentBlock.block.inputs = {
        "NEXT": this._getInnerBlocks(depth + 1)
      }
    }
    
    return currentBlock;
  }

  static _toolboxFlyoutCallback(workspace) {
    const blockList = [];
    const axioms = SymbolsDB.getSymbolsByType(MM.Axiom);

    for (const axiom of axioms) {
      blockList.push(
        axiom.getBlock()
      );
    }

    return blockList;
  }
}