import { BASE_OUTPUT_DIR } from "./config";
import { Account } from "./types";
import * as fs from "fs";

/**
 * Generates a Solana instruction JSON file for the given program and accounts.
 *
 * @param programId - The public key of the Solana program.
 * @param instructionName - The name of the instruction to generate.
 * @param instructionData - An array of numbers representing the instruction data (parameters).
 * @param accounts - An array of account objects required for the instruction.
 * @param programName - The name of the program (used as a subdirectory for output). Used for multi-program projects ONLY!
 *
 * @example
 * generateInstruction(
 *  program.programId.toString(),
 *  "instruction_name",
 *  [
 *    { key: provider.publicKey.toString(), is_signer: true, is_writable: true },
 *    { key: anchor.web3.SystemProgram.programId.toString(), is_signer: false, is_writable: true },
 *    { ... other accounts }
 *  ]
 * );
 *
 * If you have multi program anchor project provide the program name so that the instruction file is saved in the correct subdirectory
 *
 * generateInstruction(
 *  "instruction_name",
 *  [
 *    { key: provider.publicKey.toString(), is_signer: true, is_writable: true },
 *    { key: anchor.web3.SystemProgram.programId.toString(), is_signer: false, is_writable: true },
 *    { ... other accounts }
 *  ],
 *  "program_name_here"
 * );
 *
 * This is going to save the JSON input in `input/program-a/instruction_name.json`
 *
 */
export function generateInstruction(
  programId: string,
  instructionName: string,
  instructionData: Buffer<ArrayBufferLike>, // store instruction parameters
  accounts: Account[],
  programName?: string,
): void {
  if (!Buffer.isBuffer(instructionData)) {
    throw new Error("instructionData must be a Buffer");
  }
  const instructionDataArray = Array.from(instructionData);

  // Ensure the BASE_OUTPUT_DIR exists
  if (!fs.existsSync(BASE_OUTPUT_DIR)) {
    fs.mkdirSync(BASE_OUTPUT_DIR, { recursive: true });
  }

  let outputPath = `${BASE_OUTPUT_DIR}/${instructionName}.json`;

  const jsonData = {
    program_id: programId,
    accounts,
    instruction_data: instructionDataArray,
  };

  if (programName) {
    // If programName is provided, save the instruction in a subdirectory
    outputPath = `${BASE_OUTPUT_DIR}/${programName}/${instructionName}.json`;
    let outputDir = `${BASE_OUTPUT_DIR}/${programName}`;
    // Ensure subdirectory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  }

  fs.writeFileSync(
    outputPath || `${instructionName}.json`,
    JSON.stringify(jsonData, null, 2),
  );
}
