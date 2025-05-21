import { decodePNGToRawRGBA } from "./utils/decodePNGToRawRGBA";
import { convertRGBA8BitImageTo4BitGrayscaleImage } from "./utils/imageConvertPngTo4Bit";

export async function decodePNGtoRaw_ConvertTo4BitGrayscale(pngEncodedBuffer: ArrayBuffer, screenWidth: number, screenHeight: number): Promise<ArrayBuffer> {

    // Define E-ink display dimensions
    const EINK_WIDTH = screenWidth;
    const EINK_HEIGHT = screenHeight;

    // Decode PNG to Raw RGBA Array
    const rawRGBAPixels = await decodePNGToRawRGBA(pngEncodedBuffer, EINK_WIDTH, EINK_HEIGHT);

    // Convert RGBA to 4-bit grayscale
    const grayscaleImage = convertRGBA8BitImageTo4BitGrayscaleImage(rawRGBAPixels, EINK_WIDTH, EINK_HEIGHT);

    console.log("4-bit image buffer length:", grayscaleImage.byteLength);

    return grayscaleImage;
}