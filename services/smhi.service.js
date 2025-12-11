import config from './config.js';


async function fetchTemperature(stationId) {
    // Simulerad funktion för att hämta temperaturdata från SMHI
    // I en riktig implementation skulle du göra ett API-anrop här

    try {
        
        let temperaturUrl = config.smhi.smhiApiBaseUrl + config.smhi.smhiTemperatureStation.replace("{}", stationId);

        await stationExists(stationId); 

        const response = await fetch(
            temperaturUrl, 
                { 
                    headers: { 'Accept': 'application/json', 'User-Agent': 'Node.js' } 
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
        const latestHourResponse = await fetch(temperatureDataUrl, { headers: { 'Accept': 'application/json', 'User-Agent': 'Node.js' } });
        
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
    const response = await fetch(stationUrl);

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
}

export { fetchTemperature };