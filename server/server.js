require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/groups', require('./routes/groups'));
// Mount nested routes for sessions and messages under groups
const groupRouter = express.Router();
app.use('/api/groups', groupRouter);
groupRouter.use('/:id/sessions', require('./routes/sessions'));
groupRouter.use('/:id/messages', require('./routes/messages'));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error Handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
