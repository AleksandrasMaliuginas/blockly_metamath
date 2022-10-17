import { MMToken } from "./MMToken";


export class MMVariable extends MMToken {
  
  parse(fileStr, idx) {
    const end = fileStr.indexOf('$.', idx);
    
    this.params = fileStr.slice(idx + 3, end - 1).split(' ');
    // console.log('VARIABLE', fileStr.slice(idx, end + 2), this.params)

    return end + 2;
  }

  createBlocks(workspace) {
    for (const varName of this.params) {
      workspace.createVariable(varName, 'variable');
    }

    workspace.registerToolboxCategoryCallback('MM_VARIABLES', this._toolboxFlyoutCallback);
  }

  _toolboxFlyoutCallback(workspace) {
    const blockList = [];
    const variables = workspace.getVariablesOfType('variable');
    for (const variable of variables) {
      blockList.push({
        'kind': 'block',
        'type': 'mm_variable',
        'fields': {
          'VAR': variable
        }
      });
    }

    return blockList;
  }
}