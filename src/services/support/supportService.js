import { MOCK_SUPPORT_TICKETS } from '../../data/mockData';

let currentTickets = [...MOCK_SUPPORT_TICKETS];

export const supportService = {
  async getTickets() {
    return currentTickets;
  },

  async createTicket({ title, category, priority, submittedBy }) {
    const newTicket = {
      id: `tkt_${Date.now()}`,
      title,
      category,
      priority,
      status: 'OPEN',
      submittedBy: submittedBy || 'Participant',
      timeAgo: 'Just now',
      createdAt: new Date().toISOString(),
    };
    currentTickets = [newTicket, ...currentTickets];
    return newTicket;
  },

  async updateTicketStatus(ticketId, newStatus) {
    currentTickets = currentTickets.map((t) =>
      t.id === ticketId ? { ...t, status: newStatus } : t
    );
    return true;
  }
};
