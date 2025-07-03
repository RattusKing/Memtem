const { DateTime } = luxon;

// Cities for clock display
const cities = [
  { id: 'Portland',   zone: 'America/Los_Angeles' },
  { id: 'NewYork',    zone: 'America/New_York'    },
  { id: 'London',     zone: 'Europe/London'       },
  { id: 'Islamabad',  zone: 'Asia/Karachi'        },
  { id: 'Beijing',    zone: 'Asia/Shanghai'       },
  { id: 'Tokyo',      zone: 'Asia/Tokyo'          },
];

// Update clock times
function updateClocks() {
  cities.forEach(({ id, zone }) => {
    const now = DateTime.now().setZone(zone);
    document.getElementById(`clock-${id}`).textContent =
      now.toFormat('HH:mm:ss - dd LLL yyyy');
  });
}
updateClocks();
setInterval(updateClocks, 1000);

// More accurate obituary feed from Legacy.com (USA only)
const feedsByCountry = {
  USA: 'https://www.legacy.com/obituaries/rss.xml?country=us',
};

// Load obituaries
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
      li.innerHTML = `<a href="${item.link}" target="_blank" rel="noopener">
                        <strong>${item.title}</strong>
                      </a> <em>(${DateTime.fromISO(item.pubDate).toFormat('dd LLL yyyy')})</em>`;
      list.appendChild(li);
    });
  } catch (err) {
    document.getElementById('obits-list').innerHTML = `<li>Error loading obituaries: ${err.message}</li>`;
  }
}

// Load USA obits on page load
loadObits(feedsByCountry.USA);
