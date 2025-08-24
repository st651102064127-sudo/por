import React, { useState } from 'react';
import { Container, Nav, Form, Button, Card, Row, Col } from 'react-bootstrap';
import DataTable from './Datatable';
import Navbar_ from './Navbar';
import Swal from 'sweetalert2';
// The following imports are commented out to prevent compilation errors
// as this environment may not have access to local file paths.
// In a real project, you would uncomment these.
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './App.css';

function App() {
  const [submitterName, setSubmitterName] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');

  const scriptUrl = import.meta.env.VITE_API_URL;


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!submitterName || !productName || !productPrice) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const params = new URLSearchParams();
    params.append('action', 'add');
    params.append('submitter', submitterName);
    params.append('product', productName);
    params.append('price', productPrice);
    params.append('timestamp', new Date().toLocaleString());
    params.append('status', 'ยังไม่ได้ชำระ');

    fetch(scriptUrl, {
      method: 'POST',
      body: params,
    })
      .then(() => {
        Swal.fire({
          title: 'บันทึกข้อมูลเสร็จสิ้น',
          icon: 'success',
          
          position: 'top-end'
        }).then(() => {
          // รีเฟรชหน้า
          window.location.reload();
        });
        // เคลียร์ฟอร์ม
        setSubmitterName('');
        setProductName('');
        setProductPrice('');
      })
      .catch(error => {
        console.error('เกิดข้อผิดพลาดในการส่งข้อมูล:', error);
        Swal.fire({
          title: 'เกิดข้อผิดพลาด',
          icon: 'error',
          'toast': true,
          position: 'top-end'
        }

        )
      });
  };

  return (
    <>
      <Navbar_ />

      {/* Main Content (Data Entry Form) */}
      <Container className="my-5" id="add-data">
        <Row className="justify-content-center">
          <Col md={7} lg={6}>
            <Card className="shadow-lg border-0 rounded-3">
              <Card.Header className="bg-primary text-white text-center py-4">
                <h4 className="mb-0 fw-bold">บันทึกข้อมูลการซื้อขาย</h4>
              </Card.Header>
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formSubmitterName">
                    <Form.Label className="fw-bold">ชื่อผู้เพิ่มข้อมูล</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="กรอกชื่อของคุณ"
                      value={submitterName}
                      onChange={(e) => setSubmitterName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formProductName">
                    <Form.Label className="fw-bold">ชื่อสินค้า</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="กรอกชื่อสินค้า"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                    />
                  </Form.Group>

                  <Form.Group className="mb-4" controlId="formProductPrice">
                    <Form.Label className="fw-bold">ราคาสินค้า</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="กรอกราคาสินค้า"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                    />
                  </Form.Group>

                  <div className="d-grid">
                    <Button variant="primary" type="submit" size="lg">
                      บันทึกข้อมูล
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <DataTable />
      </Container>
    </>
  );
}

export default App;
