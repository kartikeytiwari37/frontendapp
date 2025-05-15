import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { getPhoneNumbers, initiateCall } from '../services/api';

const MakeCallPage = () => {
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    number: '',
    fromNumber: '',
    name: '',
    location: '',
    product: ''
  });

  useEffect(() => {
    // Fetch available phone numbers
    const fetchPhoneNumbers = async () => {
      try {
        setLoading(true);
        const response = await getPhoneNumbers();
        setPhoneNumbers(response.data);
        
        // Set default fromNumber if available
        if (response.data && response.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            fromNumber: response.data[0].phoneNumber
          }));
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch phone numbers. Please try again later.');
        setLoading(false);
      }
    };

    fetchPhoneNumbers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.number) {
      setError('Phone number is required');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const response = await initiateCall(formData);
      
      setSuccess(`Call initiated successfully! Call SID: ${response.data.callSid}`);
      setLoading(false);
      
      // Reset form
      setFormData({
        number: '',
        fromNumber: formData.fromNumber, // Keep the selected from number
        name: '',
        location: '',
        product: ''
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to initiate call. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-4">Make a Call</h1>
      
      <Card>
        <Card.Header>Call Details</Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Candidate Phone Number*</Form.Label>
              <Form.Control
                type="text"
                name="number"
                value={formData.number}
                onChange={handleChange}
                placeholder="Enter phone number (e.g., +919876543210)"
                required
              />
              <Form.Text className="text-muted">
                Enter the phone number with country code
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>From Number</Form.Label>
              <Form.Select
                name="fromNumber"
                value={formData.fromNumber}
                onChange={handleChange}
              >
                {phoneNumbers.map(phone => (
                  <option key={phone.sid} value={phone.phoneNumber}>
                    {phone.friendlyName} ({phone.phoneNumber})
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                Select the Twilio phone number to call from
              </Form.Text>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Candidate Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter candidate name"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Product</Form.Label>
              <Form.Control
                type="text"
                name="product"
                value={formData.product}
                onChange={handleChange}
                placeholder="Enter product"
              />
            </Form.Group>
            
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  <span className="ms-2">Initiating Call...</span>
                </>
              ) : (
                'Make Call'
              )}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default MakeCallPage;
