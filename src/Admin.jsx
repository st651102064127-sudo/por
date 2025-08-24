import React, { useEffect, useState } from 'react';
import { Table, Form, Row, Col, Card, Button } from 'react-bootstrap';
import Navbar_ from './Navbar';

function AdminPanel() {
const scriptUrl = import.meta.env.VITE_API_URL;


    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const [loggedIn, setLoggedIn] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [loginError, setLoginError] = useState('');

    // ตรวจสอบ password

    
    const handleLogin = (e) => {
        e.preventDefault();
          
        if (passwordInput ==   import.meta.env.VITE_PASSWORD) {
            setLoggedIn(true);
            setLoginError('');
        } else {
            setLoginError('รหัสผ่านไม่ถูกต้อง');
            setPasswordInput('');
        }
    };

    // โหลดข้อมูลเมื่อ login สำเร็จ
    useEffect(() => {
        if (!loggedIn) return;
        fetch(scriptUrl)
            .then(res => res.json())
            .then(res => {
                if (res.result === 'success') {
                    const sorted = res.data
                        .map((row, i) => ({ ...row, rowIndex: i + 2 }))
                        .sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp));
                    setData(sorted);
                }
            })
            .catch(err => console.error(err));
    }, [loggedIn]);

    const filtered = data.filter(row => {
        const rowDateStr = new Date(row.Timestamp).toISOString().slice(0, 10);
        let dateMatch = true;
        if (dateFrom && rowDateStr < dateFrom) dateMatch = false;
        if (dateTo && rowDateStr > dateTo) dateMatch = false;
        const searchLower = search.toLowerCase();
        const searchMatch = row.Submitter.toLowerCase().includes(searchLower) || row.Product.toLowerCase().includes(searchLower);
        return dateMatch && searchMatch;
    });

    const updateStatus = (rowIndex, status) => {
        fetch(scriptUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                action: 'edit',
                rowIndex: rowIndex,
                status: status
            })
        })
            .then(res => res.json())
            .then(res => {
                if (res.result === 'success') {
                    setData(prev => prev.map(row => row.rowIndex === rowIndex ? { ...row, Status: status } : row));
                } else {
                    alert('เกิดข้อผิดพลาด: ' + res.message);
                }
            })
            .catch(err => console.error(err));
    };

    // --- Render ฟอร์ม login ---
    if (!loggedIn) {
        return (
            <>  
            <Navbar_/>
                      <div className="d-flex justify-content-center align-items-center vh-100">
                <Card className="p-4 shadow rounded" style={{ minWidth: '300px' }}>
                    <h4 className="mb-3 text-center">เข้าสู่ระบบ Admin</h4>
                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3">
                            <Form.Label>รหัสผ่าน</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                autoFocus
                            />
                        </Form.Group>
                        {loginError && <p className="text-danger">{loginError}</p>}
                        <Button type="submit" className="w-100">เข้าสู่ระบบ</Button>
                    </Form>
                </Card>
            </div>
            </>

        );
    }

    // --- Render Admin Panel ---
    return (
    <>
       <Navbar_/>
   
        <div className='container'>
            <Card className="shadow my-4 border-0 shadow-lg rounded-1 ">
                <Card.Header className="bg-dark text-white">
                    <h4 className="mb-0">Admin Panel - ตรวจสอบการชำระเงิน</h4>
                </Card.Header>
                <Card.Body className="bg-light">
                    <Form className="mb-3">
                        <Row className="g-2 align-items-center">
                            <Col md={4}>
                                <Form.Control type="text" placeholder="ค้นหาชื่อหรือสินค้า" value={search} onChange={e => setSearch(e.target.value)} />
                            </Col>
                            <Col md={3}>
                                <Form.Control type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
                            </Col>
                            <Col md={3}>
                                <Form.Control type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
                            </Col>
                        </Row>
                    </Form>

                    <Table striped bordered hover responsive variant="dark" className="align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>Submitter</th>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Timestamp</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length > 0 ? filtered.map((row) => (
                                <tr key={row.rowIndex}>
                                    <td>{row.Submitter}</td>
                                    <td>{row.Product}</td>
                                    <td>{row.Price}</td>
                                    <td>{row.Timestamp}</td>
                                    <td>
                                        <Form.Select
                                            value={row.Status}
                                            onChange={(e) => updateStatus(row.rowIndex, e.target.value)}
                                        >
                                            <option value="ยังไม่ได้ชำระ">ยังไม่ได้ชำระ</option>
                                            <option value="ชำระแล้ว">ชำระแล้ว</option>
                                        </Form.Select>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="text-center">ไม่มีข้อมูล</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </div>
         </>
    );
}

export default AdminPanel;
