import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import firstSlideImage from '../images/shrecik2.jpg'; // Update the path as necessary
import secondSlideImage from '../images/shrecik3.jpg'; // Update the path as necessary
import thirdSlideImage from '../images/shrecikjpg.jpg'; // Update the path as necessary
import "../pages/Styles/home.css";
const Home: React.FC = () => {
  return (
    <div className="homepage">
      <main className="homecontent">
        <Carousel>
          <Carousel.Item>
            <img
              className="d-block carousel-image"
              src={firstSlideImage}
              alt="First slide"
            />
            <Carousel.Caption>
              <h3>First slide label</h3>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block carousel-image"
              src={secondSlideImage}
              alt="Second slide"
            />
            <Carousel.Caption>
              <h3>Second slide label</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block carousel-image"
              src={thirdSlideImage}
              alt="Third slide"
            />
            <Carousel.Caption>
              <h3>Third slide label</h3>
              <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
        <div className="homepage-info">
          <p className="restaurant-description">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempus nibh sed elimttis adipiscing. Fusce in hendrerit purus. 
          </p>
          <div className="restaurant-contact-info">
            <p><strong>Address:</strong> 1234 Delight Street, FoodVille, FL 56789</p>
            <p><strong>Phone:</strong> (123) 456-7890</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
