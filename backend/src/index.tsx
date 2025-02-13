import express from 'express'
import cors from 'cors'
import { ImageResponse } from '@vercel/og'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import React from 'react'
import { Parser as HtmlToReactParser } from 'html-to-react'
import type { Parser } from 'html-to-react'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

// Example JSON: { 
//   "template": "<div style=\"color: {{textColor}}\">Hello {{name}}</div><div style=\"background-color: {{bgColor}};color: blue; padding: 10px; border-radius: 25px;\">{{message}}</div>",
//   "variables": {
//     "textColor": "blue",
//     "name": "World",
//     "bgColor": "lightgrey",
//     "message": "Welcome!"
//   }
// }
app.post('/api/generate', async (req, res) => {
  try {
    const { template, variables = {} } = req.body

    if (!template) {
      return res.status(400).json({ error: 'Template is required' })
    }

    // Replace variables in the template
    let processedTemplate = template
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
      processedTemplate = processedTemplate.replace(regex, String(value))
    })

    // Parse HTML to React elements
    // @ts-ignore
    const htmlToReactParser = new HtmlToReactParser()
    const reactElement = htmlToReactParser.parse(processedTemplate)

    // Create the OG image using JSX
    const element = (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          position: 'relative',
          filter: 'grayscale(100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            fontSize: 60,
            fontWeight: 700,
            fontFamily: 'Inter',
            background: 'white',
            color: 'black',
            width: '100%',
            height: '100%',
            padding: '20px 50px',
            lineHeight: 1.4,
            whiteSpace: 'pre-wrap',
          }}
        >
          {reactElement}
        </div>
      </div>
    )

    const imageResponse = new ImageResponse(element, {
      width: 1000,
      height: 430,
      debug: false,
      emoji: 'twemoji',
    })

    // Get the image buffer
    const buffer = await imageResponse.arrayBuffer()

    // Set the appropriate headers
    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable')

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