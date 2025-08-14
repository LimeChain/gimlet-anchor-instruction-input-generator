# gimlet-anchor-instruction-input-generator
Gimlet npm package for generating Solana Anchor programs testing input

## Overview

This package is a generator for JSON input files that are used to run programs on Agave Ledger Tool and execute specific instructions on Solana. It is designed to work with Gimlet, a framework for managing Solana programs and instructions.

## Features

- Dynamically generates instruction JSON files from JS/TS tests.
- Supports multi-program Anchor projects.
- Outputs files in a structured directory for easy integration with Gimlet and Agave Ledger Tool.

## Usage

### Example

```typescript
describe("Unit tests for your program", () => {
  it("Is initialized!", async () => {
    // Write your test case for your anchor program 

    const ix = program.methods.initialize();
    const ix_data = (await ix.instruction()).data; // .instruction() to get the right instruction data (serialized form)
    const tx = await ix.rpc();

    generateInstruction(
      program.programId.toString(),
      "initialize",
      ix_data, // This includes the (instruction discriminator + instruction_data(parameters to a function))
      [
        { key: provider.publicKey.toString(), is_signer: true, is_writable: true },
        { key: anchor.web3.SystemProgram.programId.toString(), is_signer: false, is_writable: false }
      ]
    );
  });
});
```

This will save the JSON input file in `input/instruction_name.json`. by default.

### If you have a multi-program anchor project:

```typescript
generateInstruction(
      program.programId.toString(),
      "initialize",
      ix_data, // This includes the (instruction discriminator + instruction_data(parameters to a function))
      [
        { key: provider.publicKey.toString(), is_signer: true, is_writable: true },
        { key: anchor.web3.SystemProgram.programId.toString(), is_signer: false, is_writable: false }
      ],
      "your_program_name"
    );
```

This will save the JSON input file in `input/your_program_name/instruction_name.json`.

## How it relates to Gimlet
- Gimlet needs and JSON file for the instruction you want to debug in order to feed it to `agave-ledger-tool`.
- Gimlet uses it to run the program in mocked environment and execute the specific instruction you want to debug.
- This package gives the user the possibility to generate that file from his tests.

## Functions

### `generateInstruction`

Generates a Solana instruction JSON file.

**Parameters:**
- `programId`: Public key of the Solana program.
- `instructionName`: Name of the instruction.
- `instructionData`: Buffer containing instruction parameters.
- `accounts`: Array of `Account` objects.
- `programName`: (Optional) Name of the program for multi-program projects.

### `Account` Type

```typescript
type Account = {
  key: string;
  is_signer: boolean;
  is_writable: boolean;
}
```

## Installation

```sh
npm gimlet-anchor-instruction-input-generator
```
