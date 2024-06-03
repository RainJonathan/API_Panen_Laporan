const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Import routes
const dataRoutes = require('./routes/dataRoutes');

// Use routes
app.use('/data', dataRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
