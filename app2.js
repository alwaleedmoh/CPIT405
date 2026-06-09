// ==============================================
// App 2 — Country Explorer
// Fetches live data from the REST Countries API
// ==============================================

const API_BASE = 'https://restcountries.com/v3.1/name/';

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const resultsArea = document.getElementById('resultsArea');

// ----- UI state helpers -----
function showLoading() {
    resultsArea.innerHTML = `
        <div class="spinner" aria-label="Loading"></div>
        <p class="status-msg">Loading countries...</p>
    `;
}

function showError(message) {
    resultsArea.innerHTML = `<p class="status-msg error">${message}</p>`;
}

function showInfo(message) {
    resultsArea.innerHTML = `<p class="status-msg">${message}</p>`;
}

// Escape HTML to keep things safe when rendering API data
function esc(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ----- Render -----
function renderCountries(countries) {
    const count = countries.length;
    const cards = countries.map(c => {
        const name = esc(c.name && c.name.common);
        const flag = c.flags && (c.flags.svg || c.flags.png);
        const flagAlt = (c.flags && c.flags.alt) || `Flag of ${name}`;
        const capital = (c.capital && c.capital[0]) || 'N/A';
        const region = c.region || 'N/A';
        const population = (c.population != null)
            ? c.population.toLocaleString()
            : 'N/A';
        const languages = c.languages
            ? Object.values(c.languages).join(', ')
            : 'N/A';

        return `
            <article class="country-card">
                ${flag ? `<img class="country-flag" src="${esc(flag)}" alt="${esc(flagAlt)}" loading="lazy">` : ''}
                <div class="country-body">
                    <h4>${name}</h4>
                    <p>🏛️ ${esc(capital)}</p>
                    <p>🌍 ${esc(region)}</p>
                    <p>👥 ${esc(population)}</p>
                    <p>🗣️ ${esc(languages)}</p>
                </div>
            </article>
        `;
    }).join('');

    resultsArea.innerHTML = `
        <p class="results-info">${count} result${count === 1 ? '' : 's'} found</p>
        <div class="country-grid">${cards}</div>
    `;
}

// ----- Search -----
async function searchCountries() {
    const query = searchInput.value.trim();

    if (query === '') {
        showInfo('Please enter a country name to search.');
        return;
    }

    showLoading();

    try {
        const response = await fetch(API_BASE + encodeURIComponent(query));

        if (response.status === 404) {
            showInfo('No countries found. Try a different name.');
            return;
        }

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            showInfo('No countries found. Try a different name.');
            return;
        }

        // Sort alphabetically by common name for nicer display
        data.sort((a, b) => {
            const an = (a.name && a.name.common) || '';
            const bn = (b.name && b.name.common) || '';
            return an.localeCompare(bn);
        });

        renderCountries(data);
    } catch (err) {
        console.error('Fetch failed:', err);
        showError('Could not load data. Please check your internet connection and try again.');
    }
}

// ----- Event listeners -----
searchBtn.addEventListener('click', searchCountries);

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchCountries();
});

// Optional: focus input on page load for nicer UX
searchInput.focus();
