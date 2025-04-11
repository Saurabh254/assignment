const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./swagger');
const sequelize = require('./config/database');

// Routes
const authRoutes = require('./routes/auth');
const examRoutes = require('./routes/exam');
const resultRoutes = require('./routes/result');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Database Connection
sequelize.authenticate()
    .then(() => {
        console.log('Connected to PostgreSQL database');
        // Sync all models
        return sequelize.sync({ alter: true });
    })
    .then(() => {
        console.log('Database synchronized');
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/exam', examRoutes);
app.use('/api/v1/result', resultRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Swagger UI available at http://localhost:${PORT}/api-docs`);
});