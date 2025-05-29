const forceDatabaseRefresh = false;
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import routes from './routes/index.js';
import { sequelize } from './models/index.js';
const app = express();
const PORT = process.env.PORT || 3001;
// Serves static files in the entire client's dist folder
app.use(express.static('../client/dist'));
app.use(express.json());
app.use(routes);
console.log(`[SERVER LOG] Attempting to sync database. Force refresh: ${forceDatabaseRefresh}`);
console.log(`[SERVER LOG] DB_URL from env: ${process.env.DB_URL ? 'SET' : 'NOT SET'}`);
console.log(`[SERVER LOG] DB_HOST from env: ${process.env.DB_HOST}`);
console.log(`[SERVER LOG] DB_USER from env: ${process.env.DB_USER}`);
console.log(`[SERVER LOG] DB_NAME from env: ${process.env.DB_NAME}`);
sequelize.sync({ force: forceDatabaseRefresh }).then(() => {
    console.log("[SERVER LOG] Database sync successful.");
    app.listen(PORT, () => {
        console.log(`[SERVER LOG] Server is listening on port ${PORT}`);
    });
}).catch(err => {
    console.error("[SERVER LOG] !!! CRITICAL ERROR: Failed to sync database or start server:", err);
    process.exit(1); // Ensure the process exits on critical error
});
