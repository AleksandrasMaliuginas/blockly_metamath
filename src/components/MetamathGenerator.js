import { Generator } from "blockly";
import { MM } from "./MMToken";

const mmGenerator = new Generator('Metamath');
mmGenerator.PRECEDENCE = 0;

mmGenerator[MM.Proof] = function (block) {
  const assertion = block.getFieldValue('ASSERTION');
  const proof = mmGenerator.valueToCode(block, 'PROOF', mmGenerator.PRECEDENCE);

  return `label $p ${assertion} $= 
    ${proof} 
    $.`;
};

export const MetamathGenerator = mmGenerator;