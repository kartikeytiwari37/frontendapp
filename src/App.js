import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Nav, Navbar, Image } from 'react-bootstrap';

// Import pages
import HomePage from './pages/HomePage';
import MakeCallPage from './pages/MakeCallPage';
import BulkUploadPage from './pages/BulkUploadPage';
import BulkRecordsPage from './pages/BulkRecordsPage';
import InterviewsPage from './pages/InterviewsPage';
import BulkRecordDetailPage from './pages/BulkRecordDetailPage';
import InterviewDetailPage from './pages/InterviewDetailPage';
import PersonaSettingsPage from './pages/PersonaSettingsPage';

function App() {
  return (
    <Router>
      <Navbar bg="white" expand="lg" className="border-bottom py-2 shadow-sm">
        <Container>
          <div className="d-flex align-items-center">
            <Image 
              src="/piramal-logo.svg" 
              alt="Piramal Logo" 
              width={80} 
              height={40}
              className="me-3"
            />
            <Navbar.Brand as={Link} to="/" className="text-primary-piramal">Piramal Voice Platform</Navbar.Brand>
          </div>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/" className="text-dark">Home</Nav.Link>
              <Nav.Link as={Link} to="/make-call" className="text-dark">Make Call</Nav.Link>
              <Nav.Link as={Link} to="/bulk-upload" className="text-dark">Bulk Upload</Nav.Link>
              <Nav.Link as={Link} to="/bulk-records" className="text-dark">Bulk Records</Nav.Link>
              <Nav.Link as={Link} to="/interviews" className="text-dark">Interviews</Nav.Link>
              <Nav.Link as={Link} to="/personas" className="text-dark">Personas</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/make-call" element={<MakeCallPage />} />
          <Route path="/bulk-upload" element={<BulkUploadPage />} />
          <Route path="/bulk-records" element={<BulkRecordsPage />} />
          <Route path="/bulk-records/:id" element={<BulkRecordDetailPage />} />
          <Route path="/interviews" element={<InterviewsPage />} />
          <Route path="/interviews/:callSid" element={<InterviewDetailPage />} />
          <Route path="/personas" element={<PersonaSettingsPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
