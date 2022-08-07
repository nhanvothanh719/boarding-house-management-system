import React, { Fragment } from "react";
import { Col, Container, Row } from "react-bootstrap";

function PrivacyPolicy() {
  return (
    <Fragment>
      <Container>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <h1 className="mainTitle text-center text-uppercase">
              {" "}
              Privacy Policy
            </h1>
            <div className="bottomLine"></div>
            <Container className="mt-5">
              <p className="textTitle">I. PURPOSE AND SCOPE OF COLLECTION</p>
              <p className="textNormal">
                BeeHouse requires all customers to provide basic information
                including email, phone, username, password, and address.
                BeeHouse uses this information to contact and confirm with
                customers and ensure the interests of customers when necessary.
                The access, registration, and use of BeeHouse mean that
                customers agree and accept to be bound by the provisions of our
                privacy policy. Customers are solely responsible for the
                security and storage of all service use activities under
                registered name, password, email box, and phone number. BeeHouse
                is not responsible for data loss, or confidential information of
                customers accidentally or intentionally caused by customers. In
                addition, customers are responsible for promptly notifying
                BeeHouse about unauthorized use, abuse, breach of security, and
                retention of registered names and passwords of third parties for
                timely resolution.
              </p>

              <p className="textTitle">II. SCOPE OF USE OF INFORMATION</p>
              <p className="textNormal">
                BeeHouse uses the information provided by customers to:
                <br />
                - Provide services.
                <br />
                - Prevent activities that destroy customers' user accounts or
                activities that impersonate customers.
                <br />
                - Contact and deal with customers in special cases.
                <br />
                - Cooperate in providing personal information of customers upon
                request from competent state agencies.
                <br />- Share necessary information with the partner if the
                consent of the customer is obtained.
              </p>

              <p className="textTitle">III. INFORMATION STORAGE TIME</p>
              <p className="textNormal">
                In any case, customer's personal information will be kept
                completely confidential on BeeHouse's server. Customers have the
                right to update, modify and delete the information of these
                personal data. However, in some cases, BeeHouse may still
                recover such information from our database to resolve disputes,
                enforce terms of use, or for technical or legal requirements.
                management related to the safety and operations of BeeHouse.
              </p>

              <p className="textTitle">
                IV. MEDIA AND TOOLS FOR CUSTOMERS TO ACCESS AND EDIT DATA
              </p>
              <p className="textNormal">
                Customers have the right to check, update and adjust their
                personal information by logging in to their account and editing
                personal information.
              </p>
              <p className="textTitle">
                V. COMMITMENT TO CUSTOMERS' PERSONAL INFORMATION SECURITY
              </p>
              <p className="textNormal">
                Customer information on BeeHouse is committed to absolute
                confidentiality according to the personal information protection
                policy. The collection and use of information of each customer
                is only done with the consent of that customer, unless otherwise
                provided for by law. BeeHouse is committed to:
                <br />
                – Do not use, transfer, provide or disclose to any third party
                about the customer's personal information without the permission
                or consent from the customer, unless otherwise provided by law.
                <br />– Absolute confidentiality of all online transaction
                information of customers including invoice information,
                digitized accounting documents at BeeHouse's secure central data
                area.
              </p>
              <br />
            </Container>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
}

export default PrivacyPolicy;
