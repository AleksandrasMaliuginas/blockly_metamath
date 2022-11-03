import MetamathSet from "../MetamathSet";
import { MM, MMToken } from "../MMToken";
import SymbolsDB from "../SymbolsDB";

export class MMEssentialHypo extends MMToken {
  
  parse(fileStr, idx) {
    const end = fileStr.indexOf('$.', idx);
    
    let params = fileStr.slice(idx, end - 1).split(' ');
    this.label = params[0];
    this.params = params.slice(2);

    return end + 2;
  }

  create() {
    return new MMEssentialHypo({
      key: this.label,
      type: MM.EssentialHypo,
      value: this.params.map(el => SymbolsDB.getSymbol(el)),
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

  

  // _toolboxFlyoutCallback(workspace) {
  //   const blockList = [];

  //   const tokens = MetamathSet.getTokensByType(MM.EssentialHypo);
  //   const variables = workspace.getAllVariables();

  //   for (const token of tokens) {
  //     const blockSequence = MMEssentialHypoHelper.getBlockSequence(token.params, variables);

  //     blockList.push({
  //       'kind': 'block',
  //       'type': MM.EssentialHypo,
  //       'inputs': {
  //         'DEF': blockSequence,
  //       }
  //     });
  //   }

  //   return blockList;
  // }
}

// export const MMEssentialHypoHelper = {
//   getBlockSequence(tokenParams, variables, idx = 0) {
//     // const variable = variables.find(v => v.name === tokenParams[idx]);
//     const element = variables[ tokenParams[idx] ];
//     const fieldName = element.type === MM.Constant ? 'CONST' : 'VAR';
    
//     const blockSequence = {
//       "block": {
//         "type": element.type,
//         "fields": {},
//         "inputs": {},
//       }
//     };
//     blockSequence.block.fields[fieldName] = element.value;

//     if (idx < tokenParams.length - 1) {
//       blockSequence.block.inputs = {
//         "NEXT": this.getBlockSequence(tokenParams, variables, idx + 1)
//       }
//     }

//     return blockSequence;
//   },
// }