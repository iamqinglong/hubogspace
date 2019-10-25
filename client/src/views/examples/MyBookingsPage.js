import React, {useState,useEffect, useMemo} from "react";
import axios from 'axios'
import cookie from 'js-cookie'
import moment from 'moment'
import StripeCheckout from 'react-stripe-checkout'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";

// reactstrap components
import {
  Button,
  Modal,
  Container,
  Input,
  Row,
  Col
} from "reactstrap";

// core components
import "assets/css/hubogspace.css";
import NavbarComponent from "components/Navbars/NavbarComponent";
import DataTable from 'react-data-table-component'
import AnimatedRater from "components/AnimatedRater";

function MyBookingsPage() {

  const [mybookings, setMybookings] = useState([]);
  const [errors, setErrors] = useState(null);
  const token = cookie.get('token')
  const [rate, setRate] = useState(0)
  const [description, setDescription] = useState('')
  const [modalLive, setModalLive] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');
  // const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');
  const [selectedRow, setSelectedRow] = useState('');

  const getMyBookings = async (id)=> {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await axios.get(`http://localhost:8000/api/getMyBookings`)
      setMybookings(res.data.bookings)
    } catch (error) {
      console.log(error)
    }
  }

  const reviewAndRate = async()=> {
    try {
      console.log(rate)
      console.log(description)
      axios.defaults.headers.common['Authorization'] = `Bearer ${cookie.get('token')}`;
      const res = await axios.post(`http://localhost:8000/api/reviewAndRate/${selectedRow.id}`,{rate,description})
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
          
      }
      setModalLive(false)
    } catch (error) {
      if(error.response.status !== undefined && error.response.status === 422)
          setErrors(error.response.data.errors)
    }
  }

  const handleCancelBooking = async()=> {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${cookie.get('token')}`;
      const res = await axios.post(`http://localhost:8000/api/bookerCancelBooking/${selectedRow.id}`)
     
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
          setErrors(error.response.data.errors)
    }
  }

  const handleOnChange = async (e,setter) => {
      setter(e.target.value)
  }
  const handleToken = async(token,addresses)=>{
    console.log(token,addresses)
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${cookie.get('token')}`;
      
      const res = await axios.post(`http://localhost:8000/api/bookerPayWithStripe/${selectedRow.id}`,{token})
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
      
      console.log(res.data)
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
    let bookings = mybookings.map(booking => (booking.id === data.id ? {...data} : booking) )
    setMybookings([...bookings])
  }

  useEffect(() => {
    getMyBookings()
  }, [])

  useEffect(() => {
    if(mybookings.length > 0)
      console.log(mybookings)
  }, [mybookings])
 
  useEffect(() => {
    // document.body.classList.add("landing-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    return function cleanup() {
    //   document.body.classList.remove("landing-page");
      document.body.classList.remove("sidebar-collapse");
    };
  });
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
      name: 'Space Name',
      selector: 'space.name',
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
        if(row.space.payments.some(status => status.name === 'Card') 
        && !row.statuses.some(status => status.key === 'paid') 
        && moment().isBefore(moment(row.expected_arrival).subtract(1, 'hours')) 
        && !row.statuses.some(status => status.key === 'cancel'))
            return <Button color={'neutral'} onClick={()=>{
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
      
      cell: (row) => <Button color={'neutral'} to={{
                        pathname: '/timeline',
                        state: {
                          statuses: row.statuses
                        }
                    }}
                    tag={Link}>View</Button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },

    {
      
      cell: (row) => {
                  if(row.statuses.some(status => status.key === 'paid') && !row.statuses.some(status => status.key === 'reviewed'))
                    return <Button  color={'neutral'} onClick={() =>{
                      setSelectedMethod('review')
                      setModalLive(true)
                      setSelectedRow(row)
                    }}>Write a Review</Button>},
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,

    },
    {
      
      cell: (row) => {
                  if( !row.statuses.some(status => status.key === 'cancel') &&
                      ( moment().isBefore(moment(row.expected_arrival).subtract(1, 'hours')) 
                        // || (row.statuses.some(status => status.key === 'paid') && !row.statuses.some(status => status.key === 'checkIn') && moment().isBefore(moment(row.expected_arrival).subtract(1, 'hours')) )
                        // || ((row.statuses.length <= 1) && moment().isBefore(moment(row.expected_arrival).subtract(1, 'hours')))
                      )
                    )
                    return <Button  color={'neutral'} onClick={() =>{
                      setSelectedMethod('cancel')
                      setModalLive(true)
                      setSelectedRow(row)
                    }}>Cancel</Button>},

      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      
    },
  ], []);
  return (
    <>
      <NavbarComponent color={'info'}/>
      <div className="page-header clear-filter" filter-color="blue">
        <div className="content">
          <Container className={'custom-page footer'}>
            <DataTable
              
              title="My Bookings"
              columns={columns}
              data={mybookings}
              pagination
              // paginationPerPage={5}
            />
          </Container>
        </div>
      </div>

      <Modal toggle={() => setModalLive(false)} isOpen={modalLive}>
        <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLiveLabel">
            { 
              selectedMethod === 'pay' ? ('Pay with Stripe') : 
              selectedMethod === 'review' ? 
              ('Write a review and rate it') : selectedMethod === 'cancel' ?
              ('Are you sure ?'): ('')
              
            }
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
           
              
            {
              selectedMethod === 'pay' ? 
              (<h5>Price: $ <b>{selectedRow && (selectedRow.space.price)}</b></h5>) : 
              (
                 selectedMethod === 'review' ? (
                  <>
                  {
                      errors !== null && errors.description  ? (
  
                         errors.description.map((error,index) => <Row className="justify-content-center" key={index}><b style={{color:'red'}}>{error}</b></Row>)
                         
                        ) : ('')
                     
                  }
                  {
                     errors !== null && errors.rate ? (
                      errors.rate.map((error,index) => <Row className="justify-content-center" key={index}><b style={{color:'red'}}>{error}</b></Row>)
                      ) : ('')
                  }
                    <Row className="justify-content-center">
                    
                        <div className="textarea-container">
                          <Input
                            cols="100"
                            name="name"
                            placeholder="Write your review here"
                            rows="4"
                            type="textarea"
                            onChange={(e) => {handleOnChange(e,setDescription)}}
                          ></Input>
                        </div>
                      
                      <Row className="justify-content-center">
                        <AnimatedRater setRate={setRate} className="justify-content-center"/>
                     
                      </Row>
                    </Row>
                  </>
                 ): (
                   selectedMethod === 'cancel' ? (
                     'You sure you want to cancel this booking ?'
                   ): ('')
                 )
               
              )
              
            }

        </div>
        <div className="modal-footer">
          <Button
            color="secondary"
            type="button"
            onClick={() => {
              setModalLive(false)
              setSelectedRow('')
              setSelectedMethod('')
              setErrors(null)
            }}
          >
            Close
          </Button>
          
          {
            selectedMethod === 'pay' ? (
              <StripeCheckout
                  stripeKey={'pk_test_XtHFdL6fP8UPdJCiWTN2ZmGc00gzVZ1ZxB'}
                  token={handleToken}
                  amount={selectedRow.space.price*100}
                  product={selectedRow}
                  currency={'USD'}
              />
            ) : (
              selectedMethod === 'review' ? (
                  <Button
                  color="primary"
                  type="button"
                  onClick={reviewAndRate}
                >
                  Rate Now
                </Button>
              ) : (
                selectedMethod === 'cancel' ? (
                  <Button
                  color="primary"
                  type="button"
                  onClick={handleCancelBooking}
                >
                  Cancel Booked
                </Button>
                ) : ('')
              )
              
            )
          }
              
        </div>
      </Modal>
    </>
  );
}

export default MyBookingsPage;
