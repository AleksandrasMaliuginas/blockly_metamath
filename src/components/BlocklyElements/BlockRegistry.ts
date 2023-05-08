import { Blocks, Generator } from "blockly";
import { IMMStatement } from "../DatabaseParser/IMMStatement";
import { VariableHypothesis } from "../DatabaseParser/MMStatements/VariableHypothesis";
import { BlockTypes, ExtendedBlocklyBlock } from "./IBlocklyBlock";
import { ToolboxBuilder } from "./Toolbox/ToolboxBuilder";
import { AxiomaticAssertion } from "../DatabaseParser/MMStatements/AxiomaticAssertion";
import { ScopingBlock } from "../DatabaseParser/MMStatements/ScopingBlock";
import { SegmentManager } from "./BlocklyBlocks/SegmentManager";
import { Variable } from "../DatabaseParser/MMStatements/Variable";
import { Constant } from "../DatabaseParser/MMStatements/Constant";
import { StatementContext } from "./StatementContext";
import { FloatingHypoDescriptor } from "./BlocklyBlocks/FloatingHypoDescriptor";
import { AxiomDescriptor } from "./BlocklyBlocks/AxiomDescriptor";
import { AxiomBlockDescriptor } from "./BlocklyBlocks/AxiomBlockDescriptor";
import { ProvableAssertion } from "../DatabaseParser/MMStatements/ProvableAssertion";
import { ConstantDescriptor } from "./BlocklyBlocks/ConstantDescriptor";
import { VariableDescriptor } from "./BlocklyBlocks/VariableDescriptor";
import { ProofDescriptor } from "./BlocklyBlocks/ProofDescriptor";

interface IBlockRegistry {
  registerMMStatements(mm_statement_list: IMMStatement[]): void
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

    this.registerAdditionalBlocks();
  }

  public getJsonToolbox(): any {
    this.toolboxBuilder.getToolboxJson();
  }

  public registerMMStatements(mm_statement_list: IMMStatement[]): void {
    this.mm_statements = mm_statement_list;
    mm_statement_list.forEach(this.registerStatementAsBlock);
  }

  private registerStatementAsBlock = (mmStatement: IMMStatement, index: number) => {
    const statementContext = new StatementContext(this.mm_statements, index);

    // Filter
    if (mmStatement instanceof ProvableAssertion) {
      return;
    }

    const blocklyBlock = this.createBlock(mmStatement, statementContext);

    this.registerBlock(blocklyBlock);
  }

  private registerBlock(block: ExtendedBlocklyBlock) {

    if (!block.descriptor) {
      throw `No descriptor provided for '${block.mmBlock?.constructor.name}' block.`;
    }

    const blockName = block.descriptor.blockName();

    // Register block
    Blocks[blockName] = block;
    this.toolboxBuilder.addBlock(block.descriptor);

    // Register code generator
    this.codeGenerator[blockName] = (block: ExtendedBlocklyBlock) => {
      return block.mmBlock?.toCode();
    };
  }

  private registerAdditionalBlocks() {
    this.registerBlock(ProofDescriptor.create());
  }

  private registerSegmentBlocks(): void {
    Blocks[BlockTypes.SegmentDef] = this.segmentManager.segmentDefinitionBlock();
    Blocks[BlockTypes.SegmentRef] = this.segmentManager.segmentReferenceBlock();
    this.codeGenerator[BlockTypes.SegmentDef] = () => { throw 'No implementation provided'; };
    this.codeGenerator[BlockTypes.SegmentRef] = () => { throw 'No implementation provided'; };
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