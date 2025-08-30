import { v4 as uuidv4 } from "uuid"

export function generateTicketId(): string {
  // Generate a unique ticket ID with format: TKT-YYYYMMDD-XXXXXX
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "")
  const randomStr = uuidv4().slice(0, 6).toUpperCase()
  return `TKT-${dateStr}-${randomStr}`
}

export function generatePaymentId(): string {
  // Generate a unique payment ID with format: PAY-YYYYMMDD-XXXXXX
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "")
  const randomStr = uuidv4().slice(0, 8).toUpperCase()
  return `PAY-${dateStr}-${randomStr}`
}

export function generateTicketIds(quantity: number): string[] {
  const ticketIds: string[] = []
  for (let i = 0; i < quantity; i++) {
    ticketIds.push(generateTicketId())
  }
  return ticketIds
}
