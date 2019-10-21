import React, {useState,useEffect, useMemo} from "react";
import axios from 'axios'
import cookie from 'js-cookie'
import moment from 'moment'
// reactstrap components
import {
  Button,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "reactstrap";

// core components
import "assets/css/hubogspace.css";
import NavbarComponent from "components/Navbars/NavbarComponent";
import DataTable from 'react-data-table-component'

function MyBookingsPage() {

  const [mybookings, setMybookings] = useState([]);
  const token = cookie.get('token')
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
  useEffect(() => {
    getMyBookings()
  }, [])

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
      name: 'Check-In',
      selector: 'check_in',
      sortable: true,
      cell: (row) =>  moment(row.check_in).format('lll')
    },
    {
      name: 'Check-Out',
      selector: 'check_out',
      sortable: true,
      cell: (row) =>  moment(row.check_out).format('lll')
    },
    {
      name: 'Space Name',
      selector: 'space.name',
    },
    {
      name: 'Latest Status',
      selector: 'statuses.value',
    },
    {
      
      cell: () => <Button  color={'neutral'} onClick={handleReview}>Write a Review</Button>,
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
          <Container>
            <DataTable
              title="My Bookings"
              columns={columns}
              data={mybookings}
            />
          </Container>
        </div>
      </div>
    </>
  );
}

export default MyBookingsPage;
