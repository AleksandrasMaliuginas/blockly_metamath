import { TokenManager } from "../TokenManager";
import { MM, MMToken } from "../MMToken";
import { Blocks } from "blockly";
import { MMBlockTemplates } from "../toolbox/blockTemplates";
import { MetamathGenerator } from "../MetamathGenerator";

export class MMFloatingHypo extends MMToken {

  parse(fileStr, startIdx) {
    const endIdx = fileStr.indexOf('$.', startIdx);
    let params = fileStr.slice(startIdx, endIdx).split(' ');

    this.label = params[0];
    this.constant = params[2];
    this.variable = params[3];

    return endIdx + 2;
  }

  create() {
    return new MMFloatingHypo({
      key: this.label,
      type: MM.FloatingHypo,
      value: {
        constant: TokenManager.getToken(this.constant),
        variable: TokenManager.getToken(this.variable),
      }
    });
  }

  getBlock() {
    Blocks[this.key] = {
      init: function () {
        this.jsonInit(MMBlockTemplates.find(el => el.type === MM.FloatingHypo));
      }
    };

    // Register Code generator for this block
    MetamathGenerator[this.key] = function (block) {
      return [block.type, MetamathGenerator.PRECEDENCE];
    };

    return {
      'kind': 'block',
      'type': this.key, // MM.FloatingHypo,
      'fields': {
        'CONST': this.value.constant.value,
        'VAR': this.value.variable.value,
      },
    };
  }

  static _toolboxFlyoutCallback(workspace) {
    const blockList = [];
    const floatingHypos = TokenManager.getTokensByType(MM.FloatingHypo);

    for (const hypo of floatingHypos) {
      blockList.push(
        hypo.getBlock()
      );
    }

    return blockList;
  }
}