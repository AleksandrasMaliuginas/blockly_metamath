import { MM, MMToken } from "../MMToken";
import SymbolsDB from "../SymbolsDB";


export class MMConstant extends MMToken {

  parse(fileStr, idx) {
    const end = fileStr.indexOf('$.', idx);
    this.params = fileStr.slice(idx + 3, end - 1).split(' ');
    return end + 2;
  }

  create() {
    return this.params.map(el => new MMConstant({
      key: el,
      type: MM.Constant,
      value: el,
    }));
  }

  getBlock() {
    return {
      'kind': 'block',
      'type': MM.Constant,
      'fields': {
        'CONST': this.value,
      },
    };
  }

  static _toolboxFlyoutCallback(workspace) {
    const blockList = [];
    const constants = SymbolsDB.getSymbolsByType(MM.Constant);

    for (const constant of constants) {
      blockList.push(
        constant.getBlock()
      );
    }

    return blockList;
  }
}