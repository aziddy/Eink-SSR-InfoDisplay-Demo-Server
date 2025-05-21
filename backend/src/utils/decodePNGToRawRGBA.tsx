import sharp from 'sharp';

/**
 * Decodes a PNG buffer into raw RGBA pixels
 * @param pngBuffer - Input buffer containing PNG data
 * @param width - Expected width of the image
 * @param height - Expected height of the image
 * @returns Promise<Uint8Array> containing raw RGBA pixel data
 */
export async function decodePNGToRawRGBA(
    pngBuffer: ArrayBuffer,
    width: number,
    height: number
): Promise<Uint8Array> {
    // Convert ArrayBuffer to Buffer for sharp
    const buffer = Buffer.from(pngBuffer);

    // Use sharp to decode PNG and get raw pixels
    const rawPixels = await sharp(buffer)
        .raw()           // Get raw pixel data
        .ensureAlpha()   // Make sure we have alpha channel
        .toBuffer();     // Get as buffer

    // Verify dimensions
    if (rawPixels.length !== width * height * 4) {
        throw new Error(`Unexpected image dimensions. Expected ${width}x${height} but got different size`);
    }

    // Convert Buffer to Uint8Array
    return new Uint8Array(rawPixels);
}
