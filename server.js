const express = require('express');
const cors = require('cors');

const app = express();

// --------------------
// Middleware
// --------------------
app.use(express.json());

app.use(cors({
  origin: [
    'http://localhost:4200',
    'https://melodious-kitten-ed60c7.netlify.app'
  ]
}));

// --------------------
// Dummy users
// --------------------
const users = [
  { email: 'admin@recordshop.com', password: 'password', role: 'admin' },
  { email: 'manager@recordshop.com', password: 'password', role: 'manager' },
  { email: 'sales@recordshop.com', password: 'password', role: 'sales' }
];

// --------------------
// Dummy records
// --------------------
let records = [
  {
    id: 1,
    title: 'Californication',
    artist: 'Red Hot Chili Peppers',
    format: 'Vinyl',
    genre: 'Rock',
    releaseYear: 1999,
    price: 29.99,
    stockQty: 8,
    customerId: '',
    customerFirstName: '',
    customerLastName: '',
    customerContact: '',
    customerEmail: ''
  }
];

// --------------------
// AUTH
// --------------------
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({
    email: user.email,
    role: user.role,
    token: 'dummy-token'
  });
});

// --------------------
// RECORDS CRUD
// --------------------
app.get('/api/records', (req, res) => {
  res.json(records);
});

app.get('/api/records/:id', (req, res) => {
  const id = Number(req.params.id);
  const record = records.find(r => r.id === id);

  if (!record) {
    return res.status(404).json({ message: 'Record not found' });
  }

  res.json(record);
});

app.post('/api/records', (req, res) => {
  const newRecord = {
    id: records.length ? Math.max(...records.map(r => r.id)) + 1 : 1,
    ...req.body
  };

  records.push(newRecord);
  res.status(201).json(newRecord);
});

app.put('/api/records/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = records.findIndex(r => r.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Record not found' });
  }

  records[index] = { id, ...req.body };
  res.json(records[index]);
});

app.delete('/api/records/:id', (req, res) => {
  const id = Number(req.params.id);
  records = records.filter(r => r.id !== id);
  res.status(204).send();
});


app.get('/api/formats', (req, res) => {
  res.json(['Vinyl', 'CD', 'Digital']);
});

app.get('/api/genres', (req, res) => {
  res.json(['Rock', 'Pop', 'Jazz', 'Classical', 'HipHop']);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
