import { locationPair } from './locationPairClass.js';

window.addEventListener('DOMContentLoaded', async () => {
  try {
    console.log('Fetching suggestion pairs...');
    const response = await fetch('./data/suggestion_pairs.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    } else {
      const suggestionPairs = await response.json();
      console.log('Successfully fetched suggestion pairs:', suggestionPairs);

      //document.getElementById('suggestions-button').addEventListener('click', () => {
      //  console.log('Suggestions button clicked. Processing suggestion pairs...');
      //  locationPair.lastSuggestionPairs.forEach(pair => {
      //    console.log('Removing suggestion pair:', pair);
      //    locationPair.removeLocationPair(pair, true);
      //  });

        //locationPair.lastSuggestionPairs = [];
      document.getElementById('suggestions-button').addEventListener('click', () => {
        console.log('Suggestions button clicked. Processing suggestion pairs...');
        locationPair.lastSuggestionPairs.forEach(pair => {
          console.log('Removing suggestion pair:', pair);
          locationPair.removeLocationPair(pair, false); // pass false for shouldDisplay
        });
      
        locationPair.displayLocationPairs(locationPair.locationPairs); // display the pairs once after all have been removed
      
        suggestionPairs.forEach(pair => {
          const newPair = {
            airportAName: pair.airportAName,
            airportACode: pair.airportACode,
            airportACountry: pair.airportACountry,
            airportALat: pair.airportALat,
            airportALon: pair.airportALon,
            airportBName: pair.airportBName,
            airportBCode: pair.airportBCode,
            airportBCountry: pair.airportBCountry,
            airportBLat: pair.airportBLat,
            airportBLon: pair.airportBLon,
            isSuggested: true
          };

          if (!locationPair.locationPairs.find(
            storedPair => storedPair.airportACode === newPair.airportACode && storedPair.airportBCode === newPair.airportBCode
          )) {
            console.log('Adding new suggestion pair:', newPair);
            locationPair.addLocationPair(newPair, true);
            locationPair.lastSuggestionPairs.push(newPair);
          }
        });
      });
    }
  } catch (error) {
    console.error('Error while fetching suggestion pairs:', error);
  }
});
