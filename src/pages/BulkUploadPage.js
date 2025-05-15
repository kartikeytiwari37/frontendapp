import React, { useState } from 'react';
import { Card, Form, Button, Alert, Spinner, Tabs, Tab } from 'react-bootstrap';
import { uploadCVs, uploadCandidates, downloadCsvTemplate } from '../services/api';

const BulkUploadPage = () => {
  const [activeTab, setActiveTab] = useState('candidates');
  const [candidateFiles, setCandidateFiles] = useState(null);
  const [cvFiles, setCvFiles] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCandidateFileChange = (e) => {
    setCandidateFiles(e.target.files[0]);
    setError('');
    setSuccess('');
  };

  const handleCvFilesChange = (e) => {
    setCvFiles(e.target.files);
    setError('');
    setSuccess('');
  };

  const handleCandidateUpload = async (e) => {
    e.preventDefault();
    
    if (!candidateFiles) {
      setError('Please select a CSV file to upload');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const formData = new FormData();
      formData.append('file', candidateFiles);
      
      const response = await uploadCandidates(formData);
      
      setSuccess(`Successfully uploaded ${response.data.candidates.length} candidates`);
      setCandidateFiles(null);
      setLoading(false);
      
      // Reset file input
      document.getElementById('candidateFileInput').value = '';
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload candidates. Please try again.');
      setLoading(false);
    }
  };

  const handleCvUpload = async (e) => {
    e.preventDefault();
    
    if (!cvFiles || cvFiles.length === 0) {
      setError('Please select at least one CV file to upload');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const formData = new FormData();
      for (let i = 0; i < cvFiles.length; i++) {
        formData.append('files', cvFiles[i]);
      }
      
      const response = await uploadCVs(formData);
      
      setSuccess(`Successfully uploaded ${response.data.files.length} CV files`);
      setCvFiles(null);
      setLoading(false);
      
      // Reset file input
      document.getElementById('cvFileInput').value = '';
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload CV files. Please try again.');
      setLoading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await downloadCsvTemplate();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'candidate_template.csv';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError('Failed to download template. Please try again.');
    }
  };

  return (
    <div>
      <h1 className="mb-4">Bulk Upload</h1>
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
      >
        <Tab eventKey="candidates" title="Upload Candidates">
          <Card>
            <Card.Header>Bulk Candidate Upload</Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              <p>
                Upload a CSV file containing candidate information. The CSV should have the following columns:
                Name, Location, Product, Designation, Phone Number, CV
              </p>
              
              <Button 
                variant="outline-secondary" 
                onClick={handleDownloadTemplate}
                className="mb-3"
              >
                Download CSV Template
              </Button>
              
              <Form onSubmit={handleCandidateUpload}>
                <Form.Group className="mb-3">
                  <Form.Label>CSV File</Form.Label>
                  <Form.Control
                    type="file"
                    id="candidateFileInput"
                    accept=".csv"
                    onChange={handleCandidateFileChange}
                    required
                  />
                  <Form.Text className="text-muted">
                    Select a CSV file with candidate information
                  </Form.Text>
                </Form.Group>
                
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="ms-2">Uploading...</span>
                    </>
                  ) : (
                    'Upload Candidates'
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="cvs" title="Upload CVs">
          <Card>
            <Card.Header>Bulk CV Upload</Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              <p>
                Upload multiple CV files (PDF or Word documents). These will be stored in S3 and can be referenced in the candidate CSV.
              </p>
              
              <Form onSubmit={handleCvUpload}>
                <Form.Group className="mb-3">
                  <Form.Label>CV Files</Form.Label>
                  <Form.Control
                    type="file"
                    id="cvFileInput"
                    accept=".pdf,.doc,.docx"
                    multiple
                    onChange={handleCvFilesChange}
                    required
                  />
                  <Form.Text className="text-muted">
                    Select one or more CV files (PDF or Word documents)
                  </Form.Text>
                </Form.Group>
                
                <Button variant="primary" type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                      <span className="ms-2">Uploading...</span>
                    </>
                  ) : (
                    'Upload CVs'
                  )}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default BulkUploadPage;
