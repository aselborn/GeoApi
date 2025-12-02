import express from "express";
import { getTemperature } from "../controllers/smhi.controllers.js";


const router = express.Router();
/**
 * @swagger
 * /api/temperature/{stationId}:
 *   get:
 *     summary: Hämta temperaturdata för en given väderstation från SMHI
 *     parameters:
 *       - in: path
 *         name: stationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID för väderstationen
 *     responses:
 *       200:
 *         description: Lyckad förfrågan med temperaturdata
 */

export default router;
router.get('/temperature/:stationId', getTemperature);