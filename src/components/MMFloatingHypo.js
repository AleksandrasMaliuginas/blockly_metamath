import MetamathSet from "./MetamathSet";
import { MMToken } from "./MMToken";

export class MMFloatingHypo extends MMToken {

  parse(fileStr, idx) {
    const end = fileStr.indexOf('$.', idx);

    let params = fileStr.slice(idx, end).split(' ');

    this.label = params[0];
    this.constant = params[2];
    this.variable = params[3];

    return end + 2;
  }

  createBlocks(workspace) {
    workspace.registerToolboxCategoryCallback('MM_FLOATING_HYPO', this._toolboxFlyoutCallback);
  }

  _toolboxFlyoutCallback(workspace) {
    const blockList = [];

    const tokens = MetamathSet.getTokensByType('MMFloatingHypo');
    const constants = workspace.getVariablesOfType('constant');
    const variables = workspace.getVariablesOfType('variable');

    for (const token of tokens) {
      blockList.push({
        'kind': 'block',
        'type': 'mm_floating_hypo',
        'fields': {
          'CONST': constants.find(c => c.name === token.constant),
          'VAR': variables.find(v => v.name === token.variable),
        }
      });
    }

    return blockList;
  }
}