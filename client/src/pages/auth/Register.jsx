import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import datas from "../../data/data.json";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const countryRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    country: "",
  });

  // Function to handle input changes and update the state
  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to handle country selection and update the state
  const handleCountryChange = (e) => {
    countryRef.current = e.target.value;
    setFormData({
      ...formData,
      country: countryRef.current,
    });
  };

  // Function to handle form submission
  const onSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/register", formData, { withCredentials: true })
      .then((res) => {
        if (res.status === 201) {
          setTimeout(() => {
            navigate("/feed");
          }, 1000);
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 409) {
            alert("Email already exists.");
          } else {
            const errorData = error.response.data.errors;
            let alertMessage = "An error occurred:\n\n";
            for (let i = 0; i < errorData.length; i++) {
              if (errorData[i] && errorData[i].msg) {
                alertMessage += errorData[i].msg + "\n";
              }
            }
            alert(alertMessage);
          }
        } else {
          alert("An error occurred: " + error.message);
        }
      });
  };

  return (
    <>
      <Form className="authenticationForm" onSubmit={(e) => onSubmit(e)}>
        <h2>REGISTER</h2>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" placeholder="Enter name" name="name" value={formData.name} onChange={onChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            name="email"
            value={formData.email}
            onChange={onChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={onChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicCountry">
          <Form.Label>Country</Form.Label>
          <Form.Select size="sm" aria-label="Country" name="country" onChange={handleCountryChange}>
            <option value={""}>Select country</option>
            {Object.keys(datas.countries).map((countryCode) => (
              <option key={countryCode} value={countryCode}>
                {datas.countries[countryCode]}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <p>* Name must be at least 2 characters</p>
        <p>* Password must be at least 6 characters</p>
        <p>* You must select country</p>

        <div className="formButton">
          <Button variant="outline-primary" type="submit">
            Submit
          </Button>
          <a href="/" style={{ textDecoration: "none" }}>
            Already have an account ?
          </a>
        </div>
        <div className="formButton">
          <a className="btn btn-outline-danger" href="/feed">
            Enter without login
          </a>
        </div>
      </Form>
    </>
  );
};

export default Register;
