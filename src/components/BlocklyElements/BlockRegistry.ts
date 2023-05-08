import { Blocks, Generator } from "blockly";
import { IMMStatement } from "../DatabaseParser/IMMStatement";
import { VariableHypothesis } from "../DatabaseParser/MMStatements/VariableHypothesis";
import { BlockTypes, BlockDescriptor, ExtendedBlocklyBlock } from "./IBlocklyBlock";
import { ToolboxBuilder } from "./Toolbox/ToolboxBuilder";
import { AxiomaticAssertion } from "../DatabaseParser/MMStatements/AxiomaticAssertion";
import { Axiom } from "./BlocklyBlocks/Axiom";
import { ScopingBlock } from "../DatabaseParser/MMStatements/ScopingBlock";
import { BlockAxiom } from "./BlocklyBlocks/BlockAxiom";
import { SegmentManager } from "./BlocklyBlocks/SegmentManager";
import { Proof } from "./BlocklyBlocks/Proof";
import { Variable as VariableMMStatement } from "../DatabaseParser/MMStatements/Variable";
import { Constant as ConstantMMStatement } from "../DatabaseParser/MMStatements/Constant";
import { Constant } from "./BlocklyBlocks/Constant";
import { Variable } from "./BlocklyBlocks/Variable";
import { StatementContext } from "./StatementContext";
import { Keywords } from "../DatabaseParser/MM";
import { FloatingHypoDescriptor } from "./BlocklyBlocks/FloatingHypoDescriptor";
import { AxiomDescriptor } from "./BlocklyBlocks/AxiomDescriptor";

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

  public mmStatements(mm_statement_list: IMMStatement[]): void {
    this.mm_statements = mm_statement_list;
    mm_statement_list.forEach(this.registerBlocks);
  }

  private registerBlocks = (mmStatement: IMMStatement, index: number) => {
    const statementContext = new StatementContext(this.mm_statements, index);

    // New way
    if ([Keywords.VARIABLE_HYPOTHESIS.valueOf(), Keywords.AXIOMATIC_ASSERTION.valueOf()].includes(mmStatement.keyword)) {

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

      return;
    }

    // Old way
    const block = this.getBlocklyBlock(mmStatement, statementContext);

    if (block) {
      Blocks[mmStatement.label] = block.initializer();

      this.codeGenerator[mmStatement.label] = () => { throw "Old implementation! Migrate to new one." };
      this.toolboxBuilder.addBlock(block);
    }
  }

  private registerSegmentBlocks(): void {
    Blocks[BlockTypes.SegmentDef] = this.segmentManager.segmentDefinitionBlock();
    Blocks[BlockTypes.SegmentRef] = this.segmentManager.segmentReferenceBlock();
    this.codeGenerator[BlockTypes.SegmentDef] = () => "";
    this.codeGenerator[BlockTypes.SegmentRef] = () => "";
  }

  private registerEmptyProof(): void {
    const emptyProof = new Proof();
    Blocks[BlockTypes.Proof] = emptyProof.initializer();
  }

  private createBlock(statement: IMMStatement, context: StatementContext): ExtendedBlocklyBlock {
    if (statement instanceof VariableHypothesis) {
      return FloatingHypoDescriptor.create(statement, context);
    }

    if (statement instanceof AxiomaticAssertion) {
      return AxiomDescriptor.create(statement, context);
    }

    throw `Statement (${statement.constructor.name})[label:'${statement.label}', keyword:'${statement.keyword}'] cannot be recognized.`;
  }

  private getBlocklyBlock(mmStatement: IMMStatement, statementContext: StatementContext): BlockDescriptor | undefined {

    if (mmStatement instanceof ScopingBlock) {
      return new BlockAxiom(mmStatement, statementContext);
    }

    if (mmStatement instanceof ConstantMMStatement) {
      return new Constant(mmStatement);
    }

    if (mmStatement instanceof VariableMMStatement) {
      return new Variable(mmStatement);
    }

    return undefined;
  }

  getJsonToolbox(): any {
    this.toolboxBuilder.getToolboxJson();
  }
}

export { BlockRegistry }