import React, { useState, useEffect } from 'react';
import { Card, Table, Form, Button, Alert, Spinner, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getBulkRecords, autoTriggerCall } from '../services/api';

const BulkRecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [autoTriggerLoading, setAutoTriggerLoading] = useState(false);

  // Status options
  const statusOptions = [
    { value: '', label: 'All' },
    { value: 'INSUFFICIENT_INFO', label: 'Insufficient Info' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'CALL_INITIATED', label: 'Call Initiated' }
  ];

  // Fetch records on component mount and when status or page changes
  useEffect(() => {
    fetchRecords();
  }, [status, page]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await getBulkRecords(status, page, 10);
      
      setRecords(response.data.records);
      setTotalPages(response.data.totalPages);
      setTotalRecords(response.data.total);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch records. Please try again.');
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

  const handleAutoTriggerCall = async () => {
    try {
      setAutoTriggerLoading(true);
      setError('');
      setSuccess('');
      
      const response = await autoTriggerCall();
      
      setSuccess(`Call auto-triggered successfully! Call SID: ${response.data.callSid}`);
      setAutoTriggerLoading(false);
      
      // Refresh records after auto-triggering a call
      fetchRecords();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to auto-trigger call. Please try again.');
      setAutoTriggerLoading(false);
    }
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

  return (
    <div>
      <h1 className="mb-4">Bulk Records</h1>
      
      <div className="d-flex justify-content-between mb-4">
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
        
        <div>
          <Button 
            variant="success" 
            onClick={handleAutoTriggerCall}
            disabled={autoTriggerLoading}
          >
            {autoTriggerLoading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Triggering Call...</span>
              </>
            ) : (
              'Auto-Trigger Call'
            )}
          </Button>
        </div>
      </div>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      
      <Card>
        <Card.Header>
          Bulk Records ({totalRecords})
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center my-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : records.length === 0 ? (
            <Alert variant="info">No records found.</Alert>
          ) : (
            <>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone Number</th>
                    <th>Location</th>
                    <th>Product</th>
                    <th>Status</th>
                    <th>CV</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map(record => (
                    <tr key={record.id}>
                      <td>{record.name}</td>
                      <td>{record.phoneNumber}</td>
                      <td>{record.location}</td>
                      <td>{record.product}</td>
                      <td>
                        <span className={`badge ${
                          record.status === 'PENDING' ? 'bg-warning' :
                          record.status === 'CALL_INITIATED' ? 'bg-success' :
                          'bg-secondary'
                        }`}>
                          {record.status}
                        </span>
                      </td>
                      <td>
                        {record.hasCvInfo ? (
                          <span className="text-success">✓</span>
                        ) : (
                          <span className="text-danger">✗</span>
                        )}
                      </td>
                      <td>
                        <Link 
                          to={`/bulk-records/${record.id}`}
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

export default BulkRecordsPage;
