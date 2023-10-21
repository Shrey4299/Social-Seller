require("dotenv").config();

const express = require("express");

const http = require("http"); // Added this line
const app = express();
const server = http.createServer(app);

module.exports = { server, app };
