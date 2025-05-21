


import express from 'express'
import cors from 'cors'
import { ImageResponse } from '@vercel/og'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { Parser as HtmlToReactParser } from 'html-to-react'
import { Liquid } from 'liquidjs'
import path from 'path'
import { templateReactWrapper_demo1 } from './demo-util-react-wrappers'
import { isNetworkAccessEnabled, printExternalNetworkIPs } from '../../src/utils/localNetworkUtil'
import {
    CalendarType, DemoLiquidTemplateType,
    demoCheckJWT, demoGetCalendarData, demoGetLiquidTemplate
} from './demoDummyLogic'

const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
    try {
        const user = demoCheckJWT(req.headers.authorization)
        const userCalendarData: CalendarType = demoGetCalendarData(user.userid)
        const liquidTemplateData: DemoLiquidTemplateType = demoGetLiquidTemplate(req.body.templateId as string)


        const liquidTemplate = liquidTemplateData.liquidTemplate

        const liquidVariables = {
            events: userCalendarData.events,
        }

        const liquid = new Liquid();

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
            width: 960,
            height: 540,
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


const host = isNetworkAccessEnabled ? '0.0.0.0' : 'localhost';

app.listen(port, host, () => {
    console.log('\n🚀 Server is running!')
    console.log(`\nLocal: http://localhost:${port}`)

    if (isNetworkAccessEnabled) {
        printExternalNetworkIPs(port)
    }
    console.log('\n');
}) 