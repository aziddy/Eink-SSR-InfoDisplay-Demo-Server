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
import { templateReactWrapper_2 } from './util-react-wrappers'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const router = express.Router()

type CalendarEvent = {
    title: string
    description: string
    date: string
}

type Calendar = {
    title: string
    description: string
    events: CalendarEvent[]
}

type LiquidTemplate = {
    liquidTemplate: string
    createdAt: string
    updatedAt: string
}

const demoLiquidTemplateData: Record<number, LiquidTemplate> = {
    3749387394: {
        liquidTemplate: `
            {% for event in events %}
                <div style="background-color: cyan; width: 100%; display: flex; flex-direction: column; margin-bottom: 5px; border-radius: 10px; padding: 10px;">
                    <div>{{ event.title }}</div>
                    <div>{{ event.description }}</div>
                    <div>{{ event.date }}</div>
                </div>
            {% endfor %}    
        `,
        createdAt: '2024-01-01',
        updatedAt: '2025-01-01',
    }
}

const demoCalendarDataTable: Record<number, Calendar> = {
    42069: {
        title: 'Alex\'s Calendar',
        description: 'This is Alex\'s demo calendar',
        events: [
            {
                title: 'Event 1',
                description: 'This is the first event',
                date: '2024-01-01',
            },
            {
                title: 'Event 2',
                description: 'This is the second event',
                date: '2024-01-02',
            },
            {
                title: 'Event 3',
                description: 'This is the third event',
                date: '2024-01-03',
            },
        ],
    }
}

// 
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


router.post('/demo', async (req, res) => {
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
        const componentToRenderAsImage = templateReactWrapper_2(reactElement);

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
        res.send(Buffer.from(buffer))
    } catch (error) {
        console.error('Error generating image:', error)
        res.status(500).json({ error: 'Failed to generate image' })
    }
})

export default router