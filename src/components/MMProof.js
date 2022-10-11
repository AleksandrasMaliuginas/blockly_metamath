import { MMToken } from "./MMToken";


export class MMProof extends MMToken {
  
  parse(fileStr, idx) {
    const startOfProof = fileStr.indexOf('$=', idx);
    const end = fileStr.indexOf('$.', idx);
    
    let params = fileStr.slice(idx, startOfProof - 1).split(' ');
    this.label = params[0];
    this.assertion = params.slice(2);
    this.proof = fileStr.slice(startOfProof + 3, end - 1).split(' ');
    // console.log('VARIABLE', fileStr.slice(idx, end + 2), this.params)

    return end + 2;
  }
}