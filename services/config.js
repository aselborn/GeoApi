import dotenv from 'dotenv';

dotenv.config();

const config = {
    smhi: {
        smhiApiBaseUrl: process.env.SMHI_API,
        smhiStationSetPath: process.env.SMHI_STATION_SET,
        smhiSpecificStationPath: process.env.SMHI_SPECIFIK_STATION,
        smhiAllStations: process.env.SMHI_ALL_STATIONS,
        smhiAllSwedenLatestHour: process.env.SMHI_LATEST_HOUR_ALL_SWEDEN
    }
    
};

export default config;