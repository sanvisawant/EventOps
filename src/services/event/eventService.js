import { MOCK_EVENT, MOCK_SCHEDULE } from '../../data/mockData';

export const eventService = {
  async getEventDetails() {
    return MOCK_EVENT;
  },

  async getSchedule() {
    return MOCK_SCHEDULE;
  }
};
