import { BlockSvg } from "blockly";
import { MM, MMToken } from "../MMToken";
import { MMConstant } from "./MMConstant";


export class MMProof extends MMToken {

  parse(fileStr, startIdx) {
    const commentsRegex = /\$\((.+?)\$\)/gs;
    const whitespaceRegex = /\s+/gs;

    const startOfProofIdx = fileStr.indexOf('$=', startIdx);
    const endIdx = fileStr.indexOf('$.', startIdx);

    let params = fileStr.slice(startIdx, startOfProofIdx - 1).split(' ');
    this.label = params[0];
    this.assertion = params.slice(2);
    this.proof = fileStr.slice(startOfProofIdx + 3, endIdx - 1)
      .replace(commentsRegex, '')
      .replace(whitespaceRegex, ' ')
      .trim()
      .split(' ');

    return endIdx + 2;
  }

  register() {
    return new MMProof({
      key: this.label,
      type: MM.Proof,
      value: {
        assertion: this.assertion,
        proof: this.proof,
      }
    });
  }

  static _toolboxFlyoutCallback(workspace) {
    
  }
}