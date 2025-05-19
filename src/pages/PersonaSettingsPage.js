import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { getPersonas, setPersona } from '../services/api';

const PersonaSettingsPage = () => {
  const [personas, setPersonas] = useState([]);
  const [selectedPersona, setSelectedPersona] = useState('');
  const [promptText, setPromptText] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPersonas();
  }, []);

  const fetchPersonas = async () => {
    try {
      setFetchLoading(true);
      setError('');
      
      const response = await getPersonas();
      
      // Ensure "Manual Entry" is in the list
      const personaList = response.data.personas;
      if (!personaList.includes('Manual Entry')) {
        personaList.push('Manual Entry');
      }
      
      setPersonas(personaList);
      
      // Set default selected persona
      if (personaList.length > 0) {
        setSelectedPersona(personaList[0]);
      }
      
      setFetchLoading(false);
    } catch (err) {
      setError('Failed to fetch personas. Please try again.');
      setFetchLoading(false);
    }
  };

  const handlePersonaChange = (e) => {
    const persona = e.target.value;
    setSelectedPersona(persona);
    
    // Clear prompt text and description when not "Manual Entry"
    if (persona !== 'Manual Entry') {
      setPromptText('');
      setDescription('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      // Prepare data based on selected persona
      const personaData = {
        persona: selectedPersona
      };
      
      // Add prompt text and description for Manual Entry
      if (selectedPersona === 'Manual Entry') {
        if (!promptText) {
          setError('Prompt text is required for Manual Entry persona');
          setLoading(false);
          return;
        }
        
        personaData.promptText = promptText;
        personaData.description = description || 'Custom prompt text';
      }
      
      // Call API to set persona
      const response = await setPersona(personaData);
      
      setSuccess(response.data.message || 'Persona set successfully');
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to set persona. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="mb-4">Persona Settings</h1>
      
      <Card>
        <Card.Header>Select AI Persona</Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          {fetchLoading ? (
            <div className="text-center my-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading personas...</span>
              </Spinner>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Select Persona</Form.Label>
                <Form.Select
                  value={selectedPersona}
                  onChange={handlePersonaChange}
                >
                  {personas.map(persona => (
                    <option key={persona} value={persona}>
                      {persona}
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  Select the AI persona to use for calls
                </Form.Text>
              </Form.Group>
              
              {selectedPersona === 'Manual Entry' && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter a description for this persona"
                    />
                    <Form.Text className="text-muted">
                      Optional description for the custom persona
                    </Form.Text>
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Prompt Text*</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={10}
                      value={promptText}
                      onChange={(e) => setPromptText(e.target.value)}
                      placeholder="Enter the prompt text for the AI persona"
                      required
                    />
                    <Form.Text className="text-muted">
                      You can use template variables like ${'{params.customerName}'}, ${'{params.customerLocation}'}, and ${'{params.customerProduct}'} in your prompt.
                    </Form.Text>
                  </Form.Group>
                </>
              )}
              
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    <span className="ms-2">Setting Persona...</span>
                  </>
                ) : (
                  'Set Persona'
                )}
              </Button>
            </Form>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default PersonaSettingsPage;
