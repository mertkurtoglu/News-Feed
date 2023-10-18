const express = require("express");
const app = express();
const cors = require("cors");
const connectMongo = require("./db");
const session = require("express-session");

app.use(
  session({
    secret: "secret", // Replace with a secret key
    resave: false,
    saveUninitialized: true, // You can set this to false if you want to control session creation manually
  })
);

require("dotenv").config();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with the actual URL of your frontend
    credentials: true, // Allow cookies and other credentials to be included in the request
  })
);
app.use(express.json());

// Connect to MongoDB
connectMongo();

require("./route/routeManager")(app);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
