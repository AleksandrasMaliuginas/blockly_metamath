import { IMMStatement } from "../IMMStatement";
import { Keywords, WHITESPACE } from "../MM";

class ProvableAssertion implements IMMStatement {
  label: string | undefined;
  keyword: string | undefined;
  originalStatement: string | undefined;

  constant: string | undefined;
  mathSymbols: string[] = [];

  proofLabels: string[] = [];

  parse(dbStr: string, startIndex: number): number {
    const startOfProofIdx = dbStr.indexOf(Keywords.START_OF_PROOF, startIndex) + 2;
    const endIdx = dbStr.indexOf(Keywords.END_OF_STATEMENT, startIndex) + 2;
    this.originalStatement = dbStr.slice(startIndex, endIdx).trim();

    const assertion = dbStr.slice(startIndex, startOfProofIdx).trim().split(WHITESPACE);
    this.label = assertion[0];
    this.keyword = assertion[1];
    this.constant = assertion[2]
    this.mathSymbols = assertion.slice(2, -1);
    
    const proof = dbStr.slice(startOfProofIdx, endIdx).trim().split(WHITESPACE);
    this.proofLabels = proof.slice(0, -1);

    return endIdx;
  }
}

export { ProvableAssertion }