import { apiClient } from '../../services/apiClient.js';

/**
 * @param {{ query: string, userId: string, role: string }} params
 * @returns {Promise<import('./ask.types.js').AskResponse>}
 */
export async function sendAskQuery({ query, userId, role }) {
  return apiClient.post('/ask', { query, userId, role });
}
