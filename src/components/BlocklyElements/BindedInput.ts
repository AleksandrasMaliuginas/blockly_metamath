import Blockly, { Block, Input } from "blockly";
import { ExtendedBlocklyBlock } from "./IBlocklyBlock";

class BindedInput {

  private readonly name;
  private readonly blockInputs: Input[] = [];

  constructor(name: string) {
    this.name = name;
  }

  public getNextInputName(postfix: string = ''): string {
    return `${this.name}.${this.blockInputs.length}.${postfix}`;
  }

  public addInput(input: Input): void {
    this.blockInputs.push(input);
  }

  public update(block: ExtendedBlocklyBlock) {
    Blockly.clipboard.copy(block as any);

    this.blockInputs.forEach((input: Input, index) => {

      if (!input.connection) return;
      
      if (input.connection.isConnected() && input.connection.targetBlock()) {
        // const targetBlock = input.connection.targetBlock() as ExtendedBlocklyBlock;
        return;
      }

      const newBlock = Blockly.clipboard.paste();
      
      if (newBlock instanceof Block) {
        newBlock.outputConnection.connect(input.connection);
      }
    });
  }

  public static getBindedInputName(input: Input) {
    return input.name.split('.')[0];
  }
}

export { BindedInput }
