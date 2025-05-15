import React, { useState, useEffect } from 'react';
import { Card, Table, Form, Alert, Spinner, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getCandidateInterviews } from '../services/api';

const InterviewsPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalInterviews, setTotalInterviews] = useState(0);

  // Status options
  const statusOptions = [
    { value: '', label: 'All' },
    { value: 'INITIATED', label: 'Initiated' },
    { value: 'CONNECTED', label: 'Connected' },
    { value: 'DISCONNECTED', label: 'Disconnected' },
    { value: 'FAILED', label: 'Failed' },
    { value: 'COMPLETED', label: 'Completed' }
  ];

  // Fetch interviews on component mount and when status or page changes
  useEffect(() => {
    fetchInterviews();
  }, [status, page]);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await getCandidateInterviews(status, page, 10);
      
      setInterviews(response.data.interviews);
      setTotalPages(response.data.totalPages);
      setTotalInterviews(response.data.total);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch interviews. Please try again.');
      setLoading(false);
    }
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setPage(1); // Reset to first page when status changes
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Generate pagination items
  const paginationItems = [];
  for (let i = 1; i <= totalPages; i++) {
    paginationItems.push(
      <Pagination.Item 
        key={i} 
        active={i === page}
        onClick={() => handlePageChange(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div>
      <h1 className="mb-4">Interview Records</h1>
      
      <div className="mb-4">
        <Form.Group style={{ width: '200px' }}>
          <Form.Label>Filter by Status</Form.Label>
          <Form.Select
            value={status}
            onChange={handleStatusChange}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Card>
        <Card.Header>
          Interview Records ({totalInterviews})
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center my-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : interviews.length === 0 ? (
            <Alert variant="info">No interviews found.</Alert>
          ) : (
            <>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Call SID</th>
                    <th>Candidate Name</th>
                    <th>Phone Number</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Transcript</th>
                    <th>Analysis</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {interviews.map(interview => (
                    <tr key={interview.callSid}>
                      <td>{interview.callSid.substring(0, 8)}...</td>
                      <td>{interview.candidateInfo?.name || 'Unknown'}</td>
                      <td>{interview.candidateInfo?.phoneNumber || 'Unknown'}</td>
                      <td>
                        <span className={`badge ${
                          interview.status === 'COMPLETED' ? 'bg-success' :
                          interview.status === 'CONNECTED' ? 'bg-primary' :
                          interview.status === 'INITIATED' ? 'bg-warning' :
                          interview.status === 'DISCONNECTED' ? 'bg-danger' :
                          'bg-secondary'
                        }`}>
                          {interview.status}
                        </span>
                      </td>
                      <td>{formatDate(interview.createdAt)}</td>
                      <td>
                        {interview.screeningInfo?.transcript ? (
                          <span className="text-success">✓</span>
                        ) : (
                          <span className="text-danger">✗</span>
                        )}
                      </td>
                      <td>
                        {interview.screeningInfo?.analysis ? (
                          <span className="text-success">✓</span>
                        ) : (
                          <span className="text-danger">✗</span>
                        )}
                      </td>
                      <td>
                        <Link 
                          to={`/interviews/${interview.callSid}`}
                          className="btn btn-sm btn-primary"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              <Pagination>
                <Pagination.First onClick={() => handlePageChange(1)} disabled={page === 1} />
                <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 1} />
                {paginationItems}
                <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} />
                <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={page === totalPages} />
              </Pagination>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default InterviewsPage;
