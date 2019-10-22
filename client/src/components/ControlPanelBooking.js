
import React,{useState,useEffect,useMemo} from 'react';
import axios from 'axios'
import moment from 'moment'

//components
import { 
  Button, 
  Modal,
  FormGroup,
  Input } from "reactstrap";
import DataTable from 'react-data-table-component'

const ControlPanelBooking = (props) => {

  const [spaceBooking, setSpaceBooking] = useState([])
  const [modalLive, setModalLive] = useState(false);

  const handleSelectMethod = (e) => {
    console.log(e.target.value)
  }
  useEffect(() => {
    getSpaceBooking()
  }, [])

  const getSpaceBooking =async()=> {
    try {
      const res = await axios.post(`http://localhost:8000/api/getSpaceBooking`)
      setSpaceBooking(res.data)
    } catch (error) {
      console.log(error)
    }
  }
  
  const columns = useMemo(() => [
  
    {
      name: 'Expected Arrival',
      sortable: true,
      cell: (row) =>  moment(row.expected_arrival).format('lll')
    },
    {
      name: 'Booked',
      sortable: true,
      cell: (row) =>  moment(row.created_at).format('lll')
    },
    {
      name: 'Booker Name',
      cell: (row) =>  row.user.first_name +' '+row.user.last_name
    },
    {
      name: 'Latest Status',
      selector: 'statuses.value',
      cell: (row) =>  {
        row.statuses.sort((a, b) => (a.date > b.date) ? -1 : 1)
        return row.statuses[row.statuses.length-1].value
      }
    },
    {
      cell: (row) => {
        if(!row.statuses.some(status => status.key === 'paid'))
          return <Button color="primary" type="button" onClick={()=>{
            setModalLive(true)
          }}>Pay</Button>
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      cell: (row) => {
        if(!row.statuses.some(status => status.key === 'check_in'))
          return <Button color="primary" type="button" onClick={()=>{
            setModalLive(true)
          }}>Check-In</Button>
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      cell: (row) => {
        if(!row.statuses.some(status => status.key === 'check_out'))
          return <Button color="primary" type="button" onClick={()=>{
            setModalLive(true)
          }}>Check-Out</Button>
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ], []);

  return (
    <>
      <DataTable
        data={spaceBooking}
        columns={columns}
      />
      <Modal toggle={() => setModalLive(false)} isOpen={modalLive}>
        <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLiveLabel">
            Update
          </h5>
          <button
            aria-label="Close"
            className="close"
            type="button"
            onClick={() => setModalLive(false)}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <div className="modal-body">
            
        </div>
        <div className="modal-footer">
          <Button
            color="secondary"
            type="button"
            onClick={() => setModalLive(false)}
          >
            Close
          </Button>
          <Button
            color="primary"
            type="button"
            onClick={() => setModalLive(false)}
          >
            Update
          </Button>
        </div>
      </Modal>
    </>
  );
}

export default ControlPanelBooking;