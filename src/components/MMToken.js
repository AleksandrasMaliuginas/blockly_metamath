// Abstract Class MMComponent
export class MMToken {

  constructor(params= null) {
    if (this.constructor == MMToken) {
      throw new Error("Abstract classes can't be instantiated.");
    }

    if (params) {
      this.key = params.key;
      this.type = params.type;
      this.value = params.value;
    }
  }

  parse(fileStr, idx) {
    throw new Error("Method 'parse(fileStr, idx)' must be implemented.");
  }
  
  create() {
    throw new Error("Method 'create()' must be implemented.");
  }

  getBlock() {
    return;
    throw new Error("Method  must be implemented.");
  }
}

export const MM = {
  Constant: 'MMConstant',
  Variable: 'MMVariable',
  FloatingHypo: 'MMFloatingHypo',
  Axiom: 'MMAxiom',
  EssentialHypo: 'MMEssentialHypo',
  Block: 'MMBlock',
  Proof: 'MMProof',
  /**
   * Dummy token to group and reuse labels used in proof.
   */
  Function: 'MMFunction',
}