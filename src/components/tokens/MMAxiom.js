import SymbolsDB from "../SymbolsDB";
import { MM, MMToken } from "../MMToken";
import { Blocks, Extensions } from "blockly";


export class MMAxiom extends MMToken {

  parse(fileStr, idx) {
    const end = fileStr.indexOf('$.', idx);

    let params = fileStr.slice(idx, end - 1).split(' ');
    this.label = params[0];
    this.params = params.slice(2);

    return end + 2;
  }

  create() {
    return new MMAxiom({
      key: this.label,
      type: MM.Axiom,
      value: this.params.map(el => SymbolsDB.getSymbol(el)),
    });
  }

  getBlock() {
    const axiom = this;
    const inputs = {};

    Blocks[axiom.key] = {
      init: function () {
        this.jsonInit(jsonAxiom);
        // Assign 'this' to a variable for use in the tooltip closure below.

        for (const i in axiom.value) {
          const val = axiom.value[i];
          if (val.type === MM.Constant) {
            this.appendDummyInput(`C${i}`)
              .appendField(val.value);
          } else {
            this.appendValueInput(`V${i}`)
              .setCheck(MM.Variable);

            inputs[`V${i}`] = {'block': SymbolsDB.getSymbol(val.key).getBlock()};
          }
        }

        // var thisBlock = this;
        // this.setTooltip(function () {
        //   return 'Add a number to variable "%1".'.replace('%1',
        //     thisBlock.getFieldValue('VAR'));
        // });
      }
    };

    // console.log(Blocks)

    return {
      'kind': 'block',
      'type': this.key,
      'inputs': inputs
    };


    return {
      'kind': 'block',
      'type': MM.Axiom,
      'inputs': {
        'DEF': this._getInnerBlocks()
      }
    };
  }

  _getInnerBlocks(depth = 0) {
    const currentBlock = {
      "block": this.value[depth].getBlock()
    };

    if (depth < this.value.length - 1) {
      currentBlock.block.inputs = {
        "NEXT": this._getInnerBlocks(depth + 1)
      }
    }

    return currentBlock;
  }

  static _toolboxFlyoutCallback(workspace) {
    const blockList = [];
    const axioms = SymbolsDB.getSymbolsByType(MM.Axiom);

    for (const axiom of axioms) {
      blockList.push(
        axiom.getBlock()
      );
    }

    return blockList;
  }
}

const jsonAxiom = {
  "type": MM.Axiom,
  "message0": '',
  "args0": [],
  "inputsInline": true,
  "previousStatement": null,
  "nextStatement": null,
  "output": MM.Axiom,
  "colour": 210,
};