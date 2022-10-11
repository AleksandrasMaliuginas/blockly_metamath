// Abstract Class MMComponent
export class MMToken {

  constructor() {
    if (this.constructor == MMToken) {
      throw new Error("Abstract classes can't be instantiated.");
    }
  }

  parse(fileStr, idx) {
    throw new Error("Method 'parse(fileStr, idx)' must be implemented.");
  }
  
  createBlocks(workspace) {
    return;
    throw new Error("Method  must be implemented.");
  }
}