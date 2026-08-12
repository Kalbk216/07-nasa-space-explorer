const NASA_API_KEY = 'LnfwhBtDW4Y60ZKK4YtfnG8io3Slmq7fk2v1thAj';

// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const getImagesBtn = document.getElementById('getImagesBtn');
const gallery = document.getElementById('gallery');

const spaceFacts = [
  "A day on Venus is longer than a year on Venus.",
  "Neutron stars can spin up to 600 times per second.",
  "There are more stars in the universe than grains of sand on all of Earth's beaches.",
  "One million Earths could fit inside the Sun.",
  "Saturn could float in water because it's mostly made of gas.",
  "The footprints on the Moon will likely stay there for millions of years since there's no wind to erode them.",
  "Space is completely silent because there's no atmosphere to carry sound waves.",
  "The Milky Way galaxy will collide with the Andromeda galaxy in about 4.5 billion years.",
  "A full NASA space suit costs about $12 million.",
  "Jupiter has 95 known moons, more than any other planet in our solar system."
];

const spaceFactEl = document.getElementById('spaceFact');
const randomFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
spaceFactEl.innerHTML = `<strong>Did You Know?</strong> ${randomFact}`;

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

// Converts a YouTube "watch" URL into an "embed" URL if needed
function getWatchableVideoUrl(url) {
  if (url.includes('/embed/')) {
    const videoId = url.split('/embed/')[1].split('?')[0];
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
  return url; // already a normal watchable link
}

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
            // Show a link to watch the video instead of embedding it
            modalImg.style.display = 'none';
            modalVideo.style.display = 'block';
            modalVideo.innerHTML = `<a href="${getWatchableVideoUrl(item.url)}" target="_blank" class="video-link">▶️ Watch video on NASA/YouTube</a>`;
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
    })
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