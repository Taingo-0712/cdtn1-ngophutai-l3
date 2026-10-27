import { request } from './client';

export function getOpportunities() {
  return request('/api/opportunities');
}

export function getOpportunityById(id) {
  return request(`/api/opportunities/${id}`);
}

export function createOpportunity(data) {
  return request('/api/opportunities', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateOpportunityStage(id, stage) {
  return request(`/api/opportunities/${id}/stage`, {
    method: 'PATCH',
    body: JSON.stringify({ stage }),
  });
}

export function updateOpportunityResult(id, result, failureReason) {
  return request(`/api/opportunities/${id}/result`, {
    method: 'PATCH',
    body: JSON.stringify({
      result,
      failure_reason: failureReason
    })
  });
}
