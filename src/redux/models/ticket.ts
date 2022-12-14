export type Ticket = {
    title: string,
    description: string,
    approvedBy: { employeeId: string } | null,
    category: { id: string },
    priority: { id: string },
    ticketType: { id: string },
    duration: string,
    accessType: string | null,
    facingIssue: string | null,
    startDate?: string | null,
    endDate?: string | null,
    nonPreApprovedSoftware: Array<object>
}

export interface ITicket {
    tickets: Ticket,
    selectedSoftwares: { preApprovedSoftware: Array<string> },
    images: Array<string>
}