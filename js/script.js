//Nasa API key
const NASA_API_KEY = 'LnfwhBtDW4Y60ZKK4YtfnG8io3Slmq7fk2v1thAj';

// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const getImagesBtn = document.getElementById('getImagesBtn');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);


// Reference to the gallery div so we can update its contents
const gallery = document.getElementById('gallery');

getImagesBtn.addEventListener('click', () => {
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Show a loading message while we wait for the data
  gallery.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">🚀</div>
      <p>Loading space photos...</p>
    </div>
  `;

  // Build the API URL using our key and selected date range
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}&start_date=${startDate}&end_date=${endDate}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      console.log(data); // just to check what we got back
      // Next step: turn this data into gallery items
    })
    .catch(error => {
      console.error('Error fetching APOD data:', error);
      gallery.innerHTML = `<p>Something went wrong. Please try again.</p>`;
    });
});