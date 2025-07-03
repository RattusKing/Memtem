const { DateTime } = luxon;

const cities = [
  { id: 'Portland',   zone: 'America/Los_Angeles' },
  { id: 'NewYork',    zone: 'America/New_York'    },
  { id: 'London',     zone: 'Europe/London'       },
  { id: 'Islamabad',  zone: 'Asia/Karachi'        },
  { id: 'Beijing',    zone: 'Asia/Shanghai'       },
  { id: 'Tokyo',      zone: 'Asia/Tokyo'          },
];

function updateClocks() {
  cities.forEach(({ id, zone }) => {
    const now = DateTime.now().setZone(zone);
    document.getElementById(`clock-${id}`).textContent =
      now.toFormat('HH:mm:ss - dd LLL yyyy');
  });
}
updateClocks();
setInterval(updateClocks, 1000);

const feedsByCountry = {
  USA: 'https://rss.nytimes.com/services/xml/rss/nyt/Obituaries.xml',
  UK: 'https://www.theguardian.com/tone/obituaries/rss',
  Japan: 'https://news.yahoo.co.jp/pickup/rss.xml', // Example Japanese news RSS (not purely obits, but close)
};

const countrySelect = document.getElementById('country-select');

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

// Load obits for default selected country on page load
loadObits(feedsByCountry[countrySelect.value]);

// Listen for changes and reload obits
countrySelect.addEventListener('change', e => {
  loadObits(feedsByCountry[e.target.value]);
});
