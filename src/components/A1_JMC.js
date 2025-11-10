import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Navbar,
  Nav,
  Modal,
} from "react-bootstrap";


const JointPharmaWebsite = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const products = [
    {
      id: 1,
      name: "HyaluJoint Pro",
      category: "Hyaluronic Acid",
      description:
        "Tiêm khớp Hyaluronic Acid cao cấp, giúp bôi trơn và tái tạo dịch khớp",
      features: [
        "Nồng độ 20mg/ml",
        "Nguồn gốc sinh học",
        "Hiệu quả kéo dài 6-12 tháng",
        "An toàn cao",
      ],
      price: "Liên hệ",
      image: "💉",
    },
    {
      id: 2,
      name: "CortiJoint Plus",
      category: "Corticosteroid",
      description:
        "Thuốc tiêm khớp chống viêm mạnh, giảm đau nhanh và hiệu quả",
      features: [
        "Giảm viêm nhanh chóng",
        "Kiểm soát đau hiệu quả",
        "Dùng cho viêm khớp cấp",
        "Công thức cải tiến",
      ],
      price: "Liên hệ",
      image: "💊",
    },
    {
      id: 3,
      name: "PRP-Joint Advanced",
      category: "PRP Therapy",
      description:
        "Liệu pháp tiêm huyết tương giàu tiểu cầu, thúc đẩy tái tạo tự nhiên",
      features: [
        "Tự nhiên từ cơ thể",
        "Tái tạo sụn khớp",
        "Không tác dụng phụ",
        "Công nghệ tiên tiến",
      ],
      price: "Liên hệ",
      image: "🧬",
    },
    {
      id: 4,
      name: "VitaJoint Injection",
      category: "Vitamin Complex",
      description: "Phức hợp vitamin và khoáng chất hỗ trợ sức khỏe khớp",
      features: [
        "Vitamin B12, D3",
        "Khoáng chất cần thiết",
        "Tăng cường xương khớp",
        "Hỗ trợ điều trị",
      ],
      price: "Liên hệ",
      image: "🌿",
    },
  ];

  const stats = [
    { icon: "bi-people-fill", value: "50,000+", label: "Bệnh nhân tin dùng" },
    { icon: "bi-award-fill", value: "15+", label: "Năm kinh nghiệm" },
    {
      icon: "bi-shield-fill-check",
      value: "100%",
      label: "Chất lượng đảm bảo",
    },
    { icon: "bi-capsule", value: "20+", label: "Sản phẩm đa dạng" },
  ];

  const benefits = [
    {
      title: "Hiệu quả cao",
      description: "Sản phẩm được nghiên cứu và thử nghiệm lâm sàng kỹ lưỡng",
      icon: "bi-check-circle-fill",
    },
    {
      title: "An toàn tuyệt đối",
      description: "Đạt chuẩn GMP, WHO và được Bộ Y tế phê duyệt",
      icon: "bi-check-circle-fill",
    },
    {
      title: "Công nghệ tiên tiến",
      description: "Sử dụng công nghệ sản xuất hiện đại nhất thế giới",
      icon: "bi-check-circle-fill",
    },
    {
      title: "Hỗ trợ chuyên môn",
      description: "Đội ngũ chuyên gia tư vấn và hỗ trợ 24/7",
      icon: "bi-check-circle-fill",
    },
  ];

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)",
      }}
    >
      {/* Navigation */}
      <Navbar bg="white" expand="lg" fixed="top" className="shadow-sm">
        <Container>
          <Navbar.Brand href="#home" className="d-flex align-items-center">
            <i className="bi bi-capsule fs-3 text-primary me-2"></i>
            <span className="fw-bold fs-4">JointPharma</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#home" className="mx-2">
                Trang chủ
              </Nav.Link>
              <Nav.Link href="#products" className="mx-2">
                Sản phẩm
              </Nav.Link>
              <Nav.Link href="#benefits" className="mx-2">
                Lợi ích
              </Nav.Link>
              <Nav.Link href="#contact" className="mx-2">
                Liên hệ
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <section id="home" style={{ paddingTop: "100px", paddingBottom: "80px" }}>
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <h1 className="display-3 fw-bold mb-4">
                Giải pháp <span className="text-primary">tiêm khớp</span> hàng
                đầu
              </h1>
              <p className="lead text-muted mb-4">
                Chuyên cung cấp các sản phẩm thuốc tiêm khớp chất lượng cao, an
                toàn và hiệu quả. Được tin dùng bởi hàng ngàn bệnh viện và phòng
                khám trên toàn quốc.
              </p>
              <div className="d-flex flex-column flex-sm-row gap-3">
                <Button
                  href="#products"
                  variant="primary"
                  size="lg"
                  className="px-4"
                >
                  Xem sản phẩm
                </Button>
                <Button
                  href="#contact"
                  variant="outline-primary"
                  size="lg"
                  className="px-4"
                >
                  Liên hệ ngay
                </Button>
              </div>
            </Col>
            <Col lg={6}>
              <div
                className="p-5 rounded-4 text-center text-white shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)",
                }}
              >
                <i className="bi bi-capsule display-1 mb-4"></i>
                <h3 className="h2 fw-bold mb-2">Chất lượng quốc tế</h3>
                <p className="mb-0 opacity-75">Đạt chuẩn GMP & WHO</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="bg-primary text-white py-5">
        <Container>
          <Row className="g-4">
            {stats.map((stat, index) => (
              <Col key={index} xs={6} md={3} className="text-center">
                <i className={`${stat.icon} display-4 mb-3 opacity-75`}></i>
                <div className="display-5 fw-bold mb-2">{stat.value}</div>
                <div className="opacity-75">{stat.label}</div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Products Section */}
      <section id="products" className="py-5">
        <Container className="my-5">
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold mb-3">Sản phẩm nổi bật</h2>
            <p className="lead text-muted">
              Đa dạng các loại thuốc tiêm khớp phù hợp với nhiều tình trạng bệnh
              lý khác nhau
            </p>
          </div>

          <Row className="g-4">
            {products.map((product) => (
              <Col key={product.id} sm={6} lg={3}>
                <Card
                  className="h-100 border-0 shadow-sm hover-card"
                  onClick={() => handleProductClick(product)}
                  style={{ cursor: "pointer", transition: "all 0.3s" }}
                >
                  <div className="p-5 text-center bg-light">
                    <div style={{ fontSize: "4rem" }} className="mb-3">
                      {product.image}
                    </div>
                    <span className="badge bg-primary rounded-pill">
                      {product.category}
                    </span>
                  </div>
                  <Card.Body>
                    <Card.Title className="fw-bold">{product.name}</Card.Title>
                    <Card.Text className="text-muted small">
                      {product.description.length > 80
                        ? product.description.substring(0, 80) + "..."
                        : product.description}
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-primary fw-semibold">
                        {product.price}
                      </span>
                      <i className="bi bi-chevron-right text-muted"></i>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Product Detail Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        {selectedProduct && (
          <>
            <Modal.Header closeButton className="border-0">
              <Modal.Title className="w-100 text-center">
                <div className="p-4 bg-light rounded mb-3">
                  <div style={{ fontSize: "5rem" }} className="mb-3">
                    {selectedProduct.image}
                  </div>
                  <span className="badge bg-primary">
                    {selectedProduct.category}
                  </span>
                </div>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-4 pb-4">
              <h2 className="fw-bold mb-3">{selectedProduct.name}</h2>
              <p className="text-muted mb-4">{selectedProduct.description}</p>

              <h5 className="fw-bold mb-3">Đặc điểm nổi bật:</h5>
              <ul className="list-unstyled mb-4">
                {selectedProduct.features.map((feature, index) => (
                  <li key={index} className="d-flex align-items-start mb-2">
                    <i className="bi bi-check-circle-fill text-success me-2 mt-1"></i>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-light p-4 rounded mb-4">
                <p className="text-muted small mb-2">Giá sản phẩm:</p>
                <p className="display-6 fw-bold text-primary mb-0">
                  {selectedProduct.price}
                </p>
              </div>

              <div className="d-flex gap-3">
                <Button variant="primary" className="flex-fill">
                  Đặt hàng ngay
                </Button>
                <Button
                  variant="outline-secondary"
                  className="flex-fill"
                  onClick={handleCloseModal}
                >
                  Đóng
                </Button>
              </div>
            </Modal.Body>
          </>
        )}
      </Modal>

      {/* Benefits Section */}
      <section id="benefits" className="py-5 bg-light">
        <Container className="my-5">
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold mb-3">Tại sao chọn chúng tôi?</h2>
            <p className="lead text-muted">
              Cam kết mang đến sản phẩm và dịch vụ tốt nhất cho khách hàng
            </p>
          </div>

          <Row className="g-4">
            {benefits.map((benefit, index) => (
              <Col key={index} md={6}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-start">
                      <div
                        className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0"
                        style={{
                          width: "50px",
                          height: "50px",
                          fontSize: "1.5rem",
                        }}
                      >
                        <i className={benefit.icon}></i>
                      </div>
                      <div className="ms-3">
                        <h5 className="fw-bold mb-2">{benefit.title}</h5>
                        <p className="text-muted mb-0">{benefit.description}</p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-5">
        <Container className="my-5">
          <Row className="g-5">
            <Col lg={6}>
              <h2 className="display-5 fw-bold mb-4">Liên hệ với chúng tôi</h2>
              <p className="text-muted mb-5">
                Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng tư vấn và hỗ trợ
                bạn.
              </p>

              <div className="d-flex flex-column gap-4">
                <div className="d-flex align-items-center">
                  <div className="bg-primary bg-opacity-10 p-3 rounded">
                    <i className="bi bi-telephone-fill fs-4 text-primary"></i>
                  </div>
                  <div className="ms-3">
                    <p className="text-muted small mb-1">Hotline</p>
                    <p className="fw-bold fs-5 mb-0">1900 xxxx</p>
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <div className="bg-primary bg-opacity-10 p-3 rounded">
                    <i className="bi bi-envelope-fill fs-4 text-primary"></i>
                  </div>
                  <div className="ms-3">
                    <p className="text-muted small mb-1">Email</p>
                    <p className="fw-bold fs-5 mb-0">info@jointpharma.vn</p>
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <div className="bg-primary bg-opacity-10 p-3 rounded">
                    <i className="bi bi-geo-alt-fill fs-4 text-primary"></i>
                  </div>
                  <div className="ms-3">
                    <p className="text-muted small mb-1">Địa chỉ</p>
                    <p className="fw-bold fs-5 mb-0">
                      123 Đường ABC, Quận 1, TP.HCM
                    </p>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={6}>
              <Card className="border-0 shadow-lg">
                <Card.Body className="p-4">
                  <h3 className="fw-bold mb-4">Gửi tin nhắn</h3>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Họ và tên</Form.Label>
                      <Form.Control type="text" placeholder="Nhập họ và tên" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="email@example.com"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Số điện thoại</Form.Label>
                      <Form.Control type="tel" placeholder="0xxx xxx xxx" />
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Label>Nội dung</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Nhập nội dung tin nhắn..."
                      />
                    </Form.Group>
                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100 py-2 fw-semibold"
                    >
                      Gửi tin nhắn
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-5">
        <Container>
          <Row className="g-4 mb-4">
            <Col md={4}>
              <div className="d-flex align-items-center mb-3">
                <i className="bi bi-capsule fs-3 text-info me-2"></i>
                <span className="fw-bold fs-4">JointPharma</span>
              </div>
              <p className="text-white-50">
                Đơn vị hàng đầu trong lĩnh vực cung cấp thuốc tiêm khớp chất
                lượng cao tại Việt Nam.
              </p>
            </Col>
            <Col md={4}>
              <h5 className="fw-bold mb-3">Liên kết nhanh</h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <a
                    href="#home"
                    className="text-white-50 text-decoration-none"
                  >
                    Trang chủ
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="#products"
                    className="text-white-50 text-decoration-none"
                  >
                    Sản phẩm
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="#benefits"
                    className="text-white-50 text-decoration-none"
                  >
                    Lợi ích
                  </a>
                </li>
                <li className="mb-2">
                  <a
                    href="#contact"
                    className="text-white-50 text-decoration-none"
                  >
                    Liên hệ
                  </a>
                </li>
              </ul>
            </Col>
            <Col md={4}>
              <h5 className="fw-bold mb-3">Theo dõi chúng tôi</h5>
              <p className="text-white-50 mb-3">
                Cập nhật thông tin mới nhất về sản phẩm và khuyến mãi
              </p>
              <div className="d-flex gap-2">
                <a
                  href="#"
                  className="btn btn-primary rounded-circle"
                  style={{ width: "40px", height: "40px" }}
                >
                  <i className="bi bi-facebook"></i>
                </a>
                <a
                  href="#"
                  className="btn btn-info rounded-circle"
                  style={{ width: "40px", height: "40px" }}
                >
                  <i className="bi bi-twitter"></i>
                </a>
                <a
                  href="#"
                  className="btn btn-danger rounded-circle"
                  style={{ width: "40px", height: "40px" }}
                >
                  <i className="bi bi-instagram"></i>
                </a>
              </div>
            </Col>
          </Row>
          <hr className="border-secondary" />
          <div className="text-center text-white-50">
            <p className="mb-0">
              &copy; 2025 JointPharma. Bản quyền thuộc về công ty.
            </p>
          </div>
        </Container>
      </footer>

      <style jsx="true">{`
        .hover-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175) !important;
        }
        .navbar-nav .nav-link:hover {
          color: #0d6efd !important;
        }
      `}</style>
    </div>
  );
};

export default JointPharmaWebsite;
