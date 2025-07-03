// Import DateTime from Luxon (make sure luxon is included in your HTML)
const { DateTime } = luxon;

// City timezones for clocks
const cities = [
  { id: 'Portland', zone: 'America/Los_Angeles' },
  { id: 'NewYork', zone: 'America/New_York' },
  { id: 'London', zone: 'Europe/London' },
  { id: 'Islamabad', zone: 'Asia/Karachi' },
  { id: 'Beijing', zone: 'Asia/Shanghai' },
  { id: 'Tokyo', zone: 'Asia/Tokyo' },
];

// Function to update all clocks every second
function updateClocks() {
  cities.forEach(({ id, zone }) => {
    const now = DateTime.now().setZone(zone);
    const clockEl = document.getElementById(`clock-${id}`);
    if (clockEl) {
      clockEl.textContent = now.toFormat('HH:mm:ss - dd LLL yyyy');
    }
  });
}
updateClocks();
setInterval(updateClocks, 1000);

// URL for USA Legacy.com obituaries RSS feed
const legacyUSFeed = 'https://www.legacy.com/obituaries/rss.xml?country=us';

// Load and display obituaries in #obits-list
async function loadObits(url) {
  try {
    const API = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
    const res = await fetch(API);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error('RSS error');

    const list = document.getElementById('obits-list');
    list.innerHTML = '';

    data.items.slice(0, 10).forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="${item.link}" target="_blank" rel="noopener">${item.title}</a> <em>(${DateTime.fromISO(item.pubDate).toFormat('dd LLL yyyy')})</em>`;
      list.appendChild(li);
    });
  } catch (err) {
    document.getElementById('obits-list').innerHTML = `<li>Error loading obituaries: ${err.message}</li>`;
  }
}

// Load obits immediately on page load
loadObits(legacyUSFeed);
