import React, {useState,useEffect, useMemo} from "react";
import axios from 'axios'
import cookie from 'js-cookie'
import moment from 'moment'

import StripeCheckout from 'react-stripe-checkout'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// reactstrap components
import {
  Button,
  Modal,
  Container,
} from "reactstrap";

// core components
import "assets/css/hubogspace.css";
import NavbarComponent from "components/Navbars/NavbarComponent";
import DataTable from 'react-data-table-component'

function MyBookingsPage() {

  const [mybookings, setMybookings] = useState([]);
  const token = cookie.get('token')

  const [modalLive, setModalLive] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');
  const [selectedRow, setSelectedRow] = useState('');

  const getMyBookings = async (id)=> {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const res = await axios.get(`http://localhost:8000/api/getMyBookings`)
      console.log(res.data)
      setMybookings(res.data.bookings)
    } catch (error) {
      console.log(error)
    }
  }

  const handleReview = async()=> {
    console.log('clicked')
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
      console.log(error)
    }

  }

  const updateBookings = (data) => {
    console.log(data)
    let newData = [...mybookings];
    console.log(newData)
    let bookings = newData.map(booking => (booking.id === data.id ? {...data} : booking) )
    console.log(bookings)
    newData = [...bookings]
    console.log(newData)
    setMybookings([...newData])
  }

  useEffect(() => {
    getMyBookings()
  }, [])

  useEffect(() => {
    console.log(selectedRow)
  }, [selectedRow])
 
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
      
      cell: (row) => <Button color={'neutral'} onClick={handleReview}>View</Button>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },{
      
      cell: (row) => {
        if(row.space.payments.some(status => status.name === 'Card') && !row.statuses.some(status => status.key === 'paid'))
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
      
      cell: (row) => {
                  if(row.statuses.some(status => status.key === 'paid'))
                    return <Button  color={'neutral'} onClick={handleReview}>Write a Review</Button>},
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
            Pay with Stripe
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
           
              <h5>Price: $ <b>{selectedRow && (selectedRow.space.price)}</b></h5>

        </div>
        <div className="modal-footer">
          <Button
            color="secondary"
            type="button"
            onClick={() => setModalLive(false)}
          >
            Close
          </Button>
          
          {
            selectedRow && (
              <StripeCheckout
                  stripeKey={'pk_test_XtHFdL6fP8UPdJCiWTN2ZmGc00gzVZ1ZxB'}
                  token={handleToken}
                  amount={selectedRow.space.price*100}
                  product={selectedRow}
                  currency={'USD'}
              />
            )
          }
              
        </div>
      </Modal>
    </>
  );
}

export default MyBookingsPage;
