import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import firstSlideImage from '../images/Stol_blur.jpg';
import secondSlideImage from '../images/Jdlo_stol_blur01.jpg';
import thirdSlideImage from '../images/burgeros.jpg';
import kuchar1 from '../images/Kuchar1.jpg';
import kuchar2 from '../images/Kuchar2.jpg';
import kuchar3 from '../images/Kuchar3.jpg'
import restauracia from '../images/Backg_restaurante.jpg'
import burger2 from '../images/burger2.jpg'
import čašnik from '../images/čašnik.jpg'

import "../pages/Styles/home.css";

const Home: React.FC = () => {
  const [modalShow, setModalShow] = useState(false);

  const handleClose = () => setModalShow(false);
  const handleShow = () => setModalShow(true);

  // Gallery images data (replace with actual images and captions)
  const galleryImages = [
    {src: kuchar1, caption: 'Chef carlos'},
    {src: kuchar2, caption: 'Cook Marko'},
    {src: kuchar3, caption: 'Cook Javier'},
    {src: čašnik, caption: 'Waiter Slávo'},
    {src: restauracia, caption:'Interior of our restaurant'},
    {src: burger2, caption: 'Our delicious homemade burgers'}
    // ... add more images here
  ];

  return (
    <div className="homepage">
      <Carousel className="carousel-container">
        <Carousel.Item>
          <img
            className="d-block carousel-image"
            src={firstSlideImage}
            alt="6 Star rating"
          />
          <Carousel.Caption>
            <h3>Our restaurant has 6 star rating</h3>
            <p>After visit  of one of the best Czech chefs, Zdeněk Pohlreich. Our restaurant recieved 6 star rating. </p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block carousel-image"
            src={secondSlideImage}
            alt="Second slide"
          />
          <Carousel.Caption>
            <h3>One of the best foods in Europe</h3>
            <p>We serve one of the most delicious foods in whole europe.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block carousel-image"
            src={thirdSlideImage}
            alt="Third slide"
          />
          <Carousel.Caption>
            <h3>Elite personel</h3>
            <p>We have one of the best and most experienced chefs, that worked in the most prestigious restaurants.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      {/* ... */}
      {/* About Us Section */}
      <Accordion defaultActiveKey="0" className="my-3">
        <Accordion.Item eventKey="0">
          <Accordion.Header>About Us</Accordion.Header>
          <Accordion.Body>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce at ultrices nibh, eu ornare quam. Fusce tincidunt orci nisi, fringilla aliquam nunc mollis a. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam dapibus aliquam mi at dignissim. Donec vitae molestie libero, aliquam imperdiet lectus. Aenean purus felis, tempus et libero eu, feugiat interdum turpis. Sed risus mauris, vehicula in eleifend vel, vulputate elementum risus. Suspendisse cursus sapien eu rutrum fringilla. Curabitur tempor dignissim pellentesque. Aliquam facilisis erat nec erat convallis, at aliquam libero mattis. Sed placerat purus et convallis lacinia. Ut nec suscipit sem. Proin scelerisque quam quis nunc accumsan, sed facilisis elit posuere. Morbi tristique quam vel odio placerat suscipit. Mauris porttitor gravida tellus ut tincidunt. Sed iaculis sed nulla ac commodo.

Aliquam tincidunt cursus mi ut interdum. Aenean urna orci, sollicitudin id semper vitae, porttitor quis lacus. Vivamus placerat eu turpis nec aliquam. Donec sit amet lobortis purus, in pretium ipsum. Maecenas a enim eu velit porta laoreet. Donec pellentesque nulla mollis lacus porta porttitor. Sed semper eleifend dui ultricies porttitor. Nulla facilisi. Aliquam erat volutpat. Pellentesque at metus accumsan, mollis quam at, sollicitudin turpis.

Vivamus feugiat facilisis tellus eget elementum. Duis rutrum feugiat tincidunt. Suspendisse potenti. In egestas diam eleifend, vestibulum velit eget, viverra mauris. Nam efficitur imperdiet
            {/* Add more about us text here */}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* Gallery Section */}
      <Button variant="primary" onClick={handleShow} className="my-3">
        View Gallery
      </Button>

      <Modal show={modalShow} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>Gallery</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Replace 'p' with 'img' tags and provide correct paths for images */}
          {galleryImages.map((image, index) => (
            <div key={index}>
              <img src={image.src} alt={`Slide ${index}`} style={{ width: '100%', marginBottom: '20px' }} />
              <p>{image.caption}</p>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Contact Information Section */}
      <Accordion defaultActiveKey="0" className="my-3">
        <Accordion.Item eventKey="0">
          <Accordion.Header>Contact Information</Accordion.Header>
          <Accordion.Body>
            <strong>Address:</strong> 1234 Delight Street, FoodVille, FL 56789<br />
            <strong>Phone Number:</strong> (123) 456-7890
            {/* Add more contact information here */}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default Home;
