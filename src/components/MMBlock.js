import { MMToken } from "./MMToken";
import { Parser } from "./Parser";


export class MMBlock extends MMToken {
  
  parse(fileStr, idx) {
    this.innerParser = new Parser(fileStr);

    let end;
    [end, this.tokens] = this.innerParser.parse(idx + 2);

    if (fileStr[end + 1] == '}') {
      return end + 2;
    }

    return end;
  }
}

export const MM = {
  Constant: 'MMConstant',
  Variable: 'MMVariable',
  FloatingHypo: 'MMFloatingHypo',
  Axiom: 'MMAxiom',
}