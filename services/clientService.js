// ============================================
// Review Funnel SaaS — Client Service
// ============================================

const clients = require('../config/clients');

/**
 * Look up a client by ID.
 * @param {string} clientId
 * @returns {Object|null}
 */
function getClient(clientId) {
  return clients.get(clientId) || null;
}

/**
 * Return all registered clients.
 * @returns {Object[]}
 */
function getAllClients() {
  return Array.from(clients.values());
}

module.exports = { getClient, getAllClients };
