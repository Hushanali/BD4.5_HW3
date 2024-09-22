const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

const app = express();
const PORT = process.env.PORT || 3000;
let db;

(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
})();

app.get('/', (req, res) => {
  res.status(200).json({ message: 'BD4.5 HW3 Template' });
});

// 1
async function filterKitchenItemsByRating(minRating) {
  let query = 'SELECT * FROM kitchen_items WHERE rating >= ?';
  let result = await db.all(query, [minRating]);

  return { books: result };
}

app.get('/kitchen-items/rating', async (req, res) => {
  try {
    let minRating = req.query.minRating;
    let response = await filterKitchenItemsByRating(minRating);

    if (response.books.length === 0) {
      return res.status(404).json({ message: 'No Keyitems found.' });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2
async function filterKitchenItemsByMaterialRating(material, minRating) {
  let query = 'SELECT * FROM kitchen_items WHERE material = ? AND rating > ?';
  let result = await db.all(query, [material, minRating]);

  return { books: result };
}

app.get('/kitchen-items/material-rating', async (req, res) => {
  try {
    let material = req.query.material;
    let minRating = req.query.minRating;
    let response = await filterKitchenItemsByMaterialRating(
      material,
      minRating
    );

    if (response.books.length === 0) {
      return res.status(404).json({ message: 'No Keyitems found.' });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3
async function filterKitchenItemsOrderedByPrice() {
  let query = 'SELECT * FROM kitchen_items ORDER BY price desc';
  let result = await db.all(query, []);

  return { books: result };
}

app.get('/kitchen-items/ordered-by-price', async (req, res) => {
  try {
    let response = await filterKitchenItemsOrderedByPrice();

    if (response.books.length === 0) {
      return res.status(404).json({ message: 'No Keyitems found.' });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PORT
app.listen(PORT, () => {
  console.log('Server is running on Port 3000');
});
