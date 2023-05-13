import { mm_tool } from "./verify.js"

const verifyProof = (mmDatabaseString: string) => {
  return mm_tool.verify(mmDatabaseString);
}

export { verifyProof }
