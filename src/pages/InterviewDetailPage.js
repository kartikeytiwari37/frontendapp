import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Row, Col, Button, Alert, Spinner, Tabs, Tab } from 'react-bootstrap';
import { 
  getTranscript, 
  getAudioTranscript, 
  getAnalysis, 
  getAudioAnalysis, 
  downloadFile, 
  getInterviewDetails, 
  getRecordingUrl 
} from '../services/api';

const InterviewDetailPage = () => {
  const { callSid } = useParams();
  const [interview, setInterview] = useState({
    transcript: null,
    audioTranscript: null,
    analysis: null,
    audioAnalysis: null,
    details: null
  });
  const [loading, setLoading] = useState({
    transcript: true,
    audioTranscript: true,
    analysis: true,
    audioAnalysis: true,
    details: true
  });
  const [error, setError] = useState({
    transcript: '',
    audioTranscript: '',
    analysis: '',
    audioAnalysis: '',
    details: ''
  });
  const [activeTab, setActiveTab] = useState('transcript');
  const [hasRecording, setHasRecording] = useState(false);

  useEffect(() => {
    fetchTranscript();
    fetchAudioTranscript();
    fetchAnalysis();
    fetchAudioAnalysis();
    fetchInterviewDetails();
  }, [callSid]);

  const fetchAudioTranscript = async () => {
    try {
      setLoading(prev => ({ ...prev, audioTranscript: true }));
      setError(prev => ({ ...prev, audioTranscript: '' }));
      
      const response = await getAudioTranscript(callSid);
      
      setInterview(prev => ({ ...prev, audioTranscript: response.data }));
      setLoading(prev => ({ ...prev, audioTranscript: false }));
    } catch (err) {
      // Don't show error for 404 (no audio transcript yet)
      if (err.response && err.response.status === 404) {
        setInterview(prev => ({ ...prev, audioTranscript: null }));
      } else {
        setError(prev => ({ ...prev, audioTranscript: 'Failed to fetch audio transcript. Please try again.' }));
      }
      setLoading(prev => ({ ...prev, audioTranscript: false }));
    }
  };

  const fetchAudioAnalysis = async () => {
    try {
      setLoading(prev => ({ ...prev, audioAnalysis: true }));
      setError(prev => ({ ...prev, audioAnalysis: '' }));
      
      const response = await getAudioAnalysis(callSid);
      
      setInterview(prev => ({ ...prev, audioAnalysis: response.data }));
      setLoading(prev => ({ ...prev, audioAnalysis: false }));
    } catch (err) {
      // Don't show error for 404 (no audio analysis yet)
      if (err.response && err.response.status === 404) {
        setInterview(prev => ({ ...prev, audioAnalysis: null }));
      } else {
        setError(prev => ({ ...prev, audioAnalysis: 'Failed to fetch audio analysis. Please try again.' }));
      }
      setLoading(prev => ({ ...prev, audioAnalysis: false }));
    }
  };

  const fetchInterviewDetails = async () => {
    try {
      setLoading(prev => ({ ...prev, details: true }));
      setError(prev => ({ ...prev, details: '' }));
      
      const response = await getInterviewDetails(callSid);
      
      // Find the interview with matching callSid
      const interviewDetails = response.data.interviews.find(
        interview => interview.callSid === callSid
      );
      
      if (interviewDetails) {
        setInterview(prev => ({ ...prev, details: interviewDetails }));
        
        // Check if recording exists
        setHasRecording(
          interviewDetails.screeningInfo && 
          interviewDetails.screeningInfo.recordingId
        );
      }
      
      setLoading(prev => ({ ...prev, details: false }));
    } catch (err) {
      setError(prev => ({ ...prev, details: 'Failed to fetch interview details. Please try again.' }));
      setLoading(prev => ({ ...prev, details: false }));
    }
  };

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
              {!loading.details && interview.details && (
                <>
                  <div className="mb-3">
                    <strong>Candidate Name:</strong> {interview.details.candidateInfo?.name || 'Unknown'}
                  </div>
                  <div className="mb-3">
                    <strong>Phone Number:</strong> {interview.details.candidateInfo?.phoneNumber || 'Unknown'}
                  </div>
                  <div className="mb-3">
                    <strong>Status:</strong> {interview.details.status}
                  </div>
                  <div className="mb-3">
                    <strong>Date:</strong> {new Date(interview.details.createdAt).toLocaleString()}
                  </div>
                </>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3"
      >
        <Tab 
          eventKey="audioTranscript" 
          title={
            <span>
              Audio Transcript {interview.audioTranscript && <span className="text-success">✓</span>}
            </span>
          }
        >
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Audio Transcript</h4>
              {!loading.audioTranscript && interview.audioTranscript && (
                <Button 
                  variant="outline-primary" 
                  onClick={() => {
                    // Create a blob and download it
                    const blob = new Blob([interview.audioTranscript], { type: 'text/plain' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = `${callSid}_audio_transcript.txt`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                  }}
                >
                  Download Audio Transcript
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              {loading.audioTranscript ? (
                <div className="text-center my-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : error.audioTranscript ? (
                <Alert variant="danger">{error.audioTranscript}</Alert>
              ) : !interview.audioTranscript ? (
                <Alert variant="info">No audio transcript available for this call.</Alert>
              ) : (
                <div className="transcript-content">
                  <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                    {interview.audioTranscript}
                  </pre>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>
        
        <Tab 
          eventKey="audioAnalysis" 
          title={
            <span>
              Audio Analysis {interview.audioAnalysis && <span className="text-success">✓</span>}
            </span>
          }
        >
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Audio Analysis</h4>
              {!loading.audioAnalysis && interview.audioAnalysis && (
                <Button 
                  variant="outline-primary" 
                  onClick={() => {
                    // Create a blob and download it
                    const blob = new Blob([interview.audioAnalysis], { type: 'text/plain' });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = `${callSid}_audio_analysis.txt`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                  }}
                >
                  Download Audio Analysis
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              {loading.audioAnalysis ? (
                <div className="text-center my-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : error.audioAnalysis ? (
                <Alert variant="danger">{error.audioAnalysis}</Alert>
              ) : !interview.audioAnalysis ? (
                <Alert variant="info">No audio analysis available for this call.</Alert>
              ) : (
                <div className="analysis-content">
                  <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                    {interview.audioAnalysis}
                  </pre>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>
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
        {/* New Recording tab */}
        <Tab 
          eventKey="recording" 
          title={
            <span>
              Recording {hasRecording && <span className="text-success">✓</span>}
            </span>
          }
        >
          <Card>
            <Card.Header>
              <h4 className="mb-0">Call Recording</h4>
            </Card.Header>
            <Card.Body>
              {loading.details ? (
                <div className="text-center my-4">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : error.details ? (
                <Alert variant="danger">{error.details}</Alert>
              ) : !hasRecording ? (
                <Alert variant="info">No recording available for this call.</Alert>
              ) : (
                <div className="recording-player">
                  <p className="mb-3">Listen to the call recording:</p>
                  <audio 
                    controls 
                    className="w-100" 
                    src={getRecordingUrl(callSid)}
                  >
                    Your browser does not support the audio element.
                  </audio>
                  <div className="mt-3">
                    <small className="text-muted">
                      Note: The recording is in MP3 format by default. 
                      For WAV format, <a href={`${getRecordingUrl(callSid)}?format=wav`} target="_blank" rel="noopener noreferrer">click here</a>.
                    </small>
                  </div>
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
