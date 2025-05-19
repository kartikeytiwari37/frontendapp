import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Persona Management APIs
export const getPersonas = () => api.get('/api/personas');
export const setPersona = (personaData) => api.post('/api/set-persona', personaData);

// Call Management APIs
export const getPhoneNumbers = () => api.get('/api/numbers');
export const initiateCall = (callData) => api.post('/api/call', callData);
export const endCall = (callSid) => api.post('/api/end-call', { callSid });
export const getTranscript = (callSid) => api.get(`/api/transcript/${callSid}`);
export const getAnalysis = (callSid) => api.get(`/api/analysis/${callSid}`);
export const downloadFile = (callSid, type) => api.get(`/api/download/${callSid}?type=${type}`, { responseType: 'blob' });
export const autoTriggerCall = () => api.post('/api/auto-trigger-call');

// Candidate Management APIs
export const uploadCVs = (formData) => {
  return api.post('/api/cv/bulk-upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const uploadCandidates = (formData) => {
  return api.post('/api/candidates/bulk-upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getBulkRecords = (status, page = 1, limit = 10) => {
  const params = { page, limit };
  if (status) params.status = status;
  return api.get('/api/bulk-records/search', { params });
};

export const getCandidateInterviews = (status, page = 1, limit = 10) => {
  const params = { page, limit };
  if (status) params.status = status;
  return api.get('/api/candidateInterviews/search', { params });
};

export const getBulkRecordById = (id) => api.get(`/api/candidates/bulk-records/${id}`);

// CSV Template
export const downloadCsvTemplate = () => {
  // Create a CSV template for bulk candidate upload with sample data
  const headers = ['Name', 'Location', 'Product', 'Designation', 'Phone Number', 'CV'];
  const sampleData = [
    'Rajan Preet,Delhi,Home loans,Sales Executive,919001378117,Ramya_V 1.pdf',
    'Rakesh Singh,Mumbai,Business loans,Sales Executive,918949950556,Smita_Kumari 1.pdf'
  ];
  const csvContent = [headers.join(','), ...sampleData].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv' });
  return Promise.resolve(blob);
};

export default api;
