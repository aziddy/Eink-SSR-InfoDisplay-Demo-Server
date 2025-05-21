/**
 * Converts an RGBA 8-bit image to a 4-bit grayscale image.
 * @param rgba8BitImage - Input Uint8Array containing RGBA data. Must be at least EPD_WIDTH * EPD_HEIGHT * 4 bytes = 2,073,600 B = 2,073.6 kB = 2.025 MB
 * @param EINK_WIDTH - Width of the E-Paper Display in pixels
 * @param EINK_HEIGHT - Height of the E-Paper Display in pixels
 * @returns Uint8Array containing the grayscale data, EPD_WIDTH * EPD_HEIGHT / 2 bytes =  259,200bytes
 */

export function convertRGBA8BitImageTo4BitGrayscaleImage(
    rgba8BitImage: Uint8Array,
    EINK_WIDTH: number,
    EINK_HEIGHT: number
): Uint8Array {
    // Create output buffer for grayscale data
    const grayscaleImage = new Uint8Array(Math.ceil((EINK_WIDTH * EINK_HEIGHT) / 2));

    for (let i = 0; i < EINK_WIDTH * EINK_HEIGHT; i += 2) {
        // Convert first pixel to 4-bit grayscale (0-15), considering alpha
        const alpha1 = rgba8BitImage[i * 4 + 3] / 255.0;
        const gray1 = Math.floor(
            ((rgba8BitImage[i * 4] + rgba8BitImage[i * 4 + 1] + rgba8BitImage[i * 4 + 2]) * alpha1) / (3 * 16)
        );

        // Convert second pixel to 4-bit grayscale (0-15), considering alpha
        const alpha2 = rgba8BitImage[(i + 1) * 4 + 3] / 255.0;
        const gray2 = Math.floor(
            ((rgba8BitImage[(i + 1) * 4] + rgba8BitImage[(i + 1) * 4 + 1] + rgba8BitImage[(i + 1) * 4 + 2]) * alpha2) / (3 * 16)
        );

        // Pack two 4-bit values into one byte (first pixel in high nibble, second in low nibble)
        grayscaleImage[Math.floor(i / 2)] = (gray1 << 4) | gray2;
    }

    return grayscaleImage;
}