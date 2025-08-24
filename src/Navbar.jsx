import React from 'react'
import { Navbar, Container, Nav, Form, Button, Card, Row, Col } from 'react-bootstrap';

function Navbar_() {
  return (
          <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand href="/">ระบบจัดการข้อมูล</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">เพิ่มข้อมูล</Nav.Link>
              <Nav.Link href="/Admin">จัดการข้อมูล (Admin)</Nav.Link>
            </Nav>
       
           
          </Navbar.Collapse>
        </Container>
      </Navbar>
  )
}

export default Navbar_