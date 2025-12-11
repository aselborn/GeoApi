import dotenv from 'dotenv';

dotenv.config();

const config = {
    smhi: {
        smhiApiBaseUrl: process.env.SMHI_API,
        smhiStationSetPath: process.env.SMHI_STATION_SET,
        smhiSpecificStationPath: process.env.SMHI_SPECIFIK_STATION,
        smhiTemperatureStation: process.env.SMHI_TEMPERATURE_STATION
    }
    
};

export default config;