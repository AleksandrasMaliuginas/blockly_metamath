import { Blocks } from "blockly";
import { IMMStatement } from "../DatabaseParser/IMMStatement";
import { FloatingHypo } from "./BlocklyBlocks/FloatingHypo";
import { VariableHypothesis } from "../DatabaseParser/MMStatements/VariableHypothesis";
import { IBlocklyBlock } from "./IBlocklyBlock";
import { ToolboxBuilder } from "./Toolbox/ToolboxBuilder";
import { AxiomaticAssertion } from "../DatabaseParser/MMStatements/AxiomaticAssertion";
import { Axiom } from "./BlocklyBlocks/Axiom";

interface IBlockRegistry {
  mmStatements(mm_statement_list : IMMStatement[]) : void
}

class BlockRegistry implements IBlockRegistry {

  private readonly registeredBlocks : IBlocklyBlock[] = []
  private readonly toolboxBuilder : ToolboxBuilder;
  private mm_statements: IMMStatement[] = [];

  constructor(toolboxBuilder: ToolboxBuilder) {
    this.toolboxBuilder = toolboxBuilder;
  }

  mmStatements(mm_statement_list: IMMStatement[]): void {
    this.mm_statements = mm_statement_list;
    mm_statement_list.forEach(this.createBlocklyElement);
  }

  private createBlocklyElement = (mmStatement : IMMStatement, index : number) => {
    const statementContext = new StatementContext(this.mm_statements, index);

    if (mmStatement.label === undefined) {
      return;
    }

    let block : IBlocklyBlock | undefined;

    if (mmStatement instanceof VariableHypothesis) {
      block = new FloatingHypo(mmStatement);
    }

    if (mmStatement instanceof AxiomaticAssertion) {
      block = new Axiom(mmStatement, statementContext);
    }


    if (block) {
      Blocks[mmStatement.label] = block.initializer();
      this.registeredBlocks.push(block);
      this.toolboxBuilder.addBlock(block);
    }
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