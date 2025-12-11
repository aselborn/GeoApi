import { fetchTemperature } from "../services/smhi.service.js";

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