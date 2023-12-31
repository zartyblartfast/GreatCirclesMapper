export class LocationPair {
  constructor() {
    this.locationPairs = JSON.parse(localStorage.getItem('locationPairs')) || [];
    this.lastSuggestionPairs = []; // Initialize lastSuggestionPairs
    this.userAddedPairs = [];

    // Bind the methods to 'this'
    this.addLocationPair = this.addLocationPair.bind(this);
    this.removeLocationPair = this.removeLocationPair.bind(this);
    this.displayLocationPairs = this.displayLocationPairs.bind(this);
  }

  addLocationPair(pair, isSuggested) {
    console.log('addLocationPair called with pair:', pair, 'and isSuggested:', isSuggested);
    
    pair.isSuggested = isSuggested || false;
    this.locationPairs.push(pair);

    if (!pair.isSuggested) {
        // Fetch the existing pairs from local storage.
        let existingPairs = JSON.parse(localStorage.getItem('locationPairs')) || [];

        // Add the new pair to the existing pairs.
        existingPairs.push(pair);

        // Update the userAddedPairs property and local storage.
        this.userAddedPairs = existingPairs;
        localStorage.setItem('locationPairs', JSON.stringify(this.userAddedPairs));
        
        console.log('addLocationPair isSuggested = false');
    } else {
        console.log('addLocationPair isSuggested = true');
    }

    this.displayLocationPairs(this.locationPairs);
}

  /*
  removeLocationPair(pairOrElement) {
    console.log('removeLocationPair called with:', pairOrElement);
    let pair;
    if (pairOrElement instanceof HTMLElement) { // if an HTMLElement was passed
      const index = pairOrElement.dataset.index;
      pair = this.locationPairs[index];
    } else { // if a pair object was passed
      pair = pairOrElement;
    }
  */
    removeLocationPair(pairOrElement) {
      console.log('removeLocationPair called with:', pairOrElement);
      let pair;
      if (pairOrElement instanceof HTMLElement) { // if an HTMLElement was passed
        const index = pairOrElement.dataset.index;
        pair = this.locationPairs[index]; // Retrieve the pair object instead of creating a new one
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
    //const locationPairTags = document.getElementById('location-pair-tags');
    const locationPairTags = document.querySelector('.location-pair-tags-container');
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
        // Collapse all other tags
        const allTags = Array.from(locationPairTags.children);
        allTags.forEach(otherTag => {
          if (otherTag !== tag && otherTag.classList.contains('expanded')) {
            otherTag.style.maxHeight = '30px';
            otherTag.classList.remove('expanded');
          }
        });
  
        // If the tag is already expanded, collapse it
        if (tag.classList.contains('expanded')) {
          tag.style.maxHeight = '30px';
        } else {
          // If the tag is not expanded, expand it
          // Use setTimeout to ensure the additional info is rendered before calculating the scroll height
          setTimeout(() => {
            const additionalInfo = tag.querySelector('.additional-info');
            tag.style.maxHeight = `${30 + additionalInfo.scrollHeight}px`;
          }, 0);
        }
        tag.classList.toggle('expanded');
      });
  
      locationPairTags.appendChild(tag);
    });
  }  
}
export const locationPair = new LocationPair();
