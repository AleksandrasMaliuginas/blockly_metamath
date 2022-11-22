import SymbolsDB from "../SymbolsDB";
import { MM, MMToken } from "../MMToken";
import { Blocks } from "blockly";
import { MetamathGenerator } from "../MetamathGenerator";
import { MMBlockTemplates } from "../toolbox/blockTemplates";


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
    // Assign 'this' to a variable for use in the Block.init() function below.
    const axiom = this;
    const inputs = {};

    // Register Block with TYPE = axiom.label
    Blocks[axiom.key] = {
      init: function () {
        this.jsonInit(MMBlockTemplates.find(el => el.type === MM.Axiom));

        for (const i in axiom.value) {
          const val = axiom.value[i];
          if (val.type === MM.Constant) {
            this.appendDummyInput(`C${i}`)
              .appendField(val.value);
          } else {
            this.appendValueInput(`V${i}`)
              .setCheck([MM.Variable, MM.FloatingHypo, MM.Axiom]);

            inputs[`V${i}`] = { 'block': SymbolsDB.getSymbol(val.key).getBlock() };
          }
        }

        // console.log(inputs)
      }
    };

    // Register Code generator for this block
    MetamathGenerator[axiom.key] = function (block) {
      const blockInputs = block.inputList.filter(el => el.name[0] === 'V');

      const mmParams = blockInputs.map(el => 
        MetamathGenerator.valueToCode(block, el.name, MetamathGenerator.PRECEDENCE)
      ).join(' ');
      // console.log(mmParams)

      return [mmParams + ' ' + block.type, MetamathGenerator.PRECEDENCE];
    };

    return {
      'kind': 'block',
      'type': this.key,
      'inputs': inputs
    };
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