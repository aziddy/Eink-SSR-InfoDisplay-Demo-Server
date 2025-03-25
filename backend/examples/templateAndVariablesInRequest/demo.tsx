import express from 'express'
import cors from 'cors'
import { ImageResponse } from '@vercel/og'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import React from 'react'
import { Parser as HtmlToReactParser } from 'html-to-react'
import type { Parser } from 'html-to-react'
import { Liquid } from 'liquidjs'
import path from 'path'
import { templateReactWrapper_demo2 } from './demo-util-react-wrappers'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())


app.post('/', async (req, res) => {
    try {
        const { template, variables = {} } = req.body

        if (!template) {
            return res.status(400).json({ error: 'Template is required' })
        }

        const liquid = new Liquid()

        // Liquid automatically escapes variables by default
        // it automatically HTML-escapes the content to prevent XSS
        const renderedLiquidTemplate = await liquid.parseAndRender(template, variables)

        // Parse HTML to React elements
        // @ts-ignore
        const htmlToReactParser = new HtmlToReactParser()
        const reactElement = htmlToReactParser.parse(renderedLiquidTemplate)

        // Create the OG image using JSX
        const componentToRenderAsImage = templateReactWrapper_demo2(reactElement);

        const generatedImage = new ImageResponse(componentToRenderAsImage, {
            width: 1000,
            height: 430,
            debug: false,
            emoji: 'twemoji',
        })

        // Get the image buffer
        const buffer = await generatedImage.arrayBuffer()

        // Set the appropriate headers
        res.setHeader('Content-Type', 'image/png')
        res.setHeader('Cache-Control', 'public, max-age=86400, immutable')

        console.log('Sending image!')
        // Send the image buffer
        res.send(Buffer.from(buffer))
    } catch (error) {
        console.error('Error generating image:', error)
        res.status(500).json({ error: 'Failed to generate image' })
    }
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
}) 