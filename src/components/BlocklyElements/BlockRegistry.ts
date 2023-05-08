import { Blocks, Generator } from "blockly";
import { IMMStatement } from "../DatabaseParser/IMMStatement";
import { VariableHypothesis } from "../DatabaseParser/MMStatements/VariableHypothesis";
import { BlockTypes, ExtendedBlocklyBlock } from "./IBlocklyBlock";
import { ToolboxBuilder } from "./Toolbox/ToolboxBuilder";
import { AxiomaticAssertion } from "../DatabaseParser/MMStatements/AxiomaticAssertion";
import { ScopingBlock } from "../DatabaseParser/MMStatements/ScopingBlock";
import { SegmentManager } from "./BlocklyBlocks/SegmentManager";
import { Proof } from "./BlocklyBlocks/Proof";
import { Variable } from "../DatabaseParser/MMStatements/Variable";
import { Constant } from "../DatabaseParser/MMStatements/Constant";
import { StatementContext } from "./StatementContext";
import { FloatingHypoDescriptor } from "./BlocklyBlocks/FloatingHypoDescriptor";
import { AxiomDescriptor } from "./BlocklyBlocks/AxiomDescriptor";
import { AxiomBlockDescriptor } from "./BlocklyBlocks/AxiomBlockDescriptor";
import { ProvableAssertion } from "../DatabaseParser/MMStatements/ProvableAssertion";
import { ConstantDescriptor } from "./BlocklyBlocks/ConstantDescriptor";
import { VariableDescriptor } from "./BlocklyBlocks/VariableDescriptor";

interface IBlockRegistry {
  mmStatements(mm_statement_list: IMMStatement[]): void
}

class BlockRegistry implements IBlockRegistry {

  private readonly toolboxBuilder: ToolboxBuilder;
  private readonly segmentManager: SegmentManager;
  private readonly codeGenerator: any;
  private mm_statements: IMMStatement[] = [];

  constructor(toolboxBuilder: ToolboxBuilder, segmentManager: SegmentManager, codeGenerator: Generator) {
    this.toolboxBuilder = toolboxBuilder;
    this.segmentManager = segmentManager;
    this.codeGenerator = codeGenerator as any;
    this.registerSegmentBlocks();
    this.registerEmptyProof();
  }

  public getJsonToolbox(): any {
    this.toolboxBuilder.getToolboxJson();
  }

  public mmStatements(mm_statement_list: IMMStatement[]): void {
    this.mm_statements = mm_statement_list;
    mm_statement_list.forEach(this.registerBlocks);
  }

  private registerBlocks = (mmStatement: IMMStatement, index: number) => {
    const statementContext = new StatementContext(this.mm_statements, index);

    // Filter
    if (mmStatement instanceof ProvableAssertion) {
      return;
    }

    const blocklyBlock = this.createBlock(mmStatement, statementContext);

    if (!blocklyBlock.descriptor) {
      throw `No descriptor provided for '${mmStatement.label}' statement block.`;
    }

    const blockName = blocklyBlock.descriptor.blockName();

    // Register block
    Blocks[blockName] = blocklyBlock;
    this.toolboxBuilder.addBlock(blocklyBlock.descriptor);

    // Register code generator
    this.codeGenerator[blockName] = (block: ExtendedBlocklyBlock) => {
      return block.mmBlock?.toCode();
    };
  }

  private registerSegmentBlocks(): void {
    Blocks[BlockTypes.SegmentDef] = this.segmentManager.segmentDefinitionBlock();
    Blocks[BlockTypes.SegmentRef] = this.segmentManager.segmentReferenceBlock();
    this.codeGenerator[BlockTypes.SegmentDef] = () => { throw 'No implementation provided'; };
    this.codeGenerator[BlockTypes.SegmentRef] = () => { throw 'No implementation provided'; };
  }

  private registerEmptyProof(): void {
    const emptyProof = new Proof();
    Blocks[BlockTypes.Proof] = emptyProof.initializer();
    this.codeGenerator[BlockTypes.Proof] = () => { throw 'No implementation provided'; };
  }

  private createBlock(statement: IMMStatement, context: StatementContext): ExtendedBlocklyBlock {
    if (statement instanceof VariableHypothesis) {
      return FloatingHypoDescriptor.create(statement, context);
    }

    if (statement instanceof AxiomaticAssertion) {
      return AxiomDescriptor.create(statement, context);
    }

    if (statement instanceof ScopingBlock) {
      return AxiomBlockDescriptor.create(statement, context);
    }

    if (statement instanceof Constant) {
      return ConstantDescriptor.create(statement, context);
    }

    if (statement instanceof Variable) {
      return VariableDescriptor.create(statement, context);
    }

    throw `Statement (${statement.constructor.name})[label:'${statement.label}', keyword:'${statement.keyword}'] cannot be recognized.`;
  }
}

export { BlockRegistry }