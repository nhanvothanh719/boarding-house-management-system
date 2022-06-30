import React, { Component, Fragment } from "react";
import { Col, Container, Row } from "react-bootstrap";

export class TermsAndCondition extends Component {
  render() {
    return (
      <Fragment>
        <Container>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <h1 className="mainTitle text-center text-uppercase">
                {" "}
                All terms and condition
              </h1>
              <div className="bottomLine"></div>
              <Container className="mt-5">
                <p className="textTitle">Welcome to our website,</p>
                <p className="textNormal">
                  If you continue to browse and use this website, you are
                  agreeing to comply with and be bound by the following terms
                  and conditions of use, which together with our privacy policy
                  govern BeeHouse’s relationship with you in relation to this
                  website. If you disagree with any part of these terms and
                  conditions, please do not use our website. The term 'BeeHouse'
                  or 'us' or we refers to the owner of the website. The term you
                  refers to the user or viewer of our website.
                </p>
                <p className="textTitle">
                  The use of this website is subject to the following terms of
                  use:
                </p>
                <p className="textNormal">
                  - The content of the pages of this website is for your general
                  information and use only. It is subject to change without
                  notice.
                  <br />
                  - Neither we nor any third parties provide any warranty or
                  guarantee as to the accuracy, timeliness, performance,
                  completeness or suitability of the information and materials
                  found or offered on this website for any particular purpose.
                  You acknowledge that such information and materials may
                  contain inaccuracies or errors and we expressly exclude
                  liability for any such inaccuracies or errors to the fullest
                  extent permitted by law.
                  <br />
                  - Your use of any information or materials on this website is
                  entirely at your own risk, for which we shall not be liable.
                  It shall be your own responsibility to ensure that any
                  products, services or information available through this
                  website meet your specific requirements.
                  <br />
                  - This website contains material which is owned by or licensed
                  to us. This material includes, but is not limited to, the
                  design, layout, look, appearance and graphics. Reproduction is
                  prohibited other than in accordance with the copyright notice,
                  which forms part of these terms and conditions.
                  <br />
                  - All trademarks reproduced in this website, which are not the
                  property of, or licensed to the operator, are acknowledged on
                  the website.
                  <br />
                  - Unauthorized use of this website may give rise to a claim
                  for damages and/or be a criminal offense.
                  <br />- From time to time, this website may also include links
                  to other websites. These links are provided for your
                  convenience to provide further information. They do not
                  signify that we endorse the website. We have no responsibility
                  for the content of the linked.
                </p>
                <br />
              </Container>
            </Col>
          </Row>
        </Container>
      </Fragment>
    );
  }
}

export default TermsAndCondition;
