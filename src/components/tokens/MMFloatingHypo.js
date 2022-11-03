import SymbolsDB from "../SymbolsDB";
import { MM, MMToken } from "../MMToken";

export class MMFloatingHypo extends MMToken {

  parse(fileStr, idx) {
    const end = fileStr.indexOf('$.', idx);
    let params = fileStr.slice(idx, end).split(' ');

    this.label = params[0];
    this.constant = params[2];
    this.variable = params[3];

    return end + 2;
  }

  create() {
    return new MMFloatingHypo({
      key: this.label,
      type: MM.FloatingHypo,
      value: {
        constant: SymbolsDB.getSymbol(this.constant),
        variable: SymbolsDB.getSymbol(this.variable),
      }
    });
  }

  getBlock() {
    return {
      'kind': 'block',
      'type': MM.FloatingHypo,
      'fields': {
        'CONST': this.value.constant.value,
        'VAR': this.value.variable.value,
      }
    };
  }

  static _toolboxFlyoutCallback(workspace) {
    const blockList = [];
    const floatingHypos = SymbolsDB.getSymbolsByType(MM.FloatingHypo);

    for (const hypo of floatingHypos) {
      blockList.push(
        hypo.getBlock()
      );
    }

    return blockList;
  }
}