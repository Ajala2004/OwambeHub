export interface Event {
  id: string
  name: string
  description: string
  date: string
  closingDate: string
  price: number
  isFree: boolean
  location: string
  category: string
  imageUrl: string
  maxAttendees: number
  currentAttendees: number
  organizer: string
}

export interface Ticket {
  id: string
  eventId: string
  eventName: string
  eventDate: string
  eventLocation: string
  ticketNumber: number
  qrCode: string
  purchaseDate: string
  attendeeName: string
  attendeeEmail: string
}
