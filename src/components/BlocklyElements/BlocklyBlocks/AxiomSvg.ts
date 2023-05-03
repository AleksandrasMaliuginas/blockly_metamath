import { Block, Events } from "blockly";
import { BlockTypes, ExtendedBlocklyBlock, MMBlock } from "../IBlocklyBlock";
import { BindedInput } from "../BindedInput";
import { Axiom } from "./Axiom";
import { Variable } from "../../DatabaseParser/MMStatements/Variable";
import { Constant } from "../../DatabaseParser/MMStatements/Constant";
import { BlockMove } from "blockly/core/events/events";

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
        this.inputs.set(definition.label, new BindedInput(definition.label));
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

    this.block.setOnChange(event => {
      if (event.type === Events.BLOCK_MOVE) {
        this.onStatementInput(event as BlockMove)
      }
    });

    this.block.setTooltip(() => {
      return this.descriptor.originalStatement ? this.descriptor.originalStatement : "No tooltip provided.";
    });

    this.block.setColour(this.descriptor.context.getHueColor())
  }

  private onStatementInput(event: BlockMove) {

    if (!event.newParentId || !event.newInputName) return;

    const targetBlock = event.getEventWorkspace_().getBlockById(event.newParentId);
    const targetInput = targetBlock?.inputList.find(i => i.name === event.newInputName);

    if (targetBlock?.id !== this.block.id) return;

    const inputBlock = event.getEventWorkspace_().getBlockById(event.blockId ? event.blockId : '');

    if (!targetInput) return;

    const name = BindedInput.getBindedInputName(targetInput);
    const bindedInput = this.inputs.get(name);

    bindedInput?.update(inputBlock as ExtendedBlocklyBlock)
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