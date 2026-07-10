/**
 * src/api/crmAPI.js
 * Backend returns: { success: true, data: <row or rows> }
 * We reshape to named keys so CRM.jsx can use res.lead, res.leads, etc.
 */

import { CRM_API_BASE_URL } from './config';

const BASE = CRM_API_BASE_URL;

function authHeaders() {
  const token = localStorage.getItem('manod_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: authHeaders(),
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}
// Reshape list response  â†’ { [key]: [] }
// Reshape list response  â†’ { [key]: [] }
const list = (key) => async (method, path, body) => {
  const res = await request(method, path, body);
  const arr = res[key] || res.data || [];
  return { [key]: Array.isArray(arr) ? arr : [] };
};

// Reshape single response â†’ { [key]: {} }
const one = (key) => async (method, path, body) => {
  const res = await request(method, path, body);
  const item = res[key] || res.data;
  return { [key]: Array.isArray(item) ? item[0] : item };
};

// â”€â”€ Dashboard â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const fetchCRMStats = () => request('GET', '/dashboard/stats');

// â”€â”€ Leads â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const fetchLeads    = (p = {}) => list('leads')('GET', `/leads?${new URLSearchParams(p)}`);
export const fetchLeadById = (id)     => one('lead')('GET', `/leads/${id}`);
export const createLead    = async (body) => {
  const res = await request('POST', '/leads', body);
  const item = res.lead || res.data;
  return { lead: Array.isArray(item) ? item[0] : item, automation: res.automation };
};
export const updateLead    = (id, b)  => one('lead')('PUT', `/leads/${id}`, b);
export const deleteLead    = (id)     => request('DELETE', `/leads/${id}`);
export const convertLead   = (id)     => one('lead')('PATCH', `/leads/${id}/convert`);
export const callLeadAi    = (id, b = {}) => request('POST', `/leads/${id}/ai-call`, b);

// â”€â”€ Follow-ups â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const fetchFollowups  = (p = {}) => list('followups')('GET', `/followups?${new URLSearchParams(p)}`);
export const createFollowup  = (body)   => one('followup')('POST', '/followups', body);
export const updateFollowup  = (id, b)  => one('followup')('PUT', `/followups/${id}`, b);
export const deleteFollowup  = (id)     => request('DELETE', `/followups/${id}`);

// â”€â”€ Campaigns â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const fetchCampaigns = (p = {}) => list('campaigns')('GET', `/campaigns?${new URLSearchParams(p)}`);
export const createCampaign = (body)   => one('campaign')('POST', '/campaigns', body);
export const sendCampaign   = (id, b)  => one('campaign')('POST', `/campaigns/${id}/send`, b);
export const deleteCampaign = (id)     => request('DELETE', `/campaigns/${id}`);
// â”€â”€ Proposals â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const fetchProposals  = (p = {}) => list('proposals')('GET', `/proposals?${new URLSearchParams(p)}`);
export const createProposal  = (body)   => one('proposal')('POST', '/proposals', body);
export const updateProposal  = (id, b)  => one('proposal')('PUT', `/proposals/${id}`, b);
export const sendProposal    = (id)     => one('proposal')('POST', `/proposals/${id}/send`);
export const deleteProposal  = (id)     => request('DELETE', `/proposals/${id}`);

// â”€â”€ Templates â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const fetchTemplates = (p = {}) => list('templates')('GET', `/templates?${new URLSearchParams(p)}`);
export const createTemplate = (body)   => one('template')('POST', '/templates', body);
export const updateTemplate = (id, b)  => one('template')('PUT', `/templates/${id}`, b);
export const deleteTemplate = (id)     => request('DELETE', `/templates/${id}`);

// â”€â”€ Contacts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const fetchContacts = (p = {}) => list('contacts')('GET', `/contacts?${new URLSearchParams(p)}`);
export const createContact = (body)   => one('contact')('POST', '/contacts', body);
export const updateContact = (id, b)  => one('contact')('PUT', `/contacts/${id}`, b);
export const deleteContact = (id)     => request('DELETE', `/contacts/${id}`);



// Customer Success
export const fetchCustomerSuccess = (p = {}) => list('customerSuccess')('GET', `/customer-success?${new URLSearchParams(p)}`);
export const updateCustomerSuccess = (id, b) => one('customerSuccess')('PUT', `/customer-success/${id}`, b);
export const createCustomerSuccessFromLead = (leadId) => one('customerSuccess')('POST', `/customer-success/from-lead/${leadId}`);


// Payment Reminders
export const fetchPaymentReminders = (p = {}) => list('paymentReminders')('GET', `/payment-reminders?${new URLSearchParams(p)}`);
export const updatePaymentReminder = (id, b) => one('paymentReminder')('PUT', `/payment-reminders/${id}`, b);


