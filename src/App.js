import React, { useState } from 'react';
import { Container, Navbar, Button, Modal, Form, Card, Table } from 'react-bootstrap';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [productQuantity, setProductQuantity] = useState(1);
  const [productDetails, setProductDetails] = useState([]);
  const [totalQuantity, setTotalQuantity] = useState(0);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleProductNameChange = (event) => setProductName(event.target.value);
  const handleProductPriceChange = (event) => setProductPrice(event.target.value);
  const handleProductImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 100000) {
      setProductImage(URL.createObjectURL(file));
    } else {
      setProductImage(null);
    }
  };

  const handleAddToCart = () => {
    if (productName && productPrice && productImage) {
      const newProduct = {
        name: productName,
        price: productPrice,
        image: productImage,
      };
      setProductDetails([...productDetails, newProduct]);
      setProductName('');
      setProductPrice('');
      setProductImage(null);
      setProductQuantity(1);
      setShowModal(false);
    }
  };

  const handleIncreaseQuantity = () => {
    setProductQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecreaseQuantity = () => {
    if (productQuantity > 1) {
      setProductQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const handleAddToBag = (product) => {
    const existingProductIndex = productDetails.findIndex(
      (p) => p.name === product.name && p.price === product.price
    );
  
    if (existingProductIndex !== -1) {
      const updatedProductDetails = [...productDetails];
      const existingProduct = updatedProductDetails[existingProductIndex];
      existingProduct.quantity += productQuantity;
  
      setProductDetails(updatedProductDetails);
    } else {
      const updatedProduct = { ...product, quantity: productQuantity };
      setProductDetails([...productDetails, updatedProduct]);
    }
  
    const updatedTotalQuantity = productDetails.reduce(
      (total, product) => total + product.quantity,
      0
    );
    setTotalQuantity(updatedTotalQuantity);
  
    setProductName('');
    setProductPrice('');
    setProductImage(null);
    setProductQuantity(1);
    setShowModal(false);
  };
  
  const calculateTotalAmount = () => {
    return productDetails.reduce(
      (total, product) => total + parseFloat(product.price) * product.quantity,
      0
    );
  };
  
 
  return (
    <Container>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>My Dashboard</Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Button variant="primary" onClick={handleShowModal}>
            Buy Now
          </Button>
        </Navbar.Collapse>
      </Navbar>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formProductName">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={productName}
                onChange={handleProductNameChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formProductPrice">
              <Form.Label>Product Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter product price"
                value={productPrice}
                onChange={handleProductPriceChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formProductImage">
              <Form.Label>Product Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleProductImageChange}
                required
              />
              {productImage && (
                <img src={productImage} alt="Product" style={{ maxWidth: '100%', marginTop: '10px' }} />
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </Modal.Footer>
      </Modal>

      <div style={{ marginTop: '20px' }}>
        <h2>New Products</h2>
        <div className="card-grid">
          {productDetails.map((product, index) => (
            <Card key={index} style={{ width: '18rem', marginBottom: '20px' }}>
              <Card.Img variant="top" src={product.image} />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>Price: ${product.price}</Card.Text>
                <div className="quantity-controls">
                  <Button variant="secondary" onClick={handleDecreaseQuantity}>
                    -
                  </Button>
                  <span style={{ margin: '0 10px' }}>{productQuantity}</span>
                  <Button variant="secondary" onClick={handleIncreaseQuantity}>
                    +
                  </Button>
                </div>
                <Button variant="primary" onClick={() => handleAddToBag(product)}>
                  Add to Bag
                </Button>
              </Card.Body>
            </Card>
          ))}
        </div>

        <h2>Product Details</h2>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Total Price</th>
          <th>Image</th>
        </tr>
      </thead>
      <tbody>
        {productDetails.map((product, index) => (
          <tr key={index}>
            <td>{product.name}</td>
            <td>${product.price}</td>
            <td>{product.quantity}</td>
            <td>
              {product.quantity && product.price
                ? `$${(product.price * product.quantity).toFixed(2)}`
                : ''}
            </td>
            <td>
              <img src={product.image} alt={product.name} style={{ maxWidth: '50px' }} />
            </td>
          </tr>
        ))}
      </tbody>
    </Table>

    <h2>Total</h2>
    <p>Total Quantity: {totalQuantity || 0}</p>
    <p>Total Amount: ${calculateTotalAmount().toFixed(2) || 0}</p>
  </div>
    </Container>
  );
}

export default App;
