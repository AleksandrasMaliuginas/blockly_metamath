import { WorkspaceSvg } from "blockly"
import { toolboxJson } from "./toolboxJson";
import { BlockDescriptor } from "../IBlocklyBlock";
import { SegmentManager } from "../BlocklyBlocks/SegmentManager";
import { BlockFinder } from "../../BlockFinder";
import { FloatingHypoDescriptor } from "../BlocklyBlocks/FloatingHypoDescriptor";
import { AxiomDescriptor } from "../BlocklyBlocks/AxiomDescriptor";
import { ConstantDescriptor } from "../BlocklyBlocks/ConstantDescriptor";
import { VariableDescriptor } from "../BlocklyBlocks/VariableDescriptor";
import { BlockAxiomDescriptor } from "../BlocklyBlocks/BlockAxiomDescriptor";
import { BlockProofDescriptor } from "../BlocklyBlocks/BlockProofDescriptor";

class ToolboxBuilder {

   readonly blockList: any[];
  // TODO: is workspace realy a Toolbox builder dependency
  public readonly targetWorkspace: WorkspaceSvg;
  private readonly segmentManager: SegmentManager;
  private readonly blockFinder: BlockFinder;

  constructor(workspace: WorkspaceSvg, segmentManager: SegmentManager, blockFinder: BlockFinder) {
    this.targetWorkspace = workspace;
    this.segmentManager = segmentManager;
    this.blockFinder = blockFinder;
    this.blockList = [];

    this.registerToolboxCategoryCallbacks();
  }

  addBlock(block: BlockDescriptor): void {
    this.blockList.push(block);
  }

  getToolboxJson(): any {
    return toolboxJson;
  }

  private registerToolboxCategoryCallbacks() {
    const categories = new Map([
      ['MM_FLOATING_HYPOS', this.getFloatingHypoBlocks],
      ['MM_AXIOMS', this.getAxiomBlocks],
      ['MM_BLOCK_AXIOMS', this.getBlockAxiomBlocks],
      ['MM_BLOCK_PROOFS', this.getBlockProofBlocks],
      ['MM_CONSTANTS', this.getConstantBlocks],
      ['MM_VARIABLES', this.getVariableBlocks],
      ['SEGMENTS', this.getSegments],
    ]);

    categories.forEach((value, key) => {
      this.targetWorkspace.registerToolboxCategoryCallback(
        key, value
      );
    });
  }

  private getFloatingHypoBlocks = () => this.getBlocksByObjectType(FloatingHypoDescriptor);
  private getAxiomBlocks        = () => this.getBlocksByObjectType(AxiomDescriptor);
  private getBlockAxiomBlocks   = () => this.getBlocksByObjectType(BlockAxiomDescriptor);
  private getBlockProofBlocks   = () => this.getBlocksByObjectType(BlockProofDescriptor);
  private getConstantBlocks     = () => this.getBlocksByObjectType(ConstantDescriptor);
  private getVariableBlocks     = () => this.getBlocksByObjectType(VariableDescriptor);
  private getSegments           = (workspace : WorkspaceSvg) => this.segmentManager.toolboxCallback(workspace);

  private getBlocksByObjectType = (classtype: any) => {
    return this.blockList.reduce((arr, block: BlockDescriptor) => {
      if (block instanceof classtype && this.blockFinder.match(block)) {
        arr.push(block.toolboxInstance());
      }
      return arr;
    }, []);
  }
}

export { ToolboxBuilder }
