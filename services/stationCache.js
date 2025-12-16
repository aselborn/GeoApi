let stationList = null;
let stationById = new Map();
let stationByName = new Map();
let lastFetch = 0;

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export function isCacheValid() {
    return stationList && (Date.now() - lastFetch < CACHE_DURATION);
}

export function setStations(stations) {
    stationList = stations;
    stationById.clear();
    stationByName.clear();

    for ( const s of stations ) {
        stationById.set(s.stationId, s);
        stationByName.set(s.stationsnamn.toLowerCase(), s);
    }

    lastFetch = Date.now();
}

export function getStationById(stationId) {
    return stationById.get(String(stationId) || null);
}

export function getStationByName(stationsnamn) {
    return stationByName.get(stationsnamn.toLowerCase() || null);
}

export function getAllStations() {
    return stationList;
}

export function clearCache() {
    stationList = null;
    stationById.clear();
    stationByName.clear();
    lastFetch = 0;
}