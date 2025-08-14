jest.mock("../src/config.ts", () => ({ BASE_OUTPUT_DIR: "test_output" }));
import { generateInstruction } from "../src/index";
import { Account } from "../src/types";
import * as fs from "fs";
import { createHash } from "crypto";

const TEST_OUTPUT_DIR = "test_output";

function sha256(data: string): Buffer {
  return createHash('sha256').update(data).digest();
}

function getDiscriminator(name: string): number[] {
  const hash = sha256(`global:${name}`);
  return Array.from(hash.subarray(0, 8));
}

describe("generateInstruction", () => {
  afterAll(() => {
    // Clean up test output
    fs.rmSync(TEST_OUTPUT_DIR, { recursive: true, force: true });
    // Also clean up the input folder if it was created
    if (fs.existsSync("input")) {
      fs.rmSync("input", { recursive: true, force: true });
    }
  });

  it("should create a JSON file with correct structure", () => {
    const accounts: Account[] = [
      { key: "testKey", is_signer: true, is_writable: false },
    ];
    const instructionData = Buffer.from([1, 2, 3]);
    const programId = "testProgramId";
    const instructionName = "testInstruction";

    // Set BASE_OUTPUT_DIR for test
    (global as any).BASE_OUTPUT_DIR = TEST_OUTPUT_DIR;

    generateInstruction(programId, instructionName, instructionData, accounts);

    const outputPath = `${TEST_OUTPUT_DIR}/${instructionName}.json`;
    expect(fs.existsSync(outputPath)).toBe(true);

    const json = JSON.parse(fs.readFileSync(outputPath, "utf8"));
    expect(json.program_id).toBe(programId);
    expect(json.accounts).toEqual(accounts);
    expect(json.instruction_data).toEqual([1, 2, 3]);
  });

  it("should throw when instructionData is undefined", () => {
    const accounts: Account[] = [
      { key: "testKey", is_signer: true, is_writable: false },
    ];
    const instructionData: any = undefined;
    const programId = "testProgramId";
    const instructionName = "failInstructionData2";

    expect(() => {
      generateInstruction(
        programId,
        instructionName,
        instructionData,
        accounts,
      );
    }).toThrow();
  });

  it("should throw when instructionData is not a Buffer", () => {
    const accounts: Account[] = [
      { key: "testKey", is_signer: true, is_writable: false },
    ];
    const instructionData: any = "not a buffer";
    const programId = "testProgramId";
    const instructionName = "failInstructionData";

    expect(() => {
      generateInstruction(
        programId,
        instructionName,
        instructionData,
        accounts,
      );
    }).toThrow();
  });

  it("should throw when instructionData is undefined", () => {
    const accounts: Account[] = [
      { key: "testKey", is_signer: true, is_writable: false },
    ];
    const instructionData: any = undefined;
    const programId = "testProgramId";
    const instructionName = "failInstructionData2";

    expect(() => {
      generateInstruction(
        programId,
        instructionName,
        instructionData,
        accounts,
      );
    }).toThrow();
  });

  it("should create correct instruction_data with discriminator for Anchor", () => {
    const accounts: Account[] = [
      { key: "A", is_signer: true, is_writable: false },
      { key: "B", is_signer: false, is_writable: true },
    ];
    const instructionName = "manualComputeTest";
    const programId = "testProgramId";
    const args = [10, 20, 30];
    const instructionData = Buffer.from([
      ...getDiscriminator(instructionName),
      ...args,
    ]);

    const expectedJson = {
      program_id: programId,
      accounts,
      instruction_data: [...getDiscriminator(instructionName), ...args],
    };

    generateInstruction(programId, instructionName, instructionData, accounts);

    const outputPath = `test_output/${instructionName}.json`;
    const actualJson = JSON.parse(fs.readFileSync(outputPath, "utf8"));

    expect(actualJson).toEqual(expectedJson);
  });
});
