import express from 'express'
import cors from 'cors'
import { templateReactWrapper_1 } from './util-react-wrappers'
import { generateImage } from './generateImage'

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())


app.post('/api/generate/from-req-unsafe', async (req, res) => {
    try {
        const { template, variables = {} } = req.body

        if (!template) {
            return res.status(400).json({ error: 'Template is required' })
        }

        const imageBuffer = await generateImage(template, variables, templateReactWrapper_1)

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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
}) 