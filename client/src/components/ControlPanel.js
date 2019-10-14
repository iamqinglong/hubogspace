import React, {useState} from 'react';
import {
  Col,
  FormGroup,
  Label,
  Input,
  Row
} from 'reactstrap'
const Container = ({children}) => <div className="control-panel">{children}</div>;
const ControlPanel = () => {

    const [maximum, setMaximum] = useState('10')
    const setMax =(e)=> {
      // e.pr eventDefault()
      const val = e.target.value 
      console.log(val)
      setMaximum(val)
    }
    return (
      <Container>
          <form>
            <h5>Chose a maximum duration:</h5>
            <Row>
            <Col  lg="5" sm="6">
              <FormGroup check className="form-check-radio">
                <Label check>
                  <Input
                    defaultChecked
                    defaultValue="option2"
                    id="exampleRadios1"
                    name="exampleRadios"
                    type="radio"
                  ></Input>
                  <span className="form-check-sign"></span>
                  10 mins
                </Label>
              </FormGroup>
            </Col>
            <Col  lg="5" sm="6">
            <FormGroup check className="form-check-radio">
                <Label check>
                  <Input
                    defaultValue="option1"
                    id="exampleRadios1"
                    name="exampleRadios"
                    type="radio"
                  ></Input>
                  <span className="form-check-sign"></span>
                  20 mins
                </Label>
              </FormGroup>
            </Col>
            </Row>
          </form>
      </Container>
    );
  
}

export default ControlPanel