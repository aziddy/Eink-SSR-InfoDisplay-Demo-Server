import express from 'express'
import cors from 'cors'
import {
    templateReactWrapper_1, templateReactWrapper_2,
    templateReactWrapper_Rotated90
} from './util-react-wrappers'
import { generateImage } from './generateImage'
import { isNetworkAccessEnabled, printExternalNetworkIPs } from './utils/localNetworkUtil'
import { convertRGBA8BitImageTo4BitGrayscaleImage } from './utils/imageConvertPngTo4Bit'
import { decodePNGToRawRGBA } from './utils/decodePNGToRawRGBA'
import { decodePNGtoRaw_ConvertTo4BitGrayscale } from './imageResponseDataSelector'

const app = express()
const port = 3000


app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
    try {
        const liquidTemplate = "<div style=\"color: {{textColor}}\">Hello {{name}}</div><div style=\"background-color: {{bgColor}};padding: 10px;\">{{message}}</div>"

        const liquidVariables = {
            "textColor": "red",
            "name": "Bob",
            "bgColor": "lightgrey",
            "message": "Welcome to our website!"
        }

        const imageBuffer = await generateImage(960, 540, liquidTemplate, liquidVariables, templateReactWrapper_2)

        // Set the appropriate headers
        res.setHeader('Content-Type', 'image/png')
        res.setHeader('Cache-Control', 'public, max-age=86400, immutable')

        // Send the image buffer
        res.send(Buffer.from(imageBuffer))
    } catch (error) {
        console.error('Error generating image:', error)
        res.status(500).json({ error: 'Failed to generate image' })
    }
})

app.get('/4bit', async (req, res) => {
    try {
        const liquidTemplate = "<div style=\"color: {{textColor}}\">Hello {{name}}</div><div style=\"background-color: {{bgColor}};padding: 10px;\">{{message}}</div>"

        const liquidVariables = {
            "textColor": "red",
            "name": "Boberson",
            "bgColor": "lightgrey",
            "message": "Welcome to our Tower!"
        }

        // Generate PNG image
        const pngBuffer = await generateImage(960, 540, liquidTemplate, liquidVariables, templateReactWrapper_Rotated90)

        // Define E-ink display dimensions
        const EINK_WIDTH = 960;
        const EINK_HEIGHT = 540;

        // Decode PNG to Raw RGBA Array
        const rgbaPixels = await decodePNGToRawRGBA(pngBuffer, EINK_WIDTH, EINK_HEIGHT);

        // Convert RGBA to 4-bit grayscale
        const grayscaleImage = convertRGBA8BitImageTo4BitGrayscaleImage(rgbaPixels, EINK_WIDTH, EINK_HEIGHT);

        console.log("4-bit image buffer length:", grayscaleImage.byteLength);

        // Set the appropriate headers
        res.setHeader('Content-Type', 'application/octet-stream')

        // Send the 4-bit grayscale buffer
        res.send(Buffer.from(grayscaleImage))
    } catch (error) {
        console.error('Error generating 4-bit image:', error)
        res.status(500).json({ error: 'Failed to generate 4-bit image' })
    }
})

app.get('/4bitsss', async (req, res) => {
    const { imageResponseFormat, screenWidth, screenHeight, rotate90 } = req.query;

    if (imageResponseFormat && (!screenWidth && !screenHeight)) {
        return res.status(400).json({ error: 'Missing required parameters' });
    }

    const imageResponseFormatValue = imageResponseFormat as string;
    const screenWidthValue = screenWidth ? parseInt(screenWidth as string) : 960;
    const screenHeightValue = screenHeight ? parseInt(screenHeight as string) : 540;

    const imgRspFormatIs4bit = imageResponseFormatValue === '4bit';

    try {
        const liquidTemplate = "<div style=\"color: {{textColor}}\">Hello {{name}}</div><div style=\"background-color: {{bgColor}};padding: 10px;\">{{message}}</div>"

        const liquidVariables = {
            "textColor": "red",
            "name": "Bobsss",
            "bgColor": "lightgrey",
            "message": "Welcome to our website!"
        }

        // Generate PNG image
        const pngEncodedBuffer = await generateImage(960, 540, liquidTemplate, liquidVariables, templateReactWrapper_1)

        const finalResponse = imgRspFormatIs4bit ? await decodePNGtoRaw_ConvertTo4BitGrayscale(pngEncodedBuffer, screenWidthValue, screenHeightValue) : pngEncodedBuffer;

        // Set the appropriate headers
        res.setHeader('Content-Type', imgRspFormatIs4bit ? 'application/octet-stream' : 'image/png')

        // Respond with image buffer (either encoded PNG binary or raw 4-bit grayscale binary)
        res.send(Buffer.from(finalResponse))
    } catch (error) {
        console.error('Error generating image:', error)
        res.status(500).json({ error: 'Failed to generate image' })
    }
})

app.post('/api/generate/from-req-unsafe', async (req, res) => {
    try {
        const { template, variables = {} } = req.body

        if (!template) {
            return res.status(400).json({ error: 'Template is required' })
        }

        const imageBuffer = await generateImage(960, 540, template, variables, templateReactWrapper_1)

        // Set the appropriate headers
        res.setHeader('Content-Type', 'image/png')
        res.setHeader('Cache-Control', 'public, max-age=86400, immutable')

        // Send the image buffer
        res.send(Buffer.from(imageBuffer))
    } catch (error) {
        console.error('Error generating image:', error)
        res.status(500).json({ error: 'Failed to generate image' })
    }
})


const host = isNetworkAccessEnabled ? '0.0.0.0' : 'localhost';

app.listen(port, host, () => {
    console.log('\n🚀 Server is running!')
    console.log(`\nLocal: http://localhost:${port}`)

    if (isNetworkAccessEnabled) {
        printExternalNetworkIPs(port)
    }
    console.log('\n');
}) 