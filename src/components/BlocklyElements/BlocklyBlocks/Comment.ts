
import { Block } from "blockly";
import { BlockTypes, ExtendedBlocklyBlock, MMBlock } from "../IBlocklyBlock";
import { Keywords } from "../../DatabaseParser/MM";

class Comment implements MMBlock {

  private readonly block: Block;

  constructor(block: ExtendedBlocklyBlock) {
    this.block = block;
  }

  init(): void {
    this.block.jsonInit(jsonBlockTemplate);
  }

  toCode(): string {
    const comment = this.block.getFieldValue(COMMENT_TEXT);
    return comment ? this.wrapComment(comment) : END_LINE;
  }

  private wrapComment(comment: string) {
    return END_LINE + Keywords.START_OF_COMMENT + ' ' + comment + ' ' + Keywords.END_OF_COMMENT + END_LINE
  }

  public static create(): ExtendedBlocklyBlock {
    const blocklyBlock = {
      init: function () {
        this.mmBlock = new Comment(this);
        this.mmBlock?.init();
      },
    } as ExtendedBlocklyBlock;
    blocklyBlock.descriptor = undefined;

    return blocklyBlock;
  }
}

const END_LINE = "\n";
const COMMENT_TEXT = "COMMENT_TEXT";

const jsonBlockTemplate = {
  "type": BlockTypes.Comment,
  "message0": "%1",
  "args0": [
    {
      "type": "field_input",
      "name": COMMENT_TEXT,
      "text": "comment"
    }
  ],
  "inputsInline": true,
  "colour": 210,

  "previousStatement": null,
  "nextStatement": null,
};

export { Comment }