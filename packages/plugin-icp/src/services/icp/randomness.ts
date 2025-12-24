import crypto from 'crypto';

/**
 * Utilities for working with ICP raw_rand output
 * 
 * ICP's raw_rand returns 32 cryptographically secure bytes.
 * These utilities help expand that seed for various use cases.
 */

/**
 * Expand raw_rand seed into multiple random bytes using HKDF
 */
export function expandSeed(seed: Uint8Array, outputLength: number, info: string = ''): Buffer {
    if (seed.length !== 32) {
        throw new Error('Seed must be 32 bytes from raw_rand');
    }

    // Use HKDF (HMAC-based Key Derivation Function) to expand seed
    const salt = Buffer.from('icp-plugin-randomness');
    const infoBuffer = Buffer.from(info);

    return crypto.hkdfSync(
        'sha256',
        seed,
        salt,
        infoBuffer,
        outputLength
    );
}

/**
 * Generate a deterministic UUID from seed
 */
export function seedToUUID(seed: Uint8Array): string {
    const hash = crypto.createHash('sha256').update(seed).digest();

    // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
    const uuid = [
        hash.slice(0, 4).toString('hex'),
        hash.slice(4, 6).toString('hex'),
        '4' + hash.slice(6, 8).toString('hex').slice(1), // Version 4
        ((hash[8] & 0x3f) | 0x80).toString(16) + hash.slice(9, 10).toString('hex'),
        hash.slice(10, 16).toString('hex'),
    ].join('-');

    return uuid;
}

/**
 * Fisher-Yates shuffle using deterministic randomness from seed
 */
export function deterministicShuffle<T>(array: T[], seed: Uint8Array): T[] {
    const result = [...array];
    const randomBytes = expandSeed(seed, array.length * 4, 'shuffle');

    for (let i = result.length - 1; i > 0; i--) {
        // Get deterministic random index
        const randomValue = randomBytes.readUInt32BE(i * 4);
        const j = randomValue % (i + 1);

        // Swap
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

/**
 * Generate random integer in range [min, max) from seed
 */
export function randomIntInRange(seed: Uint8Array, min: number, max: number, index: number = 0): number {
    if (min >= max) {
        throw new Error('min must be less than max');
    }

    const expanded = expandSeed(seed, 8, `int-${index}`);
    const randomValue = expanded.readBigUInt64BE(0);
    const range = BigInt(max - min);
    const result = Number(randomValue % range) + min;

    return result;
}

/**
 * Verify raw_rand output (32 bytes)
 */
export function isValidRawRandSeed(seed: unknown): seed is Uint8Array {
    return seed instanceof Uint8Array && seed.length === 32;
}

/**
 * Convert seed to hex string for storage/display
 */
export function seedToHex(seed: Uint8Array): string {
    return Buffer.from(seed).toString('hex');
}

/**
 * Parse hex string back to seed
 */
export function hexToSeed(hex: string): Uint8Array {
    if (hex.length !== 64) {
        throw new Error('Hex string must be 64 characters (32 bytes)');
    }
    return Uint8Array.from(Buffer.from(hex, 'hex'));
}

/**
 * Hash seed for public verification (don't expose raw seed)
 */
export function hashSeed(seed: Uint8Array): string {
    return crypto.createHash('sha256').update(seed).digest('hex');
}
