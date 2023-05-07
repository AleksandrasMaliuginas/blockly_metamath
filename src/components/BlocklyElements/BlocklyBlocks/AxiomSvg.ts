import { Block } from "blockly";
import { BlockTypes, ExtendedBlocklyBlock, MMBlock } from "../IBlocklyBlock";
import { BindedInput } from "../BindedInput";
import { Axiom } from "./Axiom";
import { Variable } from "../../DatabaseParser/MMStatements/Variable";
import { Constant } from "../../DatabaseParser/MMStatements/Constant";

class AxiomSvg implements MMBlock {

  private readonly block: Block;
  public readonly descriptor: Axiom;

  private readonly inputs: Map<string, BindedInput> = new Map();

  constructor(block: ExtendedBlocklyBlock, descriptor: Axiom) {
    this.block = block as Block;
    this.descriptor = descriptor;

    this.descriptor.mathSymbols?.forEach(symbol => {
      const definition = this.descriptor.context.getDefinitionOf(symbol);

      if (definition instanceof Variable) {
        this.inputs.set(definition.label, new BindedInput(definition.label, block));
      }
    });
  }

  init(): void {
    this.block.jsonInit(jsonBlockTemplate);

    this.descriptor.mathSymbols?.forEach((symbol, index) => {

      const symbolDef = this.descriptor.context.getDefinitionOf(symbol);

      if (symbolDef instanceof Constant) {
        this.block.appendDummyInput(`C${index}`).appendField(symbol);
      }

      if (symbolDef instanceof Variable && this.inputs.has(symbol)) {
        const namePostfix = `V${index}`;
        const name = this.inputs.get(symbol)?.getNextInputName();
        const input = this.block.appendValueInput(name ? name : namePostfix);

        this.inputs.get(symbol)?.addInput(input);
      }
    });

    this.block.setColour(this.descriptor.context.getHueColor());
    this.block.setTooltip(this.descriptor.context.getStatementContext());
  }
}

const jsonBlockTemplate = {
  "type": BlockTypes.Axiom,
  "message0": '',
  "args0": [],
  "inputsInline": true,
  "output": BlockTypes.Axiom,
  "colour": 210,

  "previousStatement": null,
  "nextStatement": null,
};

export { AxiomSvg }