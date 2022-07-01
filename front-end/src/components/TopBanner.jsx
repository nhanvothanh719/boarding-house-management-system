import React, { Component, Fragment } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import '../assets/css/custom.css';

export class TopBanner extends Component {
  render() {
    return (
      <Fragment>
        <Container fluid={true} className='topBanner p-0'>
          <div className='topBannerCover'>
            <Container className='topBannerContent'>
              <Row>
                <Col className='text-center'>
                <h1 className='topBannerTitle'>WELCOME TO BEEHOUSE</h1>
                <h2 className='topBannerSubTitle'>--- We help you to manage the boarding house easily ---</h2>
                <br></br>
                <Button className="customButton">Discover more</Button>
                </Col>
              </Row>
            </Container>
          </div>
        </Container>
      </Fragment>
    )
  }
}

export default TopBanner