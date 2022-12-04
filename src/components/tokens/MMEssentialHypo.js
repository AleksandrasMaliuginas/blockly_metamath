
import { MM, MMToken } from "../MMToken";
import { TokenManager } from "../TokenManager";

export class MMEssentialHypo extends MMToken {
  
  parse(fileStr, startIdx) {
    const endIdx = fileStr.indexOf('$.', startIdx);
    
    let params = fileStr.slice(startIdx, endIdx - 1).split(' ');
    this.label = params[0];
    this.params = params.slice(2);

    return endIdx + 2;
  }

  create() {
    return new MMEssentialHypo({
      key: this.label,
      type: MM.EssentialHypo,
      value: this.params.map(el => TokenManager.getToken(el)),
    });
  }

  getBlock() {
    return {
      'kind': 'block',
      'type': MM.EssentialHypo,
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
}
