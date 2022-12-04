import { MM, MMToken } from "../MMToken";
import { TokenManager } from "../TokenManager";


export class MMConstant extends MMToken {

  parse(fileStr, startIdx) {
    const endIdx = fileStr.indexOf('$.', startIdx);
    this.params = fileStr.slice(startIdx + 3, endIdx - 1).split(' ');
    return endIdx + 2;
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
    const constants = TokenManager.getTokensByType(MM.Constant);

    for (const constant of constants) {
      blockList.push(
        constant.getBlock()
      );
    }

    return blockList;
  }
}