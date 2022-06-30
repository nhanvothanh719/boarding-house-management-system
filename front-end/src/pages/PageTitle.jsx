import React, { Component, Fragment } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

export class PageTitle extends Component {
  render() {
    return (
        <Fragment>
        <Container fluid={true} className='pageTitle p-0'>
          <div className='pageTitleCover'>
            <Container className='pageTitleContent'>
              <Row>
                <Col className='text-center'>
                <h1 className='pageTitleText'>{this.props.title}</h1>
                </Col>
              </Row>
            </Container>
          </div>
        </Container>
      </Fragment>
    )
  }
}

export default PageTitle