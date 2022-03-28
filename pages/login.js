import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Form, Button } from 'react-bootstrap';
import logo from "../public/logo.jpg"


export default function LoginAdmin() {
  return (
      <div className="LoginWrapper">
      <div className="LogoWrapper">
      <Image src={logo} alt="Logo" height="200px" width="200px" /> 
      </div>  
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <Button style={{width:"100%"}} variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      </div>    
  )
}
