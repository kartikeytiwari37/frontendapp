import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Row, Col, Button, Alert, Spinner, Tabs, Tab } from 'react-bootstrap';
import { getTranscript, getAnalysis, downloadFile } from '../services/api';

const InterviewDetailPage = () => {
  const { callSid } = useParams();
  const [interview, setInterview] = useState({
    transcript: null,
    analysis: null
  });
  const [loading, setLoading] = useState({
    transcript: true,
    analysis: true
  });
  const [error, setError] = useState({
    transcript: '',
    analysis: ''
  });
  const [activeTab, setActiveTab] = useState('transcript');

  useEffect(() => {
    fetchTranscript();
    fetchAnalysis();
  }, [callSid]);

  const fetchTranscript = async () => {
    try {
      setLoading(prev => ({ ...prev, transcript: true }));
      setError(prev => ({ ...prev, transcript: '' }));
      
      const response = await getTranscript(callSid);
      
      setInterview(prev => ({ ...prev, transcript: response.data }));
      setLoading(prev => ({ ...prev, transcript: false }));
    } catch (err) {
      setError(prev => ({ ...prev, transcript: 'Failed to fetch transcript. Please try again.' }));
      setLoading(prev => ({ ...prev, transcript: false }));
    }
  };

  const fetchAnalysis = async () => {
    try {
      setLoading(prev => ({ ...prev, analysis: true }));
      setError(prev => ({ ...prev, analysis: '' }));
      
      const response = await getAnalysis(callSid);
      
      setInterview(prev => ({ ...prev, analysis: response.data }));
      setLoading(prev => ({ ...prev, analysis: false }));
    } catch (err) {
      setError(prev => ({ ...prev, analysis: 'Failed to fetch analysis. Please try again.' }));
      setLoading(prev => ({ ...prev, analysis: false }));
    }
  };

  const handleDownload = async (type) => {
    try {
      const blob = await downloadFile(callSid, type);
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${callSid}_${type}.txt`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(prev => ({ ...prev, [type]: `Failed to download ${type}. Please try again.` }));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Interview Details</h1>
        <Link to="/interviews" className="btn btn-secondary">
          Back to Interviews
        </Link>
      </div>
      
      <Card className="mb-4">
        <Card.Header>
          <h4 className="mb-0">Call Information</h4>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={12}>
              <div className="mb-3">
                <strong>Call SID:</strong> {callSid}
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
      >
        <Tab eventKey="transcript" title="Transcript">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Transcript</h4>
              {!loading.transcript && interview.transcript && (
                <Button 
                  variant="outline-primary" 
                  onClick={() => handleDownload('transcript')}
                >
                  Download Transcript
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              {loading.transcript ? (
                <div className="text-center my-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : error.transcript ? (
                <Alert variant="danger">{error.transcript}</Alert>
              ) : !interview.transcript ? (
                <Alert variant="info">No transcript available for this call.</Alert>
              ) : (
                <div className="transcript-content">
                  <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                    {interview.transcript}
                  </pre>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab eventKey="analysis" title="Analysis">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Analysis</h4>
              {!loading.analysis && interview.analysis && (
                <Button 
                  variant="outline-primary" 
                  onClick={() => handleDownload('analysis')}
                >
                  Download Analysis
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              {loading.analysis ? (
                <div className="text-center my-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : error.analysis ? (
                <Alert variant="danger">{error.analysis}</Alert>
              ) : !interview.analysis ? (
                <Alert variant="info">No analysis available for this call.</Alert>
              ) : (
                <div className="analysis-content">
                  <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                    {interview.analysis}
                  </pre>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default InterviewDetailPage;
