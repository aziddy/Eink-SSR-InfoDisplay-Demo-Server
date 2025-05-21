import request from 'supertest';
import express from 'express';
import { jest } from '@jest/globals';
import { generateImage } from '../generateImage';
import { convertRGBA8BitImageTo4BitGrayscaleImage } from '../utils/imageConvertPngTo4Bit';

const exampleEinkDisplayWidth = 960;
const exampleEinkDisplayHeight = 540;

describe('imageConvertPngTo4Bit', () => {
    it('should convert a PNG image to a 4-bit grayscale image (2pixels in 1byte)', () => {

        const expectedOutputImageBytesAmount = Math.ceil((exampleEinkDisplayWidth * exampleEinkDisplayHeight) / 2);

        const rgba8BitImage = new Uint8Array(exampleEinkDisplayWidth * exampleEinkDisplayHeight * 4); // 2,073,600 B = 2,073.6 kB = 2.025 MB
        const grayscaleImage = convertRGBA8BitImageTo4BitGrayscaleImage(rgba8BitImage, exampleEinkDisplayWidth, exampleEinkDisplayHeight);

        expect(grayscaleImage.length).toBe(expectedOutputImageBytesAmount);
    });
});
