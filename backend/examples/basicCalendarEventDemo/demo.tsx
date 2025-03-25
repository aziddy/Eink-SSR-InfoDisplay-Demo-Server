


import express from 'express'
import cors from 'cors'
import { ImageResponse } from '@vercel/og'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { Parser as HtmlToReactParser } from 'html-to-react'
import { Liquid } from 'liquidjs'
import path from 'path'
import { templateReactWrapper_demo1 } from './demo-util-react-wrappers'

declare module 'liquidjs' {
    export default class Liquid {
        constructor(options: { root: string; extname: string })
        parseAndRender(template: string, variables: Record<string, any>): Promise<string>
    }
}

import {
    CalendarEvent, Calendar, LiquidTemplate,
    demoCalendarDataTable, demoLiquidTemplateData
} from './demoDummyLogic'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())


function demoCheckJWT(jwt: string | undefined) {
    // JWT Check Code ...
    return { userid: 42069 }
}

function demoGetCalendarData(id: number) {
    return demoCalendarDataTable[id]
}

function demoGetLiquidTemplate(id: string | undefined): LiquidTemplate {
    return demoLiquidTemplateData[3749387394]
}


app.get('/', async (req, res) => {
    try {
        const user = demoCheckJWT(req.headers.authorization)
        const userCalendarData: Calendar = demoGetCalendarData(user.userid)
        const liquidTemplateData = demoGetLiquidTemplate(req.body.templateId as string)


        const liquidTemplate = liquidTemplateData.liquidTemplate

        const liquidVariables = {
            events: userCalendarData.events,
        }

        const liquid = new Liquid({
            root: path.resolve(__dirname, 'templates'),
            extname: '.liquid',
        })

        // Liquid automatically escapes variables by default
        // it automatically HTML-escapes the content to prevent XSS
        const renderedLiquidTemplate = await liquid.parseAndRender(liquidTemplate, liquidVariables)

        // Parse HTML to React elements
        // @ts-ignore
        const htmlToReactParser = new HtmlToReactParser()
        const reactElement = htmlToReactParser.parse(renderedLiquidTemplate)

        // Create the OG image using JSX
        const componentToRenderAsImage = templateReactWrapper_demo1(reactElement);

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

        // Send the image buffer
        console.log('Sending image!')
        res.send(Buffer.from(buffer))
    } catch (error) {
        console.error('Error generating image:', error)
        res.status(500).json({ error: 'Failed to generate image' })
    }
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
}) 