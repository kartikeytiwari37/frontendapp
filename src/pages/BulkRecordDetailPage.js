import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import { getBulkRecordById } from '../services/api';

const BulkRecordDetailPage = () => {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecord();
  }, [id]);

  const fetchRecord = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await getBulkRecordById(id);
      
      setRecord(response.data.record);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch record details. Please try again.');
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!record) {
    return <Alert variant="warning">Record not found.</Alert>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Candidate Details</h1>
        <Link to="/bulk-records" className="btn btn-secondary">
          Back to Records
        </Link>
      </div>
      
      <Card className="mb-4">
        <Card.Header>
          <h4 className="mb-0">Basic Information</h4>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <div className="mb-3">
                <strong>Name:</strong> {record.name}
              </div>
              <div className="mb-3">
                <strong>Phone Number:</strong> {record.phoneNumber}
              </div>
              <div className="mb-3">
                <strong>Location:</strong> {record.location}
              </div>
            </Col>
            <Col md={6}>
              <div className="mb-3">
                <strong>Product:</strong> {record.product}
              </div>
              <div className="mb-3">
                <strong>Designation:</strong> {record.designation}
              </div>
              <div className="mb-3">
                <strong>Status:</strong> 
                <span className={`badge ms-2 ${
                  record.status === 'PENDING' ? 'bg-warning' :
                  record.status === 'CALL_INITIATED' ? 'bg-success' :
                  'bg-secondary'
                }`}>
                  {record.status}
                </span>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="mb-3">
                <strong>Created:</strong> {formatDate(record.createdAt)}
              </div>
              <div className="mb-3">
                <strong>Last Updated:</strong> {formatDate(record.updatedAt)}
              </div>
              {record.callSid && (
                <div className="mb-3">
                  <strong>Call SID:</strong> {record.callSid}
                  {record.callSid && (
                    <Link 
                      to={`/interviews/${record.callSid}`}
                      className="btn btn-sm btn-primary ms-3"
                    >
                      View Interview
                    </Link>
                  )}
                </div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {record.cvInfo && (
        <Card className="mb-4">
          <Card.Header>
            <h4 className="mb-0">CV Information</h4>
          </Card.Header>
          <Card.Body>
            <div className="mb-3">
              <strong>CV Filename:</strong> {record.cvFilename || 'N/A'}
            </div>
            
            {record.cvInfo.extractedInfo && (
              <>
                {record.cvInfo.extractedInfo.personalInfo && (
                  <div className="mb-4">
                    <h5>Personal Information</h5>
                    <Row>
                      <Col md={6}>
                        <div className="mb-2">
                          <strong>Name:</strong> {record.cvInfo.extractedInfo.personalInfo.name || 'N/A'}
                        </div>
                        <div className="mb-2">
                          <strong>Email:</strong> {record.cvInfo.extractedInfo.personalInfo.email || 'N/A'}
                        </div>
                        <div className="mb-2">
                          <strong>Phone:</strong> {record.cvInfo.extractedInfo.personalInfo.phone || 'N/A'}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-2">
                          <strong>Address:</strong> {record.cvInfo.extractedInfo.personalInfo.address || 'N/A'}
                        </div>
                        <div className="mb-2">
                          <strong>City:</strong> {record.cvInfo.extractedInfo.personalInfo.city || 'N/A'}
                        </div>
                        <div className="mb-2">
                          <strong>State:</strong> {record.cvInfo.extractedInfo.personalInfo.state || 'N/A'}
                        </div>
                      </Col>
                    </Row>
                  </div>
                )}
                
                {record.cvInfo.extractedInfo.workExperience && record.cvInfo.extractedInfo.workExperience.length > 0 && (
                  <div className="mb-4">
                    <h5>Work Experience</h5>
                    {record.cvInfo.extractedInfo.workExperience.map((exp, index) => (
                      <Card key={index} className="mb-2">
                        <Card.Body>
                          <div className="mb-2">
                            <strong>Company:</strong> {exp.company || 'N/A'}
                          </div>
                          <div className="mb-2">
                            <strong>Position:</strong> {exp.position || 'N/A'}
                          </div>
                          <div className="mb-2">
                            <strong>Duration:</strong> {exp.duration || 'N/A'}
                          </div>
                          <div className="mb-2">
                            <strong>Location:</strong> {exp.location || 'N/A'}
                          </div>
                          {exp.responsibilities && exp.responsibilities.length > 0 && (
                            <div className="mb-2">
                              <strong>Responsibilities:</strong>
                              <ul>
                                {exp.responsibilities.map((resp, i) => (
                                  <li key={i}>{resp}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                )}
                
                {record.cvInfo.extractedInfo.education && record.cvInfo.extractedInfo.education.length > 0 && (
                  <div className="mb-4">
                    <h5>Education</h5>
                    {record.cvInfo.extractedInfo.education.map((edu, index) => (
                      <Card key={index} className="mb-2">
                        <Card.Body>
                          <div className="mb-2">
                            <strong>Institution:</strong> {edu.institution || 'N/A'}
                          </div>
                          <div className="mb-2">
                            <strong>Degree:</strong> {edu.degree || 'N/A'}
                          </div>
                          <div className="mb-2">
                            <strong>Field:</strong> {edu.field || 'N/A'}
                          </div>
                          <div className="mb-2">
                            <strong>Year:</strong> {edu.year || 'N/A'}
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                )}
                
                {record.cvInfo.extractedInfo.skills && (
                  <div className="mb-4">
                    <h5>Skills</h5>
                    <Row>
                      {record.cvInfo.extractedInfo.skills.technical && (
                        <Col md={6}>
                          <div className="mb-2">
                            <strong>Technical Skills:</strong>
                            <ul>
                              {record.cvInfo.extractedInfo.skills.technical.map((skill, i) => (
                                <li key={i}>{skill}</li>
                              ))}
                            </ul>
                          </div>
                        </Col>
                      )}
                      {record.cvInfo.extractedInfo.skills.soft && (
                        <Col md={6}>
                          <div className="mb-2">
                            <strong>Soft Skills:</strong>
                            <ul>
                              {record.cvInfo.extractedInfo.skills.soft.map((skill, i) => (
                                <li key={i}>{skill}</li>
                              ))}
                            </ul>
                          </div>
                        </Col>
                      )}
                    </Row>
                  </div>
                )}
                
                {record.cvInfo.extractedInfo.salesMetrics && (
                  <div className="mb-4">
                    <h5>Sales Metrics</h5>
                    <Row>
                      <Col md={6}>
                        <div className="mb-2">
                          <strong>Average Target Achievement:</strong> {record.cvInfo.extractedInfo.salesMetrics.averageTargetAchievement || 'N/A'}
                        </div>
                        <div className="mb-2">
                          <strong>Highest Sales Record:</strong> {record.cvInfo.extractedInfo.salesMetrics.highestSalesRecord || 'N/A'}
                        </div>
                        <div className="mb-2">
                          <strong>Client Retention Rate:</strong> {record.cvInfo.extractedInfo.salesMetrics.clientRetentionRate || 'N/A'}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-2">
                          <strong>Lead Conversion Rate:</strong> {record.cvInfo.extractedInfo.salesMetrics.leadConversionRate || 'N/A'}
                        </div>
                        <div className="mb-2">
                          <strong>Average Deal Size:</strong> {record.cvInfo.extractedInfo.salesMetrics.averageDealSize || 'N/A'}
                        </div>
                        <div className="mb-2">
                          <strong>Sales Cycle:</strong> {record.cvInfo.extractedInfo.salesMetrics.salesCycle || 'N/A'}
                        </div>
                      </Col>
                    </Row>
                  </div>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default BulkRecordDetailPage;
