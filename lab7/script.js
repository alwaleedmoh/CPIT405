const ACCESS_KEY = 'OAk5VfMCvJOlreOpNEFCC3sS2tmcFEicNx5yS4fSX8Y';
const searchInput = document.getElementById('search-query');
const searchButton = document.getElementById('search-btn');
const methodSelect = document.getElementById('fetch-method');
const imageGrid = document.getElementById('image-grid');

// Mouse Event: Click on search button
searchButton.addEventListener('click', executeSearch);

// Keyboard Event: Pressing Enter inside search input
searchInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    executeSearch();
  }
});

function executeSearch() {
  const query = searchInput.value.trim();
  if (!query) {
    alert('Please enter a search term.');
    return;
  }

  const method = methodSelect.value;
  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12`;

  imageGrid.innerHTML = '<p>Loading images...</p>';

  if (method === 'xhr') {
    searchWithXHR(url);
  } else if (method === 'fetch-promise') {
    searchWithFetchPromise(url);
  } else if (method === 'async-await') {
    searchWithAsyncAwait(url);
  }
}

// Dynamically create and render elements using the DOM API
function displayImages(data) {
  imageGrid.innerHTML = '';

  if (!data.results || data.results.length === 0) {
    imageGrid.innerHTML = '<p>No results found.</p>';
    return;
  }

  data.results.forEach(photo => {
    const card = document.createElement('div');
    card.className = 'image-card';

    const img = document.createElement('img');
    img.src = photo.urls.small;
    img.alt = photo.alt_description || 'Unsplash Image';

    const info = document.createElement('div');
    info.className = 'image-info';

    const p = document.createElement('p');
    p.textContent = photo.description || photo.alt_description || 'Untitled';

    info.appendChild(p);
    card.appendChild(img);
    card.appendChild(info);
    imageGrid.appendChild(card);
  });
}

// 1. AJAX Request using XMLHttpRequest (XHR)
function searchWithXHR(url) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.setRequestHeader('Authorization', `Client-ID ${ACCESS_KEY}`);

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      const responseData = JSON.parse(xhr.responseText);
      displayImages(responseData);
    } else {
      imageGrid.innerHTML = `<p>Error loading images (${xhr.status}).</p>`;
    }
  };

  xhr.onerror = function () {
    imageGrid.innerHTML = '<p>Network error occurred.</p>';
  };

  xhr.send();
}

// 2. AJAX Request using Fetch with Promises
function searchWithFetchPromise(url) {
  fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Client-ID ${ACCESS_KEY}`
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    displayImages(data);
  })
  .catch(error => {
    imageGrid.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
  });
}

// 3. AJAX Request using Fetch with Async/Await
async function searchWithAsyncAwait(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Client-ID ${ACCESS_KEY}`
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    displayImages(data);
  } catch (error) {
    imageGrid.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
  }
}