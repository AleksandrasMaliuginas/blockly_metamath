import { MM, MMToken } from "../MMToken";


export class MMProof extends MMToken {

  parse(fileStr, idx) {
    const commentsRegex = /\$\((.+?)\$\)/gs
    const whitespaceRegex = /\s+/gs

    const startOfProof = fileStr.indexOf('$=', idx);
    const end = fileStr.indexOf('$.', idx);

    let params = fileStr.slice(idx, startOfProof - 1).split(' ');
    this.label = params[0];
    this.assertion = params.slice(2);
    this.proof = fileStr.slice(startOfProof + 3, end - 1)
      .replace(commentsRegex, '')
      .replace(whitespaceRegex, ' ')
      .trim()
      .split(' ');

    return end + 2;
  }

  create() {
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