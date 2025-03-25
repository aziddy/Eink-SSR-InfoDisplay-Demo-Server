export type CalendarEvent = {
    title: string
    description: string
    date: string
}

export type Calendar = {
    title: string
    description: string
    events: CalendarEvent[]
}

export type LiquidTemplate = {
    liquidTemplate: string
    createdAt: string
    updatedAt: string
}


export const demoLiquidTemplateData: Record<number, LiquidTemplate> = {
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

export const demoCalendarDataTable: Record<number, Calendar> = {
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




