
import { Block } from "blockly";
import { BlockTypes as BlockType, IBlocklyBlock } from "../IBlocklyBlock";
import { ToolboxItemInfo } from "blockly/core/utils/toolbox";
import { StatementContext } from "../BlockRegistry";
import { Keywords } from "../../DatabaseParser/MM";
import { Constant } from "../../DatabaseParser/MMStatements/Constant";
import { Variable } from "../../DatabaseParser/MMStatements/Variable";
import { ScopingBlock } from "../../DatabaseParser/MMStatements/ScopingBlock";
import { IMMStatement } from "../../DatabaseParser/IMMStatement";
import { MMRenderInfo } from "../../MMBlockRenderer/MMRenderInfo";

class BlockAxiom implements IBlocklyBlock {

  private readonly label: string | undefined;
  private readonly originalStatement: string | undefined;

  private readonly innerStatements: IMMStatement[] | undefined;
  private readonly context : StatementContext;

  constructor(parsedStatement: ScopingBlock, context : StatementContext) {
    this.label = parsedStatement.label;
    this.originalStatement = parsedStatement.originalStatement;
    this.innerStatements = parsedStatement.statements;
    this.context = context;
  }

  initializer(): any {
    const thisObject = this;
    return {
      init: function () {
        thisObject.blockInit(this);
      }
    };
  }

  toolboxInstance() : ToolboxItemInfo {
    return {
      "kind": "block",
      "type": this.label
    };
  }

  private blockInit(block: Block): void {
    block.jsonInit(jsonBlockTemplate);
    
    this.initInnerStatements(block);

    block.setTooltip(() => {
      return this.originalStatement ? this.originalStatement : "No tooltip provided.";
    });
  }

  private initInnerStatements(block: Block) {
    const statementCount = this.innerStatements ? this.innerStatements.length : 0;

    this.innerStatements?.forEach((statement, statementIndex) => {
      statement.mathSymbols?.forEach((symbol, index) => {
          if (this.isConstant(symbol)) {
            block.appendDummyInput(`${statement.label}.C${index}`).appendField(symbol);
          }

          if (this.isVariable(symbol)) {
            block.appendValueInput(`${statement.label}.V${index}`);
          }
      });

      if (statementIndex < statementCount - 1) {
        block.appendDummyInput(MMRenderInfo.NEW_LINE_INDICATOR)
      }
    });
  }


  // TODO: Leaking logic | Context should be in the Database parser
  private isConstant(symbol : string) {
    const constant : Constant = this.context.mmStatements.find(statement => statement.keyword === Keywords.CONSTANT) as Constant;

    return constant.mathSymbols.includes(symbol);
  }

  private isVariable(symbol : string) {
    const variable : Variable = this.context.mmStatements.find(statement => statement.keyword === Keywords.VARIABLE) as Variable;

    return variable.mathSymbols.includes(symbol);
  }
}

const jsonBlockTemplate = {
  "type": BlockType.Block,
  "message0": '',
  "args0": [],
  "inputsInline": true,
  "output": BlockType.Axiom,
  "colour": 210,
  // "mutator": MM.Axiom + '_mutator'
};

export { BlockAxiom }