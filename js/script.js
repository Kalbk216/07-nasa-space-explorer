const NASA_API_KEY = 'LnfwhBtDW4Y60ZKK4YtfnG8io3Slmq7fk2v1thAj';

// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const getImagesBtn = document.getElementById('getImagesBtn');
const gallery = document.getElementById('gallery');

// Modal elements
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');
const modalVideo = document.getElementById('modalVideo');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

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
      // Clear the loading message
      gallery.innerHTML = '';

data.forEach(item => {
  const galleryItem = document.createElement('div');
  galleryItem.className = 'gallery-item';

  if (item.media_type === 'video') {
    // Show a placeholder card for videos instead of a broken image
    galleryItem.innerHTML = `
      <div class="video-thumb">
        <span class="video-icon">▶️</span>
        <p>Video — click to watch</p>
      </div>
      <h3>${item.title}</h3>
      <p>${item.date}</p>
    `;
  } else {
    // Normal image card
    galleryItem.innerHTML = `
      <img src="${item.url}" alt="${item.title}" />
      <h3>${item.title}</h3>
      <p>${item.date}</p>
    `;
  }

  // When this card is clicked, open the modal with this item's data
  galleryItem.addEventListener('click', () => {
    modalTitle.textContent = item.title;
    modalDate.textContent = item.date;
    modalExplanation.textContent = item.explanation;

    if (item.media_type === 'video') {
      // Replace the image element with an embedded video iframe
      modalImg.style.display = 'none';
      modalVideo.style.display = 'block';
      modalVideo.src = item.url;
    } else {
      modalImg.style.display = 'block';
      modalVideo.style.display = 'none';
      modalVideo.src = ''; // stop any video that might be playing
      modalImg.src = item.url;
      modalImg.alt = item.title;
    }

    modal.classList.remove('hidden');
  });

  gallery.appendChild(galleryItem);
});
    .catch(error => {
      console.error('Error fetching APOD data:', error);
      gallery.innerHTML = `<p>Something went wrong. Please try again.</p>`;
    });
});

// Close modal when the × is clicked
modalClose.addEventListener('click', () => {
  modal.classList.add('hidden');
});

// Also close modal when clicking outside the content box
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.classList.add('hidden');
  }
});