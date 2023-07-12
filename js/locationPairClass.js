export class LocationPair {
  constructor() {
    this.locationPairs = JSON.parse(localStorage.getItem('locationPairs')) || [];
    this.lastSuggestionPairs = []; // Initialize lastSuggestionPairs

    // Bind the methods to 'this'
    this.addLocationPair = this.addLocationPair.bind(this);
    this.removeLocationPair = this.removeLocationPair.bind(this);
    this.displayLocationPairs = this.displayLocationPairs.bind(this);
  }

  addLocationPair(pair, isSuggested) {
    console.log('addLocationPair called with pair:', pair, 'and isSuggested:', isSuggested);
    this.locationPairs.push(pair);
    if (!isSuggested) {
      localStorage.setItem('locationPairs', JSON.stringify(this.locationPairs));
      console.log('addLocationPair isSuggested = false');
    } else {
      console.log('addLocationPair isSuggested = true');
    }
    this.displayLocationPairs(this.locationPairs);
  }

  removeLocationPair(pairOrElement) {
    console.log('removeLocationPair called with:', pairOrElement);
    let pair;
    if (pairOrElement instanceof HTMLElement) { // if an HTMLElement was passed
      const index = pairOrElement.dataset.index;
      pair = this.locationPairs[index];
    } else { // if a pair object was passed
      pair = pairOrElement;
    }

    const index = this.locationPairs.findIndex(
      storedPair => storedPair.airportACode === pair.airportACode && storedPair.airportBCode === pair.airportBCode
    );
    console.log('removeLocationPair fn - index :' + index);
    console.log('removeLocationPair found pair at index:', index, 'pair:', pair);

    if (index !== -1) {
      this.locationPairs.splice(index, 1);
      // only write to local storage if the pair isn't a suggested pair
      if (!pair.isSuggested) {
        localStorage.setItem('locationPairs', JSON.stringify(this.locationPairs));
      }
      this.displayLocationPairs(this.locationPairs);
    }
  }

  displayLocationPairs() {
    console.log('displayLocationPairs called with:', this.locationPairs);
    const locationPairTags = document.getElementById('location-pair-tags');
    locationPairTags.innerHTML = '';
    this.locationPairs.forEach((pair, index) => {
      const tag = document.createElement('div');
      tag.classList.add('tag');

      console.log('displayLocationPairs - isSuggested:', pair.isSuggested);

      // if pair is a suggested one, add a 'suggested' class to the tag
      if (pair.isSuggested) {
        tag.classList.add('suggested');
      }

      tag.dataset.index = index;

      const mainContent = document.createElement('div');
      mainContent.classList.add('main-content');
      tag.appendChild(mainContent);

      const mainLabel = document.createElement('span');
      mainLabel.textContent = `${pair.airportACode} - ${pair.airportBCode}`;
      mainContent.appendChild(mainLabel);

      const deleteButtonWrapper = document.createElement('div');
      deleteButtonWrapper.classList.add('delete-button-wrapper');
      mainContent.appendChild(deleteButtonWrapper);
      
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'x';
      deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        this.removeLocationPair(tag);
      });
      deleteButtonWrapper.appendChild(deleteButton);

      const additionalInfo = document.createElement('div');
      additionalInfo.classList.add('additional-info');
      additionalInfo.innerHTML = 
      `<div class="tag-content">
      <div class="header">
        <hr class="separator">
        <span class="airport-name";">${pair.airportAName} (${pair.airportACode})</span>
      </div>
      <div class="airport-info">
        <p>Country: ${pair.airportACountry}</p>
        <p>Latitude: ${pair.airportALat}</p>
        <p>Longitude: ${pair.airportALon}</p>
      </div>
      <div class="header">
        <hr class="separator">
        <span class="airport-name";">${pair.airportBName} (${pair.airportBCode})</span>
      </div>
      <div class="airport-info">
        <p>Country: ${pair.airportBCountry}</p>
        <p>Latitude: ${pair.airportBLat}</p>
        <p>Longitude: ${pair.airportBLon}</p>
      </div>
    </div>`

      tag.appendChild(additionalInfo);

      tag.addEventListener('click', () => {
        tag.classList.toggle('expanded');
      });

      locationPairTags.appendChild(tag);
    });
  }
}
export const locationPair = new LocationPair();