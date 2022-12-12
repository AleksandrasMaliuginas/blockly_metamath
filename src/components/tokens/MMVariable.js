import { MM, MMToken } from "../MMToken";
import { TokenManager } from "../TokenManager";

export class MMVariable extends MMToken {

  parse(fileStr, startIdx) {
    const endIdx = fileStr.indexOf('$.', startIdx);
    this.params = fileStr.slice(startIdx + 3, endIdx - 1).split(' ');

    return endIdx + 2;
  }

  register() {
    return this.params.map(el => new MMVariable({
      key: el,
      type: MM.Variable,
      value: el,
    }));
  }

  getBlock() {
    return {
      'kind': 'block',
      'type': MM.Variable,
      'fields': {
        'VAR': this.value,
      },
    };
  }

  static _toolboxFlyoutCallback(workspace) {
    const blockList = [];
    const variables = TokenManager.getTokensByType(MM.Variable);

    for (const variable of variables) {
      blockList.push(
        variable.getBlock()
      );
    }

    return blockList;
  }
}