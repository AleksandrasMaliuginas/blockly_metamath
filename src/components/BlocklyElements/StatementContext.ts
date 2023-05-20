import { line } from "blockly/core/utils/svg_paths";
import { IMMStatement } from "../DatabaseParser/IMMStatement";
import { Keywords } from "../DatabaseParser/MM";
import { VariableHypothesis } from "../DatabaseParser/MMStatements/VariableHypothesis";

class StatementContext {
  readonly mmStatements: IMMStatement[] = [];
  readonly currentLevel: number = 0;
  private readonly statement: IMMStatement;
  private readonly colors: Map<string, number> = new Map();

  constructor(statements: IMMStatement[], level: number) {
    this.mmStatements = statements;
    this.currentLevel = level;
    this.statement = statements[level];
    this.setHueColors();
  }

  private setHueColors() {
    const types = new Set(this.mmStatements.map(statement => statement.constant));
    types.delete(undefined);

    let index = 0;
    for (const type of types) {
      this.colors.set(type, COLORS[index]);
      index++;
    }
  }

  public getHueColor(type: string | null = null): number {
    let color: number | undefined;
    if (type === null) {
      color = this.colors.get(this.statement.constant);
    } else {
      color = this.colors.get(type);
    }
    return color ? color : 0;
  }

  public getDefinitionOf(symbol: string, opt_withContext: boolean = true): IMMStatement | undefined {
    const beginIndex = opt_withContext ? this.currentLevel : this.mmStatements.length - 1;

    for (let i = beginIndex; i >= 0; i--) {
      if (symbol === this.mmStatements[i].label) {
        return this.mmStatements[i];
      }
    }
  }

  public getFloatingHypothesis(symbol: string): IMMStatement | undefined {
    return this.mmStatements.find(st => st instanceof VariableHypothesis && st.variable === symbol);
  }

  public getStatementContext() {

    if (this.statement.keyword === Keywords.START_OF_SCOPING_BLOCK) {
      return "Type: " + this.statement.type + END_LINE +
        "Statement: " + END_LINE + this.statement.originalStatement;
    }

    if (this.statement.keyword !== Keywords.VARIABLE_HYPOTHESIS) {
      const lines: string[] = [];
      const requiredInputs: Map<string, string> = new Map();

      this.statement.mathSymbols?.forEach((symbol) => {
        const definition = this.getDefinitionOf(symbol);
        const variableHypo = this.getFloatingHypothesis(symbol);

        if (definition?.keyword === Keywords.VARIABLE && variableHypo) {
          if (!requiredInputs.has(symbol)) {
            requiredInputs.set(symbol, variableHypo.originalStatement);

            lines.push(symbol + ': ' + variableHypo.originalStatement);
          }
        }
      });

      return "Type: " + this.statement.type + END_LINE +
        "Statement: " + END_LINE + this.statement.keyword + " " + this.statement.mathSymbols.join(' ') + END_LINE +
        "Inputs: " + END_LINE + lines.join(END_LINE);
    }

    return this.statement.keyword + " " + this.statement.mathSymbols.join(' ');

  }
}

const END_LINE = '\n';
const COLORS = [0, 120, 240, 60, 180, 300, 30, 90, 150, 210, 270, 330];

export { StatementContext }