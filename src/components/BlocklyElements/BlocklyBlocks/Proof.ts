
import { Block } from "blockly";
import { BlockTypes, MMBlock, ExtendedBlocklyBlock } from "../IBlocklyBlock";
import { Keywords } from "../../DatabaseParser/MM";

class Proof implements MMBlock {

  private readonly block: Block;

  constructor(block: ExtendedBlocklyBlock) {
    this.block = block;
  }

  init(): void {
    this.block.jsonInit(jsonBlockTemplate);
  }

  toCode(): string {
    const label = this.block.getFieldValue(LABEL);
    const assertion = this.assertionToCode();
    const proof = this.proofToCode();
    
    return `${label} ${Keywords.PROOVABLE_ASSERTION} ${assertion} ${Keywords.START_OF_PROOF}
    ${proof} 
    ${Keywords.END_OF_STATEMENT}`;
  }

  private assertionToCode() {
    const firstBlock = this.block.getInput(ASSERTION)?.connection?.targetBlock() as ExtendedBlocklyBlock;
    return firstBlock ? firstBlock.mmBlock?.toCode() : '?';
  }

  private proofToCode() {
    const firstBlock = this.block.getInput(PROOF)?.connection?.targetBlock() as ExtendedBlocklyBlock;
    return firstBlock ? this.innerBlockToCode(firstBlock) : '???';
  }

  private innerBlockToCode(block: ExtendedBlocklyBlock): string {
    const code = block.mmBlock?.toCode();

    if (block.nextConnection.isConnected()) {
      const nextBlock = block.nextConnection.targetBlock() as ExtendedBlocklyBlock;
      return code + ' ' + this.innerBlockToCode(nextBlock);
    }

    return code ? code : '???';
  }
}

const LABEL = 'LABEL';
const ASSERTION = 'ASSERTION';
const PROOF = 'PROOF';

const jsonBlockTemplate = {
  "type": BlockTypes.Proof,
  "message0": "Label: %1 Assertion: %2 Proof: %3",
  "args0": [
    {
      "type": "field_input",
      "name": LABEL,
      "text": "default"
    },
    {
      "type": "input_value",
      "name": ASSERTION
    },
    {
      "type": "input_statement",
      "name": PROOF
    }
  ],
  "inputsInline": true,
  "colour": 20,
  "tooltip": "",
  "helpUrl": ""
};

export { Proof }