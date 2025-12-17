import config from './config.js';
import {
    isCacheValid,
    setStations,
    getStationById,
    getStationByName,
    getAllStations,
    clearCache
} from './stationCache.js';




async function fetchTemperature(stationId) {
    // Simulerad funktion för att hämta temperaturdata från SMHI
    // I en riktig implementation skulle du göra ett API-anrop här

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 5 seconds timeout

        
        let temperaturUrl = config.smhi.smhiApiBaseUrl + config.smhi.smhiSpecificStationPath.replace("{}", stationId);

        await stationExists(stationId); 

        const response = await fetch(
            temperaturUrl, 
                { 
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'GeoApi/1.0'
                    }
                }
        );

        if (!response.ok) {
            throw new Error('Error fetching data from SMHI API: ' + response.statusText);
        }
        
    
        const temperatureData = await response.json();

        if (temperatureData.active === false) {
            throw new Error('Station is inactive, no data available');
        }


        // Extract the latest-hour data URL
        const periods = temperatureData.period || [];
        const latestHourPeriod = periods.find(period => period.key === "latest-hour");
        const jsonLink = latestHourPeriod?.link?.find(link => link.type === "application/json");

        const temperatureDataUrl = jsonLink?.href ? jsonLink.href.replace("latest-hour.json", "latest-hour/data.json") : null;

        if (!temperatureDataUrl) {
            throw new Error('Could not find latest-hour data URL');
        }

        console.log('Latest hour data URL:', temperatureDataUrl);
        
        const latestHourResponse = await fetch(temperatureDataUrl, {
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'GeoApi/1.0'
            }
        });
        
        const latestHourData = await latestHourResponse.json();

        console.log('Latest hour temperature data:', latestHourData.value[0].value);

        return { temperature: latestHourData.value[0].value, stationsnamn : latestHourData.station.name };

    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Failed to fetch temperature data');
    }
    
  
}

async function stationExists(stationId) {
    //finns stationen ?
    let stationUrl = config.smhi.smhiApiBaseUrl + config.smhi.smhiSpecificStationPath.replace("{}", stationId);
    const response = await fetch(stationUrl, { headers: { 'Accept': 'application/json', 'User-Agent': 'Node.js' } });

    if (!response.ok || response.status === 500 || response.status === 400) {
        throw new Error('Error fetching data from SMHI API reason =>: ' + response.statusText);
    }
    if (response.status === 404) {
        throw new Error(response.statusText);
    }

    const stationData = await response.json();

    if (!stationData || !stationData.key || stationData.key.length === 0) {
        throw new Error('Station not found or no data available');
    }

    console.log('Station exists:', stationData.key, stationData.title);
    return true;
}

async function fetchSmhiStations() {
    
    try {
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 seconds timeout

        let stationsUrl = config.smhi.smhiApiBaseUrl + config.smhi.smhiAllStations;

        const response = await fetch(
            stationsUrl, 
                { 
                    signal: controller.signal,
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'GeoApi/1.0'
                    }
                }
        );

        if (!response.ok) {
            throw new Error('Error fetching data from SMHI API: ' + response.statusText);
        }

        const stationsData = await response.json();
    
        return stationsData.station.map(station => ({
            stationId: station.key,
            latitude: station.latitude,
            longitude: station.longitude,
            active: station.active,
            from : station.from,
            to : station.to,
            stationsnamn: station.title
        }));

    } catch (error) {
        console.error('Error fetching SMHI stations:', error);
        throw new Error(error.message || 'Failed to fetch SMHI stations');
    }
}

async function fetchAllTemperatures() {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 seconds timeout

        let allTemperaturesUrl = config.smhi.smhiApiBaseUrl + config.smhi.smhiAllSwedenLatestHour;

        const response = await fetch(
            allTemperaturesUrl, 
                { 
                    signal: controller.signal,
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'GeoApi/1.0'
                    }
                }
        );

        if (!response.ok) {
            throw new Error('Error fetching data from SMHI API: ' + response.statusText);
        }

        const allTemperaturesData = await response.json();

        // Map the data to a more usable format
        const temperatures = allTemperaturesData.station.map(station => ({
            stationId: station.key,
            stationsnamn: station.name,
            temperature: station.value // Assuming temperature value is in station.value
        }));

        return temperatures;

    } catch (error) {
        console.error(error);
        throw new Error(error.message || 'Failed to fetch all temperatures data');
    }
}

export { fetchTemperature, fetchSmhiStations, fetchAllTemperatures };