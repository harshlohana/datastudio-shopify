import {React,useState} from "react";
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Form, Button } from 'react-bootstrap';
import logo from "../public/logo.jpg";


export default function Shop() {
  const [shop, setShopName] = useState("");

  const nameChangeHandler = (e) => {
    setShopName(e.target.value);
  };

  const shopApiCaller = (e) => {
    if (shop !== "" && shop.indexOf(".myshopify.com") > 0) {
      var shopValue = shop.replace(/(^\w+:|^)\/\//, "");
      var shopValue = shopValue.replace("/", "");
      window.location.href = "/shopify/new?shop=" + shopValue;
    } else {
      alert("Please enter a valid shop url\nEg. yourstorename.myshopify.com");
    }
  };

  return (
      <>
        <div className="LoginWrapper">
        <div className="LogoWrapper">
        <Image src={logo} alt="Logo" height="200px" width="200px" /> 
        </div>  
        <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Shop name</Form.Label>
            <Form.Control
            type="email" 
            placeholder="shop-name.myshopify.com" 
            onChange={nameChangeHandler}
            required
            />
            </Form.Group>
            <Button
            style={{width:"100%"}} 
            variant="primary" 
            onClick={shopApiCaller}
            >
            Connect
            </Button>
        </Form>
        </div>
      </>    
  )
}