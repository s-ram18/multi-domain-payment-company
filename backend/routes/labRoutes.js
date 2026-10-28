import express from 'express';
import { runSecurityTest } from '../controllers/labController.js';

const router = express.Router();

// Lab routes do not block tests with mandatory token so visitors can run live tests directly!
router.post('/run-test', runSecurityTest);

export default router;
