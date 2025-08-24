import React, { useEffect, useState } from 'react';
import { Table, Card, Row, Col, Form } from 'react-bootstrap';

function DataTable() {
   const scriptUrl = import.meta.env.VITE_API_URL;


    const [data, setData] = useState([]);
    const [search, setSearch] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    useEffect(() => {
        fetch(scriptUrl)
            .then(res => res.json())
            .then(res => {
                if (res.result === 'success') {
                    const sorted = res.data.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp));
                    setData(sorted);
                }
            })
            .catch(err => console.error(err));
    }, []);

    const filtered = data.filter(row => {
        const timestamp = new Date(row.Timestamp);
        const from = dateFrom ? new Date(dateFrom) : null;
        const to = dateTo ? new Date(dateTo) : null;

        let dateMatch = true;
        if (from && timestamp < from) dateMatch = false;
        if (to && timestamp > to) dateMatch = false;

        const searchLower = search.toLowerCase();
        const searchMatch = row.Submitter.toLowerCase().includes(searchLower) || row.Product.toLowerCase().includes(searchLower);

        return dateMatch && searchMatch;
    });

    return (
        <Card className="shadow my-4">
            <Card.Header className="bg-primary text-white">
                <h4 className="mb-0">ข้อมูลการซื้อขาย</h4>
            </Card.Header>
            <Card.Body>
                <Form className="mb-3">
                    <Row className="align-items-center g-2">
                        <Col md={4}>
                            <Form.Control
                                type="text"
                                placeholder="ค้นหาชื่อหรือสินค้า"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Control
                                type="date"
                                value={dateFrom}
                                onChange={e => setDateFrom(e.target.value)}
                            />
                        </Col>
                        <Col md={3}>
                            <Form.Control
                                type="date"
                                value={dateTo}
                                onChange={e => setDateTo(e.target.value)}
                            />
                        </Col>
                    </Row>
                </Form>

                <Table striped bordered hover responsive>
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
                        {filtered.length > 0 ? (
                            filtered.map((row, i) => (
                                <tr key={i}>
                                    <td>{row.Submitter}</td>
                                    <td>{row.Product}</td>
                                    <td>{row.Price}</td>
                                    <td>{row.Timestamp}</td>
                                    <td>{row.Status}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">ไม่มีข้อมูล</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
}

export default DataTable;
