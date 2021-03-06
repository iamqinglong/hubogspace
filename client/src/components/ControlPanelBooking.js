
import React,{useState,useEffect,useMemo} from 'react';
import axios from 'axios'
import moment from 'moment'
import cookie from 'js-cookie'
import StripeCheckout from 'react-stripe-checkout'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignatureCanvas from 'react-signature-canvas'
import { Link } from "react-router-dom";
//components
import { 
  Button, 
  Modal,
  Input } from "reactstrap";
import DataTable from 'react-data-table-component'
toast.configure()

const ControlPanelBooking = (props) => {

  const [spaceWithBookings, setSpaceWithBookings] = useState([])
  const [modalLive, setModalLive] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');
  const [selectedRow, setSelectedRow] = useState(null);
  const [sigPad, setSigPad] = useState({});
  const [trimmedDataURL, setTrimmedDataURL] = useState(null);
  const token = cookie.get('token')

  const handleClickSelectedMethod = async () => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    if(selectedMethod === 'pay'){
      try {
        const res = await axios.post(`http://localhost:8000/api/payInCash/${selectedRow.id}`)
        console.log(res.data)
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          });
          updateBookings(res.data.data[0])
          setModalLive(false)
      } catch (error) {
        if(error.response.status !== undefined && error.response.status === 422)
        {
          toast.warn(error.response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            });
        }
      }
    }
    else if(selectedMethod === 'checkIn' || selectedMethod === 'checkOut')
      setTrimmedDataURL( sigPad.getTrimmedCanvas().toDataURL('image/png') )
    else if(selectedMethod === 'cancel'){
      try {
        console.log(selectedRow)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const res = await axios.post(`http://localhost:8000/api/lessorCancelBooking/${selectedRow.id}`)
        console.log(res.data)
        if(res.data.state){
  
          toast.success(res.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            });
  
            console.log(res.data.booking[0])
            updateBookings(res.data.booking[0])
            setModalLive(false)
        }
      } catch (error) {
        if(error.response.status !== undefined && error.response.status === 422)
        {
          toast.warn(error.response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            });
        }
      }
    }
    
  }

  const handleSelectPaymentMethod =(e)=>{
    setSelectedPaymentMethod(e.target.value)
  }
  //either checkIn or checkOut
  const sendCheckInOrCheckOut = async ()=> {
    try {
   
        
        const fd = new FormData()
        fd.append('signature',trimmedDataURL)

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const res = await axios.post(`http://localhost:8000/api/${selectedMethod}/${selectedRow.id}`,fd, { headers: {
          'Content-Type': 'multipart/form-data'
        }})
        
       if(res.data.state){
          toast.success(res.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            });
          updateBookings(res.data.booking[0])
          setModalLive(false)
       }
       
    } catch (error) {
      console.log(error)
    }
  }
  const handleToken = async(token,addresses)=>{
    console.log(token,addresses)
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${cookie.get('token')}`;
      
      const res = await axios.post(`http://localhost:8000/api/lessorCancelBooking/${selectedRow.id}`,{token})
      if(res.data.state){
        toast.success(res.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          });
          
          updateBookings(res.data.data[0])
          
      }
      else{
        toast.warn(res.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          });
      }
      setModalLive(false)
      
      // console.log(res.data)
    } catch (error) {
      if(error.response.status !== undefined && error.response.status === 422)
      {
        toast.warn(error.response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          });
      }
    }

  }
  const updateBookings = (data) => {
    console.log(data)
    let newData = [...spaceWithBookings];
    console.log(newData)
    let bookings = newData[0].bookings.map(booking => (booking.id === data.id ? {...data} : booking) )
    newData[0].bookings = [...bookings]
    console.log(newData)
    setSpaceWithBookings([...newData])
  }

  const getSpaceWithBookings =async()=> {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await axios.post(`http://localhost:8000/api/getSpaceWithBookings`)
      console.log(res.data)
      setSpaceWithBookings(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getSpaceWithBookings()
  }, [])

  useEffect(() => {
    console.log(selectedRow)
  }, [selectedRow])

  useEffect(() => {

    if(trimmedDataURL !== null){
      sendCheckInOrCheckOut()
    }

  }, [trimmedDataURL])
  
  
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
        row.statuses.sort((a, b) => (a.date > b.date) ? 1 : -1)
        return row.statuses[row.statuses.length-1].value
      }
    },
    {
      cell: (row) => {
        if(!row.statuses.some(status => status.key === 'paid')
        && !row.statuses.some(status => status.key === 'paid') 
        && moment().isBefore(moment(row.expected_arrival).subtract(1, 'hours')) 
        && !row.statuses.some(status => status.key === 'cancel'))
          return <Button color="primary" size="md" type="button" onClick={()=>{
            setModalLive(true)
            setSelectedMethod('pay')
            setSelectedRow(row)
          }}>Pay</Button>
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      cell: (row) => {
        if(row.statuses.some(status => status.key === 'paid') && !row.statuses.some(status => status.key === 'checkIn') && !row.statuses.some(status => status.key === 'cancel'))
          return <Button color="primary" size="md" type="button" onClick={()=>{
            setModalLive(true)
            setSelectedMethod('checkIn')
            setSelectedRow(row)
          }}>Check-In</Button>
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      cell: (row) => {
        if(row.statuses.some(status => status.key === 'paid') && !row.statuses.some(status => status.key === 'checkOut') && !row.statuses.some(status => status.key === 'cancel'))
          return <Button color="primary" size="md" type="button" onClick={()=>{
            setModalLive(true)
            setSelectedMethod('checkOut')
            setSelectedRow(row)
          }}>Check-Out</Button>
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      
      cell: (row) => {
                  if( !row.statuses.some(status => status.key === 'cancel') &&
                      ( moment().isBefore(moment(row.expected_arrival).subtract(1, 'hours')) 
                        || (row.statuses.some(status => status.key === 'paid') && !row.statuses.some(status => status.key === 'checkIn') && moment().isBefore(moment(row.expected_arrival).subtract(1, 'hours')) )
                        || ((row.statuses.length <= 1) && moment().isBefore(moment(row.expected_arrival).subtract(1, 'hours')))
                      )
                    )
                    return <Button  color="primary" size="md" onClick={() =>{
                      setSelectedMethod('cancel')
                      setModalLive(true)
                      setSelectedRow(row)
                    }}>Cancel</Button>},

      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      
    },
    {
      cell: (row) => <Button color="primary" size="md" 
                      to={{
                        pathname: '/timeline',
                        state: {
                          statuses: row.statuses
                        }
                    }}
                    tag={Link}
                    >View</Button>
      ,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ], []);

  return (
    <>
      <DataTable
        data={spaceWithBookings.length > 0 ? spaceWithBookings[0].bookings : []}
        columns={columns}
        pagination
      />
      <Modal 
      
      toggle={() => setModalLive(false)} 
      isOpen={modalLive} 
      onClosed={()=> {
      setSelectedPaymentMethod('cash')
      setSelectedRow(null)
      setModalLive(false)
      }}
      
      >
        <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLiveLabel">
          {
            selectedMethod === 'pay' ? ('Payment') : (
              selectedMethod === 'checkIn' ? ('Check-in') : (
                selectedMethod === 'checkOut' ? ('Check-out') : (
                  selectedMethod === 'cancel' ? ('Are you sure ?') : ('')
                )
              )
            )
          }
          </h5>
          <button
            aria-label="Close"
            className="close"
            type="button"
            onClick={() => {
              setSelectedPaymentMethod('cash')
              setModalLive(false)
              setSelectedRow(null)
            }}
          >
            <span aria-hidden={true}>×</span>
          </button>
        </div>
        <div className="modal-body">
            {
              selectedMethod === 'pay' ? (
                <>
                  <b className="text-center">Payment Method</b>
                  <Input onChange={handleSelectPaymentMethod} type="select">
                    <option value="cash">Pay in Cash</option>
                    {
                      spaceWithBookings[0].payments.some(status => status.name === 'Card') ? (
                        <option value="stripe">Pay with Stripe</option>
                      ):('')
                    }
                    
                  </Input>
                  <br/>
                  <h5>Price: $ <b>{spaceWithBookings[0].price}</b></h5>
                </>
              ) : (
                selectedMethod === 'checkIn' ||  selectedMethod === 'checkOut'? (
                  <>
                    <b className="text-center">Draw your Signature below</b>
                    <SignatureCanvas penColor='black'
                    backgroundColor='rgba(0,0,0,0)'
                    ref={(ref) => { setSigPad(ref) }}
                    canvasProps={{width: 450, height: 200, className: 'sigCanvas'}} />
                  </>
                ):(
                  selectedMethod === 'cancel' ? (
                    'You sure you want to cancel this booking ?'
                  ) : ('')
                )
              )
            }
        </div>
        <div className="modal-footer">
          <Button
            color="secondary"
            type="button"
            onClick={() => {
              setSelectedPaymentMethod('cash')
              setModalLive(false)
              setSelectedRow(null)
            }}
          >
            Close
          </Button>
          {
            selectedPaymentMethod === 'cash' ? (
              <Button
                color="primary"
                type="button"
                onClick={handleClickSelectedMethod}
              >
                {
                  selectedMethod === 'pay' 
                  ? ('Pay') : (
                    selectedMethod === 'checkIn'
                  ) ? ('Check-in'):(
                    selectedMethod === 'checkOut' ? (
                      'Check-out'
                    ) : (
                      selectedMethod === 'cancel' ? ('Cancel Booking') : ('')
                    )
                  )
                }
              </Button>
            ) : (
              <StripeCheckout 
                  stripeKey={'pk_test_XtHFdL6fP8UPdJCiWTN2ZmGc00gzVZ1ZxB'}
                  token={handleToken}
                  amount={spaceWithBookings[0].price*100}
                  product={spaceWithBookings[0]}
                  currency={'USD'}
              />
            )
          }
          
        </div>
      </Modal>
    </>
  );
}

export default ControlPanelBooking;