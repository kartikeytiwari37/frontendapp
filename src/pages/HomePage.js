import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1 className="mb-4 text-primary-piramal">Piramal Voice Platform Dashboard</h1>
      
      <Row>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Header>Make a Call</Card.Header>
            <Card.Body>
              <Card.Text>
                Initiate a call to a candidate for screening interview.
              </Card.Text>
              <Button as={Link} to="/make-call" variant="primary" className="mt-2">Go to Call Page</Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card>
            <Card.Header>Bulk Upload</Card.Header>
            <Card.Body>
              <Card.Text>
                Upload multiple candidates or CVs in bulk.
              </Card.Text>
              <Button as={Link} to="/bulk-upload" variant="primary" className="mt-2">Go to Bulk Upload</Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card>
            <Card.Header>Auto-Trigger Call</Card.Header>
            <Card.Body>
              <Card.Text>
                Automatically trigger a call to the next pending candidate.
              </Card.Text>
              <Button as={Link} to="/bulk-records" variant="primary" className="mt-2">Go to Bulk Records</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Header>Bulk Records</Card.Header>
            <Card.Body>
              <Card.Text>
                View and manage all bulk uploaded candidate records.
              </Card.Text>
              <Button as={Link} to="/bulk-records" variant="primary" className="mt-2">View Bulk Records</Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card>
            <Card.Header>Interview Records</Card.Header>
            <Card.Body>
              <Card.Text>
                View all interview records, transcripts, and analysis.
              </Card.Text>
              <Button as={Link} to="/interviews" variant="primary" className="mt-2">View Interviews</Button>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4} className="mb-4">
          <Card>
            <Card.Header>Persona Settings</Card.Header>
            <Card.Body>
              <Card.Text>
                Configure AI personas for interview calls.
              </Card.Text>
              <Button as={Link} to="/personas" variant="primary" className="mt-2">Manage Personas</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
