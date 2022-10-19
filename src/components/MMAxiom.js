import MetamathSet from "./MetamathSet";
import { MM } from "./MMBlock";
import { MMToken } from "./MMToken";


export class MMAxiom extends MMToken {

  parse(fileStr, idx) {
    const end = fileStr.indexOf('$.', idx);

    let params = fileStr.slice(idx, end - 1).split(' ');
    this.label = params[0];
    this.params = params.slice(2);

    return end + 2;
  }

  createBlocks(workspace) {
    workspace.registerToolboxCategoryCallback('MM_AXIOMS', this._toolboxFlyoutCallback);
  }

  _toolboxFlyoutCallback(workspace) {
    const blockList = [];

    const tokens = MetamathSet.getTokensByType(MM.Axiom);
    const variables = workspace.getAllVariables();

    for (const token of tokens) {
      const blockSequence = MMAxiomHelper.getBlockSequence(token.params, variables);

      blockList.push({
        'kind': 'block',
        'type': MM.Axiom,
        'inputs': {
          'DEF': blockSequence,
        }
      });
    }

    return blockList;
  }
}

export const MMAxiomHelper = {
  getBlockSequence(tokenParams, variables, idx = 0) {
    const variable = variables.find(v => v.name === tokenParams[idx]);
    const fieldName = variable.type === MM.Constant ? 'CONST' : 'VAR';

    const blockSequence = {
      "block": {
        "type": variable.type,
        "fields": {},
        "inputs": {},
      }
    };
    blockSequence.block.fields[fieldName] = variables.find(v => v.name === tokenParams[idx])

    if (idx < tokenParams.length - 1) {
      blockSequence.block.inputs = {
        "NEXT": this.getBlockSequence(tokenParams, variables, idx + 1)
      }
    }

    return blockSequence;
  },
}