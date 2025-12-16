import { fetchTemperature } from "../services/smhi.service.js";
import { fetchSmhiStations } from "../services/smhi.service.js";

export const getTemperature = async (req, res) => {
    try {
        
        const { stationId } = req.params;
        const temperature = await fetchTemperature(stationId);
        
        res.json(
            { 
                "stationId": stationId, 
                "temperature": temperature.temperature, 
                "stationsnamn": temperature.stationsnamn 
            }
        );


    } catch (error) {
        res.status(500).json({ error: error.message });
    };
};  


export const getSmhiStations = async (req, res) => {
    try {
        // Fetch the list of stations from SMHI
        //const stations = await fetchSmhiStations();
        const stations = await fetchSmhiStations();

        res.json(stations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
} ;