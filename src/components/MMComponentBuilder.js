import { MMAxiom } from "./MMAxiom";
import { MMBlock } from "./MMBlock";
import { MMComment } from "./MMComment";
import { MMConstant } from "./MMConstant";
import { MMEssentialHypo } from "./MMEssentialHypo";
import { MMFloatingHypo } from "./MMFloatingHypo";
import { MMProof } from "./MMProof";
import { MMVariable } from "./MMVariable";

export class MMComponentBuilder {
  static build(componentType) {

    switch (componentType) {
      case '(':
        return new MMComment();
      case 'c':
        return new MMConstant();
      case 'v':
        return new MMVariable();
      case 'f':
        return new MMFloatingHypo();
      case 'a':
        return new MMAxiom();
      case 'e':
        return new MMEssentialHypo();
      case '{':
        return new MMBlock();
      case 'p':
        return new MMProof();
      default:
        return false;
    }
  }
}