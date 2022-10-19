import { MM } from "./MMBlock";
import { MMToken } from "./MMToken";


export class MMVariable extends MMToken {
  
  parse(fileStr, idx) {
    const end = fileStr.indexOf('$.', idx);
    this.params = fileStr.slice(idx + 3, end - 1).split(' ');

    return end + 2;
  }

  createBlocks(workspace) {
    for (const varName of this.params) {
      workspace.createVariable(varName, MM.Variable);
    }

    workspace.registerToolboxCategoryCallback('MM_VARIABLES', this._toolboxFlyoutCallback);
  }

  _toolboxFlyoutCallback(workspace) {
    const blockList = [];
    const variables = workspace.getVariablesOfType(MM.Variable);
    for (const variable of variables) {
      blockList.push({
        'kind': 'block',
        'type': MM.Variable,
        'fields': {
          'VAR': variable
        }
      });
    }

    return blockList;
  }
}