import { IMMStatement } from "./IMMStatement";
import { Keywords } from "./MM";
import { AxiomaticAssertion } from "./MMStatements/AxiomaticAssertion";
import { Constant } from "./MMStatements/Constant";
import { LogicalHypothesis } from "./MMStatements/LogicalHypothesis";
import { ProvableAssertion } from "./MMStatements/ProvableAssertion";
import { ScopingBlock } from "./MMStatements/ScopingBlock";
import { Variable } from "./MMStatements/Variable";
import { VariableHypothesis } from "./MMStatements/VariableHypothesis";

const StatementBuilder = {
  build(mmKeyword: string): IMMStatement {
    switch (mmKeyword) {
      case Keywords.CONSTANT:
        return new Constant();
      case Keywords.VARIABLE:
        return new Variable();
      case Keywords.VARIABLE_HYPOTHESIS:
        return new VariableHypothesis();
      case Keywords.AXIOMATIC_ASSERTION:
        return new AxiomaticAssertion();
      case Keywords.LOGICAL_HYPOTHESIS:
        return new LogicalHypothesis();
      case Keywords.START_OF_SCOPING_BLOCK:
        return new ScopingBlock();
      case Keywords.PROOVABLE_ASSERTION:
        return new ProvableAssertion();
      default:
        throw new Error(`Keyword '${mmKeyword}' can not be recognized.`);
    }
  }
};

export { StatementBuilder }