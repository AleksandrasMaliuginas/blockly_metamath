import { MM } from "./MMBlock";
import { MMToken } from "./MMToken";


export class MMConstant extends MMToken {
  
  parse(fileStr, idx) {
    const end = fileStr.indexOf('$.', idx);
    this.params = fileStr.slice(idx + 3, end - 1).split(' ');
    return end + 2;
  }

  createBlocks(workspace) {
    for (const constName of this.params) {
      workspace.createVariable(constName, MM.Constant);
    }

    workspace.registerToolboxCategoryCallback('MM_CONSTANTS', this._toolboxFlyoutCallback);
  }

  _toolboxFlyoutCallback(workspace) {
    const blockList = [];
    const constants = workspace.getVariablesOfType(MM.Constant);
    for (const constant of constants) {
      blockList.push({
        'kind': 'block',
        'type': MM.Constant,
        'fields': {
          'CONST': constant
        }
      });
    }

    return blockList;
  }
}