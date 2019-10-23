import React,{useState,useEffect} from "react";
import { Timeline, TimelineItem }  from 'vertical-timeline-component-for-react';
import moment from 'moment'
// reactstrap components
import {
  Container,
  Row,
} from "reactstrap";

// core components
import NavbarComponent from "components/Navbars/NavbarComponent";

function TimeLineViewPage(props) {
    const [statuses, setStatuses] = useState([])
    useEffect(() => {
        let data = props.location.state.statuses.sort((a, b) => (a.date > b.date) ? -1 : 1)
       console.log(data)
       setStatuses([...data])
    }, [])
  return (
    <>
      <NavbarComponent color={'info'} />
      <div className="wrapper">
        <div className="section">
            <Container>
            <Row>
            <Timeline lineColor={'#ddd'}>
                {
                    statuses.map((status,index) => 
                        <TimelineItem
                                key={index}
                                dateText={moment(status.date).format('lll')}
                                dateInnerStyle={{ background: '#61b8ff', color: '#000' }}
                                bodyContainerStyle={{
                                background: '#ddd',
                                padding: '20px',
                                borderRadius: '8px',
                                boxShadow: '0.5rem 0.5rem 2rem 0 rgba(0, 0, 0, 0.2)',
                                }}
                        >
                            <h3>{status.value}</h3>
                            
                            {
                                status.image && (
                                <>
                                    <h4>Signature</h4>
                                    <img src={`http://localhost:8000/storage/signatures/${status.image}`}  />
                                </>
                                )
                            }
                          
                        </TimelineItem> 
                    )
                }
                
                
                </Timeline>
            </Row>
            </Container>
        </div>
      </div>
    </>
  );
}

export default TimeLineViewPage;
