
/**
 * Represents an account required for a Solana instruction.
 *
 * @property key - The public key of the account as a string.
 * @property is_signer - Indicates if the account must sign the transaction.
 * @property is_writable - Indicates if the account can be modified by the instruction.
 *
 * @example
 * const account: Account = {
 *   key: "AccountPublicKeyHere",
 *   is_signer: true,
 *   is_writable: false
 * };
 */
export type Account = {
  key: string;
  is_signer: boolean;
  is_writable: boolean;
}