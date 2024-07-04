/**
 * Converts a `Uint8Array` into a hexadecimal string.
 *
 * @param bytes The `Uint8Array` to convert.
 * @returns A string representing the hexadecimal of `bytes`.
 */
export const toHex = (bytes: Uint8Array): string => Buffer.from(bytes).toString('hex');
