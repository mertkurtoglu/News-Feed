import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import datas from "../data/data.json";
import axios from "axios";

const Account = () => {
  // State to manage user data
  const [user, setUser] = useState({
    name: "",
    email: "",
    country: "",
  });

  // States to manage editing
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingCountry, setIsEditingCountry] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user data on mount
  useEffect(() => {
    axios
      .get("http://localhost:8080/account", { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          setUser(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
      });
  }, []);

  // POST request to update user data
  const handlePostRequest = () => {
    setIsSubmitting(true);
    axios
      .post("http://localhost:8080/account", user, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          setIsEditingName(false);
          setIsEditingEmail(false);
          setIsEditingCountry(false);
          setIsSubmitting(false);
        }
      })
      .catch((err) => {
        console.error("Failed to make the POST request:", err);
      });
  };

  // Handle changes in user data fields
  const handleNameChange = (event) => {
    setUser({ ...user, name: event.target.value });
  };

  const handleEmailChange = (event) => {
    setUser({ ...user, email: event.target.value });
  };

  const handleCountryChange = (event) => {
    setUser({ ...user, country: event.target.value });
  };

  return (
    <div>
      <Card className="profile">
        <Card.Body>
          <Card.Title>User Profile</Card.Title>
          <div>
            <>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  name="name"
                  value={user.name}
                  onChange={handleNameChange}
                  disabled={!isEditingName && !isSubmitting}
                />
              </Form.Group>
            </>
          </div>

          <div>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                name="email"
                value={user.email} // Keep it tied to the state
                onChange={handleEmailChange}
                disabled={!isEditingEmail && !isSubmitting}
              />
            </Form.Group>
          </div>

          <div>
            <Form.Group className="mb-3" controlId="formBasicCountry">
              <Form.Label>Country</Form.Label>
              <Form.Select
                aria-label="Country"
                value={user.country}
                onChange={handleCountryChange}
                disabled={!isEditingCountry && !isSubmitting}
              >
                <option>Select country</option>
                {Object.keys(datas.countries).map((countryCode) => (
                  <option key={countryCode} value={countryCode}>
                    {datas.countries[countryCode]}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>

          {isEditingName || isEditingEmail || isEditingCountry ? (
            <>
              <Button variant="primary" onClick={handlePostRequest}>
                Save
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsEditingName(false);
                  setIsEditingEmail(false);
                  setIsEditingCountry(false);
                  setIsSubmitting(false);
                }}
              >
                Cancel
              </Button>
            </>
          ) : null}

          {!(isEditingName || isEditingEmail || isEditingCountry) && (
            <Button
              variant="outline-primary"
              onClick={() => {
                setIsEditingName(true);
                setIsEditingEmail(true);
                setIsEditingCountry(true);
              }}
            >
              Edit
            </Button>
          )}
          <div className="formButton">
            <a className="btn btn-outline-danger" href="/feed">
              Return to Feed
            </a>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Account;
