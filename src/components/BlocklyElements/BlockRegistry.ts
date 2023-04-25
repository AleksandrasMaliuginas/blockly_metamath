import { Blocks, Generator } from "blockly";
import { IMMStatement } from "../DatabaseParser/IMMStatement";
import { FloatingHypo } from "./BlocklyBlocks/FloatingHypo";
import { VariableHypothesis } from "../DatabaseParser/MMStatements/VariableHypothesis";
import { BlockTypes, IBlocklyBlock } from "./IBlocklyBlock";
import { ToolboxBuilder } from "./Toolbox/ToolboxBuilder";
import { AxiomaticAssertion } from "../DatabaseParser/MMStatements/AxiomaticAssertion";
import { Axiom } from "./BlocklyBlocks/Axiom";
import { ScopingBlock } from "../DatabaseParser/MMStatements/ScopingBlock";
import { BlockAxiom } from "./BlocklyBlocks/BlockAxiom";
import { SegmentManager } from "./BlocklyBlocks/SegmentManager";

interface IBlockRegistry {
  mmStatements(mm_statement_list : IMMStatement[]) : void
}

class BlockRegistry implements IBlockRegistry {

  private readonly toolboxBuilder : ToolboxBuilder;
  private readonly segmentManager : SegmentManager;
  private readonly codeGenerator : any; 
  private mm_statements: IMMStatement[] = [];

  constructor(toolboxBuilder: ToolboxBuilder, segmentManager : SegmentManager, codeGenerator : Generator) {
    this.toolboxBuilder = toolboxBuilder;
    this.segmentManager = segmentManager;
    this.codeGenerator = codeGenerator as any;
    this.defineSegmentBlocks();
  }

  public mmStatements(mm_statement_list: IMMStatement[]): void {
    this.mm_statements = mm_statement_list;
    mm_statement_list.forEach(this.createBlocklyElement);
  }

  private defineSegmentBlocks() : void {
    Blocks[BlockTypes.SegmentDef] = this.segmentManager.segmentDefinitionBlock();
    Blocks[BlockTypes.SegmentRef] = this.segmentManager.segmentReferenceBlock();
    this.codeGenerator[BlockTypes.SegmentDef] = () => "";
    this.codeGenerator[BlockTypes.SegmentRef] = () => "";
  }

  private createBlocklyElement = (mmStatement : IMMStatement, index : number) => {
    const statementContext = new StatementContext(this.mm_statements, index);

    if (mmStatement.label === undefined) {
      return;
    }

    const block = this.getBlocklyBlock(mmStatement, statementContext);

    if (block) {
      Blocks[mmStatement.label] = block.initializer();
      this.codeGenerator[mmStatement.label] = block.blockToCode;
      this.toolboxBuilder.addBlock(block);
    }
  }

  private getBlocklyBlock(mmStatement : IMMStatement, statementContext : StatementContext) : IBlocklyBlock | undefined {
    if (mmStatement instanceof VariableHypothesis) {
      return new FloatingHypo(mmStatement);
    }

    if (mmStatement instanceof AxiomaticAssertion) {
      return new Axiom(mmStatement, statementContext);
    }

    if (mmStatement instanceof ScopingBlock) {
      return new BlockAxiom(mmStatement, statementContext);
    }

    return undefined;
  }

  getJsonToolbox() : any {
    this.toolboxBuilder.getToolboxJson();
  }
}

class StatementContext {
  readonly mmStatements : IMMStatement[] = [];
  readonly currentLevel : number = 0;

  constructor(statements: IMMStatement[], level: number) {
    this.mmStatements = statements;
    this.currentLevel = level;
  }
}

export { BlockRegistry, StatementContext }