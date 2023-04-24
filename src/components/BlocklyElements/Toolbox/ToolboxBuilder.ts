import { WorkspaceSvg } from "blockly"
import { toolboxJson } from "./toolboxJson";
import { FloatingHypo } from "../BlocklyBlocks/FloatingHypo";
import { IBlocklyBlock } from "../IBlocklyBlock";
import { Axiom } from "../BlocklyBlocks/Axiom";
import { BlockAxiom } from "../BlocklyBlocks/BlockAxiom";

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
      ['MM_BLOCKS', this.getBlockAxiomBlocks],
    ]);

    categoryClass.forEach((value, key) => {
      this.targetWorkspace.registerToolboxCategoryCallback(
        key, value
      );
    });    
  }

  private getFloatingHypoBlocks = () => this.getBlocksByObjectType(FloatingHypo);

  private getAxiomBlocks = () => this.getBlocksByObjectType(Axiom);

  private getBlockAxiomBlocks = () => this.getBlocksByObjectType(BlockAxiom);

  private getBlocksByObjectType = (classtype : any) => {
    return this.blockList.reduce((arr, block : IBlocklyBlock) => {
      if (block instanceof classtype) {
        arr.push(block.toolboxInstance());
      }
      return arr;
    }, []);
  }
}

export { ToolboxBuilder }
