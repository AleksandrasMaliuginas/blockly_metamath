import { Blocks, Events, Procedures } from "blockly";
import { MM, MMToken } from "../MMToken";
import { MMBlockTemplates } from "../toolbox/blockTemplates";


export class Function extends MMToken {

  parse(fileStr, idx) {
    return idx+1;
  }

  create() {
    return {};
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

  static register() {
    Blocks[MM.Function] = {
      init: function () {
        this.jsonInit(MMBlockTemplates.find(el => el.type === MM.Function));
      },
      onchange: function (event) {
        if (event.type === Events.BLOCK_CREATE) {
          console.log(event)
        }
        
      }
    }
  }

  static _toolboxFlyoutCallback(workspace) {

    // console.log(Events.BLOCK_CREATE)
    // console.log(Blocks[MM.Function])

    // Function.register();
  }
}