import Blockly, { Block, Events, Input } from "blockly";
import { ExtendedBlocklyBlock } from "./IBlocklyBlock";
import { BlockMove } from "blockly/core/events/events_block_move";
import { Abstract } from "blockly/core/events/events_abstract";

class BindedInput {

  private readonly name: string;
  private readonly parentBlock : Block;
  private readonly blockInputs: Input[] = [];
  private inputBlockRemoved: boolean = false;

  constructor(name: string, block: ExtendedBlocklyBlock) {
    this.name = name;
    this.parentBlock = block;

    this.parentBlock.workspace.addChangeListener(this.changeListener);
  }

  public getNextInputName(postfix?: string): string {
    return postfix ? `${this.name}.${this.blockInputs.length}.${postfix}` : `${this.name}.${this.blockInputs.length}`;
  }

  public addInput(input: Input): void {
    this.blockInputs.push(input);
  }

  private static getBindedInputName(input: Input) {
    return input.name.split('.')[0];
  }

  private readonly changeListener = (e: Abstract) => {
    if (e.type === Events.BLOCK_MOVE) {
      this.onUpdate(e as BlockMove);
    }

    if (e.type === Events.BLOCK_DRAG) {
      this.clearInputs();
    }
  }

  private onUpdate(event: BlockMove) {
    if (event.newParentId && event.newInputName && event.newParentId === this.parentBlock.id) {
      this.onInputBlockAdded(event);
    }

    if (event.oldParentId && event.oldInputName && event.oldParentId === this.parentBlock.id) {
      this.onInputBlockRemoved(event);
    }
  }

  private onInputBlockAdded(event: BlockMove) {

    const targetInput = this.parentBlock?.inputList.find(i => i.name === event.newInputName);

    if (!targetInput) return;
    if (BindedInput.getBindedInputName(targetInput) !== this.name) return; // Skip inputs which have different variable

    const actingBlock = event.getEventWorkspace_().getBlockById(event.blockId ? event.blockId : '');

    this.add(actingBlock as ExtendedBlocklyBlock);
  }

  private onInputBlockRemoved(event: BlockMove) {

    const targetInput = this.parentBlock?.inputList.find(i => i.name === event.oldInputName);

    if (!targetInput) return;
    if (BindedInput.getBindedInputName(targetInput) !== this.name) return; // Skip inputs which have different variable
    
    this.inputBlockRemoved = true;
  }

  private clearInputs() {
    if (!this.inputBlockRemoved) return;

    this.removeBlocks();

    this.inputBlockRemoved = false;
  }

  private add(block: ExtendedBlocklyBlock) {
    Blockly.clipboard.copy(block as any);

    this.blockInputs.forEach((input: Input, index) => {

      if (!input.connection) return;
      if (input.connection.isConnected() && input.connection.targetBlock()) return;

      const newBlock = Blockly.clipboard.paste();

      if (newBlock instanceof Block) {
        newBlock.outputConnection.connect(input.connection);
      }
    });
  }

  private removeBlocks() {
    this.blockInputs.forEach((input: Input, index) => {
      if (input.connection?.isConnected()) {
        input.connection.targetBlock()?.dispose(false);
      }
    });
  }

}

export { BindedInput }
