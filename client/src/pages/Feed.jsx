import React, { useEffect, useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import Row from "react-bootstrap/Row";
import datas from "../data/data.json";
import axios from "axios";

function Feed() {
  const [authors, setAuthors] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [secondResponseData, setSecondResponseData] = useState(null);
  const [showCanvas, setShowCanvas] = useState(false);
  const [sources, setSources] = useState("");
  const categoryRef = useRef(null);
  const countryRef = useRef(null);
  const sourceRef = useRef(null);
  const authorRef = useRef(null);
  const filter = { sourceRef, countryRef, categoryRef, authorRef };

  // Get News on mount
  useEffect(() => {
    axios
      .get("http://localhost:8080/feed", { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          setResponseData(res.data);
          setAuthors(res.data.combinedResponse.authors);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
      });
  }, []);

  // Fetch news by category
  const getNewsByCategory = (category) => {
    categoryRef.current = category;
    axios
      .get(`http://localhost:8080/feed/${category}`, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          setSecondResponseData(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch news by category:", err);
      });
  };

  // Function to handle search on button click
  const handleSearchClick = () => {
    searchNews();
    setTimeout(() => {
      setSearchQuery("");
    }, 1000);
  };

  //Function to handle search on enter key press
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      searchNews();
      setTimeout(() => {
        setSearchQuery("");
      }, 1000);
    }
  };

  // Function to handle input changes and update the state
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Function to search news
  const searchNews = () => {
    axios
      .get(`http://localhost:8080/search?q=${searchQuery}`, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          setSecondResponseData(res.data);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch news by search:", err);
      });
  };

  // Show filter canvas
  const handleFilterClick = () => {
    setShowCanvas(true);
  };

  // Close the filter canvas
  const handleCloseCanvas = () => {
    setShowCanvas(false);
  };

  // Get Sources on mount
  useEffect(() => {
    axios
      .get("http://localhost:8080/sources", { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          setSources(res.data.sources);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
      });
  }, []);

  // Function to handle country change
  const handleCountryChange = (event) => {
    countryRef.current = event.target.value;
  };

  // Function to handle source change
  const handleSourceChange = (event) => {
    sourceRef.current = event.target.value;
  };

  // Function to handle source change
  const handleAuthorChange = (event) => {
    authorRef.current = event.target.value;
  };

  // Apply filter
  const handleFilter = () => {
    axios
      .post(`http://localhost:8080/feed/filter`, { filter }, { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          setSecondResponseData(res.data);
          handleCloseCanvas();
          countryRef.current = null;
          sourceRef.current = null;
        }
      })
      .catch((err) => {
        console.error("Failed to fetch news by country:", err);
      });
  };

  // Logout
  const logout = () => {
    axios
      .get("http://localhost:8080/logout", { withCredentials: true })
      .then((res) => {
        if (res.status === 200) {
          window.location.reload(true);
        }
      })
      .catch((err) => {
        console.error("Failed to logout:", err);
      });
  };

  // Generate news cards
  const generateCards = () => {
    const dataToRender = secondResponseData || responseData;
    if (dataToRender && dataToRender.combinedResponse.articles && dataToRender.combinedResponse.articles.length > 0) {
      return dataToRender.combinedResponse.articles.map((data, index) => (
        <Col key={index} xs={12} sm={8} md={6} lg={4}>
          <Card className="feedCard">
            <a href={data.url} style={{ textDecoration: "none", color: "black" }}>
              <Card.Img variant="top" src={data.urlToImage || data.image} style={{ height: "300px" }} />
              <Card.Body>
                <Card.Title>{data.title}</Card.Title>
              </Card.Body>
            </a>
          </Card>
        </Col>
      ));
    } else {
      return null;
    }
  };

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>News Feed</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <div className="col-6">
            <Nav fill variant="tabs">
              <Nav.Link href="/feed">General</Nav.Link>
              <Nav.Link onClick={() => getNewsByCategory("business")}>Business</Nav.Link>
              <Nav.Link onClick={() => getNewsByCategory("entertainment")}>Entertainment</Nav.Link>
              <Nav.Link onClick={() => getNewsByCategory("health")}>Health</Nav.Link>
              <Nav.Link onClick={() => getNewsByCategory("science")}>Science</Nav.Link>
              <Nav.Link onClick={() => getNewsByCategory("sports")}>Sports</Nav.Link>
              <Nav.Link onClick={() => getNewsByCategory("technology")}>Technology</Nav.Link>
            </Nav>
          </div>
          <div className="col-4 searchBox">
            <Nav>
              <FormControl
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchInputChange}
                onKeyDown={handleSearchKeyDown}
              />
              <Button variant="outline-primary" onClick={handleSearchClick}>
                Search
              </Button>
            </Nav>
          </div>
          {responseData && responseData.user ? (
            <div className="col-2">
              <Nav className="justify-content-center">
                <NavDropdown align={"end"} title="User" id="basic-nav-dropdown">
                  <NavDropdown.Item href="/account">Profile</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => logout()}>Logout</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </div>
          ) : (
            <div className="col-2 d-flex justify-content-center">
              <Nav>
                <Nav.Link href="/">Login</Nav.Link>
              </Nav>
            </div>
          )}
        </Navbar.Collapse>
      </Navbar>

      <div className="filterButton">
        <div style={{ marginRight: "auto", marginLeft: "auto", font: "30px bold" }}>
          {categoryRef.current ? categoryRef.current.toUpperCase() : "GENERAL"}
        </div>{" "}
        <Button variant="secondary" onClick={handleFilterClick}>
          Filter
        </Button>
      </div>

      <div className="container">
        <Row>{generateCards()}</Row>
      </div>
      <Offcanvas show={showCanvas} onHide={handleCloseCanvas}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filter</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <h6>Filter By Country</h6>
          <Form.Select className="mb-4" aria-label="Country" onChange={handleCountryChange}>
            <option key={" "} value={" "}>
              Select Country
            </option>
            {Object.keys(datas.countries).map((countryCode) => (
              <option key={countryCode} value={countryCode}>
                {datas.countries[countryCode]}
              </option>
            ))}
          </Form.Select>
          <h6>Filter By Source</h6>
          <Form.Select className="mb-4" aria-label="Source" onChange={handleSourceChange}>
            <option key={" "} value={" "}>
              Select Source
            </option>
            {Object.values(sources).map((source) => (
              <option key={source.id} value={source.id}>
                {source.name}
              </option>
            ))}
          </Form.Select>
          <h6>Filter By Author</h6>
          <Form.Select className="mb-4" aria-label="Author" onChange={handleAuthorChange}>
            <option key={" "} value={" "}>
              Select Author
            </option>
            {Object.values(authors).map((author) => (
              <option key={author.id} value={author.id}>
                {author}
              </option>
            ))}
          </Form.Select>
          <Button variant="primary" onClick={() => handleFilter()}>
            Apply Filter
          </Button>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Feed;
