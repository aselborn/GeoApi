import { json } from "express";

async function fetchTemperature(stationId) {
    // Simulerad funktion för att hämta temperaturdata från SMHI
    // I en riktig implementation skulle du göra ett API-anrop här
    const mockData = {
        "001": 15.5,
        "002": 20.3,
        "003": 10.0
    };

    return { temperature: mockData[stationId] || null };
}

export { fetchTemperature };