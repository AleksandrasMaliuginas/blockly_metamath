import { WorkspaceSvg } from "blockly"
import { toolboxJson } from "./toolboxJson";
import { FloatingHypo } from "../BlocklyBlocks/FloatingHypo";
import { IBlocklyBlock } from "../IBlocklyBlock";
import { Axiom } from "../BlocklyBlocks/Axiom";
import { BlockAxiom } from "../BlocklyBlocks/BlockAxiom";
import { SegmentManager } from "../BlocklyBlocks/SegmentManager";

class ToolboxBuilder {
  
  private readonly blockList : any[];
  // TODO: is workspace realy a Toolbox builder dependency
  private readonly targetWorkspace : WorkspaceSvg;
  private readonly segmentManager : SegmentManager;

  constructor (workspace : WorkspaceSvg, segmentManager : SegmentManager) {
    this.targetWorkspace = workspace;
    this.blockList = [];
    this.registerToolboxCategoryCallbacks();
    this.segmentManager = segmentManager;
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
      ['SEGMENTS', this.getSegments],
    ]);

    categoryClass.forEach((value, key) => {
      this.targetWorkspace.registerToolboxCategoryCallback(
        key, value
      );
    });    
  }

  private getFloatingHypoBlocks = () => this.getBlocksByObjectType(FloatingHypo);
  private getAxiomBlocks        = () => this.getBlocksByObjectType(Axiom);
  private getBlockAxiomBlocks   = () => this.getBlocksByObjectType(BlockAxiom);
  private getSegments           = (workspace : WorkspaceSvg) => this.segmentManager.toolboxCallback(workspace);

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
