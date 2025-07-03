// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Function to fetch NASA's APOD data for the selected date range
function fetchNasaApodData() {
  // Get the selected start and end dates from the input fields
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Show a loading message before fetching data
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">🚀 images on the way!</div>
      <p>Loading space photos…</p>
    </div>
  `;

  // NASA APOD API endpoint and demo API key
  const apiKey = 'qtuzT16kZt1mlnamvbEpaGli91w5mMVfu2LRyTff'; // Replace with your own API key for more requests
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;

  // Fetch data from the API
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      // Call function to display the gallery
      showGallery(data);
    })
    .catch(error => {
      console.error('Error fetching NASA APOD data:', error);
    });
}

// Function to display the gallery of images
function showGallery(apodArray) {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '';

  apodArray.forEach(apod => {
    if (apod.media_type === 'image') {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      item.innerHTML = `
        <img src="${apod.url}" alt="${apod.title}" class="apod-img">
        <h3>${apod.title}</h3>
        <p><strong>Date:</strong> ${apod.date}</p>
        <p>${apod.explanation}</p>
      `;
      // Add click event to open modal with image details
      item.addEventListener('click', function() {
        openModal(apod);
      });
      gallery.appendChild(item);
    }
  });

  if (gallery.children.length === 0) {
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">🚫</div>
        <p>No images found for this date range.</p>
      </div>
    `;
  }
}

// Function to create and show a modal window with image details
function openModal(apod) {
  // Remove any existing modal
  const oldModal = document.getElementById('apod-modal');
  if (oldModal) oldModal.remove();

  // Create modal overlay
  const modal = document.createElement('div');
  modal.id = 'apod-modal';
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100vw';
  modal.style.height = '100vh';
  modal.style.background = 'rgba(0,0,0,0.7)';
  modal.style.display = 'flex';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';
  modal.style.zIndex = '1000';

  // Modal content box
  const modalContent = document.createElement('div');
  modalContent.style.background = ' #205493';
  modalContent.style.borderRadius = '8px';
  modalContent.style.maxWidth = '700px';
  modalContent.style.width = '90%';
  modalContent.style.padding = '20px';
  modalContent.style.position = 'relative';
  modalContent.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
  modalContent.style.textAlign = 'center';

  // Close button
  const closeBtn = document.createElement('span');
  closeBtn.innerHTML = '&times;';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '10px';
  closeBtn.style.right = '20px';
  closeBtn.style.fontSize = '32px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.title = 'Close';

  closeBtn.addEventListener('click', function() {
    modal.remove();
  });

  // Close modal when clicking outside the content
  modal.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.remove();
    }
  });

  // Modal content
  modalContent.innerHTML = `
    <img src="${apod.url}" alt="${apod.title}" style="width:100%;max-height:400px;object-fit:contain;border-radius:4px;">
    <h2 style="margin-top:20px;">${apod.title}</h2>
    <p><strong>Date:</strong> ${apod.date}</p>
    <p style="margin-top:15px;text-align:left;">${apod.explanation}</p>
  `;
  modalContent.appendChild(closeBtn);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
}

// Add event listener to the fetch button
const fetchBtn = document.querySelector('.filters button');
if (fetchBtn) {
  fetchBtn.addEventListener('click', fetchNasaApodData);
}

// Array of fun "Did You Know?" space facts
const spaceFacts = [
  "Did you know? One million Earths could fit inside the Sun!",
  "Did you know? A day on Venus is longer than a year on Venus.",
  "Did you know? Neutron stars can spin 600 times per second.",
  "Did you know? There are more trees on Earth than stars in the Milky Way.",
  "Did you know? Space is completely silent—there’s no air for sound to travel.",
  "Did you know? The footprints on the Moon will be there for millions of years.",
  "Did you know? Jupiter’s Great Red Spot is a giant storm bigger than Earth.",
  "Did you know? Saturn could float in water because it’s mostly gas.",
  "Did you know? The hottest planet in our solar system is Venus.",
  "Did you know? The Milky Way galaxy will collide with the Andromeda galaxy in about 4 billion years."
];

// Function to show a random space fact
function showRandomFact() {
  const factSection = document.getElementById('space-fact');
  // Pick a random fact from the array
  const randomIndex = Math.floor(Math.random() * spaceFacts.length);
  factSection.textContent = spaceFacts[randomIndex];
}

// Call showRandomFact when the page loads
document.addEventListener('DOMContentLoaded', showRandomFact);
