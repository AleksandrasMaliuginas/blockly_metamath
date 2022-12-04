export const ProofSegments = {

  SEGMENTS: [],

  addSegment(name) {
    this.SEGMENTS.push(name);
    
  },

  allSegments() {
    return this.SEGMENTS;
  }
}