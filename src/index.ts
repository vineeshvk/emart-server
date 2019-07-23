import { startServer } from './tools/startServer';
import dotenv = require('dotenv');

dotenv.config();

startServer(process.env.PORT || '8734');
