import { MM, MMToken } from "../MMToken";
import SymbolsDB from "../SymbolsDB";

export class MMVariable extends MMToken {

  parse(fileStr, idx) {
    const end = fileStr.indexOf('$.', idx);
    this.params = fileStr.slice(idx + 3, end - 1).split(' ');

    return end + 2;
  }

  create() {
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
    const variables = SymbolsDB.getSymbolsByType(MM.Variable);

    for (const variable of variables) {
      blockList.push(
        variable.getBlock()
      );
    }

    return blockList;
  }
}