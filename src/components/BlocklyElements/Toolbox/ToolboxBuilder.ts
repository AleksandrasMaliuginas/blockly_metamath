import { WorkspaceSvg } from "blockly"
import { toolboxJson } from "./toolboxJson";
import { FloatingHypo } from "../BlocklyBlocks/FloatingHypo";
import { IBlocklyBlock } from "../IBlocklyBlock";
import { Axiom } from "../BlocklyBlocks/Axiom";

class ToolboxBuilder {
  
  private readonly blockList : any[];
  private readonly targetWorkspace : WorkspaceSvg;

  constructor (workspace : WorkspaceSvg) {
    this.targetWorkspace = workspace;
    this.blockList = [];
    this.registerToolboxCategoryCallbacks();
  }

  addBlock(block : IBlocklyBlock) : void {
    this.blockList.push(block);
  }

  getToolboxJson() : any {
    return toolboxJson;
  }

  private registerToolboxCategoryCallbacks() {
    const categoryClass : Map<string, any> = new Map([
      ['MM_FLOATING_HYPOS', this.getFloatingHypoBlocks],
      ['MM_AXIOMS', this.getAxiomBlocks],
      ['MM_BLOCKS', this.getFloatingHypoBlocks],
    ]);

    categoryClass.forEach((value, key) => {
      console.log(key, value._toolboxFlyoutCallback)
      this.targetWorkspace.registerToolboxCategoryCallback(
        key, value
      );
    });    
  }

  private getFloatingHypoBlocks = () => {
    return this.blockList.reduce((arr, block : IBlocklyBlock) => {
      if (block instanceof FloatingHypo) {
        arr.push(block.toolboxInstance());
      }
      return arr;
    }, []);
  }

  private getAxiomBlocks = () => {
    return this.blockList.reduce((arr, block : IBlocklyBlock) => {
      if (block instanceof Axiom) {
        arr.push(block.toolboxInstance());
      }
      return arr;
    }, []);
  }
}

export { ToolboxBuilder }
