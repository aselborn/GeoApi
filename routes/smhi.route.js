import express from "express";
import { getTemperature } from "../controllers/smhi.controllers.js";
import { getSmhiStations } from "../controllers/smhi.controllers.js";
import { getAllTemperatures } from "../controllers/smhi.controllers.js";

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
 * 
 * /api/temperature/stations:
 *   get:
 *     summary: Hämta lista över alla tillgängliga väderstationer från SMHI
 *     responses:
 *       200:
 *         description: Lyckad förfrågan med stationsdata
 * 
 * /api/temperature/all:
 *   get:
 *     summary: Hämta senaste timmens temperaturdata för alla väderstationer i Sverige från SMHI
 *     responses:
 *       200:
 *         description: Lyckad förfrågan med temperaturdata för alla stationer
 */

export default router;

router.get('/temperature/stations', getSmhiStations);
router.get('/temperature/all', getAllTemperatures);
router.get('/temperature/:stationId', getTemperature);
