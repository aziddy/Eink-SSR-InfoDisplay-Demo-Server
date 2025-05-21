import { Liquid } from "liquidjs";
import { ReactElement } from "react";
import { Parser as HtmlToReactParser } from 'html-to-react'
import { ImageResponse } from '@vercel/og'

export async function generateImage(
    width: number = 960,
    height: number = 540,
    liquidTemplate: string,
    liquidVariables: Record<string, any>,
    templateReactWrapperFunction: (reactElement: ReactElement) => JSX.Element
): Promise<ArrayBuffer> {
    const liquid = new Liquid()

    // Liquid automatically escapes variables by default
    // it automatically HTML-escapes the content to prevent XSS
    const renderedLiquidTemplate = await liquid.parseAndRender(liquidTemplate, liquidVariables)

    // Parse HTML to React elements
    // @ts-ignore
    const htmlToReactParser = new HtmlToReactParser()
    const reactElement = htmlToReactParser.parse(renderedLiquidTemplate)

    // Create the OG image using JSX
    const componentToRenderAsImage = templateReactWrapperFunction(reactElement);

    // Image returned in a 
    const generatedImage = new ImageResponse(componentToRenderAsImage, {
        width: width,
        height: height,
        debug: false,
        emoji: 'twemoji',
    })

    // Get the image data as an ArrayBuffer, in encoded PNG format
    return generatedImage.arrayBuffer()
}