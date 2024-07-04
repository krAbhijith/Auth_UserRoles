require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const { connectDb } = require('./config/database');

const app = express();
app.use(express.json());

connectDb();
app.use('/api/users', authRoutes);
app.use('/api', userRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));