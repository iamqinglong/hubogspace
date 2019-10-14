/*eslint-disable*/
import React from "react";

// reactstrap components
import { Container } from "reactstrap";

function TransparentFooter() {
  return (
    <footer className="footer">
      <Container>
        <nav>
          <ul>

          </ul>
        </nav>
        <div className="copyright" id="copyright">
          © {new Date().getFullYear()}
        </div>
      </Container>
    </footer>
  );
}

export default TransparentFooter;
