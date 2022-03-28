import {React, useState, useEffect} from 'react';
import Head from 'next/head'
import Image from 'next/image'
import authenticator from "./authenticator";
import { Form, Button, Spinner } from 'react-bootstrap';
import axios from "axios";
import Config from "../config.json";

export default function Dashboard(props) {

  const [live,setLive] = useState("closed");
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [connectTitle, setConnectTitle] = useState("Connect");
  const [startUp, setStartUp] = useState({
    id:"",
    name:"",
    email:"",
    accessToken:"",
    created_at:"",
    webhook_registered:"",
    webhook_url:""
  });

  useEffect(()=>{

    axios({
      method: "get",
      url: Config.baseUrl + "shopify/details?id=" + props.id,
    })
      .then(async (res) => {
        if (res.status != 200) {
          setShowError(true);
        } else {
          console.log(res);
          setStartUp({
            id:res.data.id,
            name:res.data.name,
            email:res.data.email,
            accessToken:res.data.accessToken,
            created_at:res.data.created_at,
            webhook_registered:res.data.webhook_registered,
            webhook_url:res.data.webhook_url
          });
          if(res.data.webhook_url !== "" || res.data.webhook_url !== null){
            setButtonDisabled(true);
            setConnectTitle("Connected");
            setLive("open");
          }
        }
      })
      .catch((err) => {
        console.log(err);
        setShowError(true);
      });


  },[live,buttonDisabled]);

  const callWebhooks = () => {
      setLoading(true);
      console.log(
        "webhooks api called --------------------------------------------"
      );
      axios
        .post(Config.baseUrl + "webhook/register", {
          domain: props.name,
          accessToken: props.accessToken,
        })
        .then((response) => {
          console.log(response);
          alert(response.data.msg);
          setLive("open");
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          alert(error.response.data.msg);
          setLoading(false);
        });
  };

  return (
      <>
        <div className="wrap">
          <header>
            <div className="title">Datastudio Connector</div>
              <div className="btn-wrap">
               {showError ? ( <div className="live-status">ERROR</div>) : (<div className="live-status">LIVE</div>)}
              <div className={`live-btn ${live}`}>&nbsp;</div>
            </div>
         </header>
  
          <div className="main">
            <Form.Group className="mb-3">
              <Form.Label>Shop ID</Form.Label>
              <Form.Control value={startUp.id} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Shop Name</Form.Label>
              <Form.Control value={startUp.name} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Shop Email</Form.Label>
              <Form.Control value={startUp.email} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Webhook Url</Form.Label>
              <Form.Control value={startUp.webhook_url} disabled />
            </Form.Group> 
          {loading ? (<Spinner animation="border" variant="light" />) : (<button
          type="button" 
          className="btn btn-info btn-lg"
          onClick={callWebhooks}
          disabled={buttonDisabled}
          style={{width:"150px"}}
          >{connectTitle}</button>)}     
          </div>
          
        </div>
      </>    
  )
}

export const getServerSideProps = authenticator((context) => {
  const { req } = context;
  console.log("req.session in getserverside props ******", req.session);
  return {
    props: {
      id: req.session.passport.user.id,
      name: req.session.passport.user.name,
      accessToken: req.session.passport.user.accessToken,
      email: req.session.passport.user.email,
      webhook_registered: req.session.passport.user.webhook_registered,
      webhook_url:req.session.passport.user.webhook_url
    },
  };
});