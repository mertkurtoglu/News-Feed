import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Function to handle input changes and update the state
  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Function to handle form submission
  const onSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/", formData, { withCredentials: true })
      .then((res) => {
        if (res.status === 201) {
          setTimeout(() => {
            navigate("/feed");
          }, 1000);
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            alert("Invalid email or password");
          } else {
            const errorData = error.response.data.errors;
            let alertMessage = "An error occurred:\n\n";

            if (errorData[0] && errorData[0].msg) {
              alertMessage += errorData[0].msg + "\n";
            }

            if (errorData[1] && errorData[1].msg) {
              alertMessage += errorData[1].msg + "\n";
            }
            alert(alertMessage);
          }
        } else if (error.request) {
          alert("No response received from the server.");
        } else {
          alert("An error occurred: " + error.message);
        }
      });
  };

  return (
    <>
      <Form className="authenticationForm" onSubmit={(e) => onSubmit(e)}>
        <h2>LOGIN</h2>
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

        <div className="formButton">
          <Button variant="outline-primary" type="submit">
            Submit
          </Button>
          <a href="/register" style={{ textDecoration: "none" }}>
            Don't you have an account ?
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

export default Login;
