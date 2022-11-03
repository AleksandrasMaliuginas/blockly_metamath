import { MMAxiom } from "./tokens/MMAxiom";
import { MMBlock } from "./tokens/MMBlock";
import { MMComment } from "./tokens/MMComment";
import { MMConstant } from "./tokens/MMConstant";
import { MMEssentialHypo } from "./tokens/MMEssentialHypo";
import { MMFloatingHypo } from "./tokens/MMFloatingHypo";
import { MMProof } from "./tokens/MMProof";
import { MMVariable } from "./tokens/MMVariable";

export class ComponentBuilder {
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