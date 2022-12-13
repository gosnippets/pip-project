export type Ticket = {
    title: string,
    description: string,
    approvedBy: { id: string },
    category: { id: string },
    priority: { id: string },
    ticketType: { id: string },
    duration: string,
    startDate?: string | null,
    endDate?: string | null
}

export interface ITicket {
    tickets: Ticket,
    selectedSoftwares: { preApprovedSoftware: Array<string> },
    images: Array<string>
}