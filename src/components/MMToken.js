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

  parse(fileStr, startIdx) {
    throw new Error("Method 'parse(fileStr, idx)' must be implemented.");
  }
  
  register() {
    throw new Error("Method 'register()' must be implemented.");
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
   * Dummy token names to group and reuse labels used in proof.
   */
   SegmentDef: 'SegmentDef',
   SegmentRef: 'SegmentRef',
}