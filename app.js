const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

app.use(
  cors({
    origin: "",
  })
);
app.use(cors());
const fileUpload = require("express-fileupload");

app.use(express.json());

app.use(bodyParser.json());

app.use(fileUpload());
app.use(express.static("public"));

const PAX8_API_URL = 'https://api.pax8.com/v1';

app.get('/products', async (req, res) => {
  try {
    const { data } = await axios.post(`${PAX8_API_URL}/token`, {
      client_id: 'eRRHW7PA1sSiDEceTDYVpz7GSJTJPPQn',
      client_secret: 'wsMSAPVJ3LcyraUH6weKMTIsngdjInxXFHxkPJn732h2v1NRlyhLmeaMGjQYIN4q',
      audience: 'api://p8p.client',
      grant_type: 'client_credentials'
    });

    const accessToken = data.access_token;

    const response = await axios.get(`${PAX8_API_URL}/products`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    console.log('Response from PAX8 API:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data from PAX8 API:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Function to obtain an access token
async function getAccessToken() {
    try {
        const response = await axios.post('https://api.pax8.com/v1/token', {
            client_id: 'eRRHW7PA1sSiDEceTDYVpz7GSJTJPPQn',
            client_secret: 'wsMSAPVJ3LcyraUH6weKMTIsngdjInxXFHxkPJn732h2v1NRlyhLmeaMGjQYIN4q',
            audience: 'api://p8p.client',
            grant_type: 'client_credentials'
        });

        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching access token:', error);
        throw error;
    }
}

// Function to fetch products for a given page number
async function getProductsForPage(pageNumber, accessToken) {
    try {
        const response = await axios.get(`https://api.pax8.com/v1/products?page=${pageNumber}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        return response.data;
    } catch (error) {
        console.error(`Error fetching products for page ${pageNumber}:`, error);
        throw error;
    }
}

// Function to fetch all products
async function getAllProducts() {
  try {
      const accessToken = await getAccessToken();
      let allProducts = [];
      const totalPages = 171;

      for (let pageNumber = 0; pageNumber < totalPages; pageNumber++) {
          const productsResponse = await getProductsForPage(pageNumber, accessToken);
          console.log(`Page ${pageNumber} response:`, productsResponse);
          allProducts = allProducts.concat(productsResponse.products);
      }

      return allProducts;
  } catch (error) {
      console.error('Error fetching all products:', error);
      throw error;
  }
}

// Example usage
getAllProducts()
  .then(products => {
      console.log('Total products:', products.length);
      console.log('Products:', products);
  })
  .catch(error => {
      console.error('Error:', error);
  });


// all router
app.use("/", (req, res) => {
  res.send("hellw world");
});


module.exports = app;
