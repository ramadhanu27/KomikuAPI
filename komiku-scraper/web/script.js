const BASE_URL_KEY = 'komiku-base-url';
const defaultEndpoints = [
  {
    title: '📡 Info API',
    path: '/',
    desc: 'Cek status server dan daftar semua endpoint'
  },
  {
    title: '🏠 Home',
    path: '/v1/home',
    desc: 'Tampilkan manga ongoing, complete, dan latest update'
  },
  {
    title: '🔍 Search Manga',
    path: '/v1/search/:keyword',
    desc: 'Cari manga (ganti :keyword dengan nama manga)'
  },
  {
    title: '📖 Detail Manga',
    path: '/v1/manga/:slug',
    desc: 'Info lengkap manga (ganti :slug dengan slug manga)'
  },
  {
    title: '📚 Daftar Chapter',
    path: '/v1/manga/:slug/chapters',
    desc: 'Lihat semua chapter dari sebuah manga'
  },
  {
    title: '⏳ Manga Ongoing',
    path: '/v1/ongoing-manga',
    desc: 'Kumpulan manga yang masih berlanjut'
  },
  {
    title: '✅ Manga Complete',
    path: '/v1/complete-manga',
    desc: 'Kumpulan manga yang sudah selesai'
  },
  {
    title: '🇰🇷 Manhwa',
    path: '/v1/manhwa?page=1',
    desc: 'Daftar manhwa (ganti page dengan nomor halaman)'
  },
  {
    title: '🇨🇳 Manhua',
    path: '/v1/manhua?page=1',
    desc: 'Daftar manhua (ganti page dengan nomor halaman)'
  }
];

const el = (selector) => document.querySelector(selector);

const state = {
  baseUrl: ''
};

const toast = {
  timer: null,
  show(message) {
    const toastEl = el('#toast');
    toastEl.textContent = message;
    toastEl.classList.remove('hidden');
    clearTimeout(this.timer);
    this.timer = setTimeout(() => toastEl.classList.add('hidden'), 2400);
  }
};

function loadBaseUrl() {
  const saved = localStorage.getItem(BASE_URL_KEY);
  if (saved) {
    state.baseUrl = saved;
    el('#baseUrl').value = saved;
  }
}

function saveBaseUrl(value) {
  state.baseUrl = value.trim().replace(/\/$/, '');
  localStorage.setItem(BASE_URL_KEY, state.baseUrl);
}

function fullUrl(path) {
  if (!state.baseUrl) return '';
  return `${state.baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
}

function copy(text, label = 'Disalin') {
  if (!text) return toast.show('Isi dulu base URL / path');
  navigator.clipboard
    .writeText(text)
    .then(() => toast.show(`${label}!`))
    .catch(() => toast.show('Clipboard tidak tersedia'));
}

function renderEndpoints() {
  const list = el('#endpointList');
  list.innerHTML = '';
  defaultEndpoints.forEach((endpoint) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'endpoint-card';
    card.innerHTML = `
      <h3>${endpoint.title}</h3>
      <code>${endpoint.path}</code>
      <p>${endpoint.desc}</p>
      <span class="copy-hint">Klik untuk salin</span>
    `;
    card.addEventListener('click', () => {
      const url = fullUrl(endpoint.path);
      copy(url, `${endpoint.title} disalin`);
    });
    list.appendChild(card);
  });
}

async function runRequest(event) {
  event.preventDefault();
  const responseWrapper = el('#responseWrapper');
  const responseBody = el('#responseBody');

  if (!state.baseUrl) {
    toast.show('Isi base URL dulu');
    return;
  }

  const pathValue = el('#pathInput').value.trim();
  const queryValue = el('#queryInput').value.trim();
  if (!pathValue.startsWith('/')) {
    toast.show('Path harus diawali dengan /');
    return;
  }

  const url = new URL(fullUrl(pathValue));
  if (queryValue) {
    const params = new URLSearchParams(queryValue);
    params.forEach((value, key) => {
      url.searchParams.set(key, value);
    });
  }

  responseWrapper.classList.remove('hidden');
  responseBody.textContent = 'Loading...';

  try {
    const res = await fetch(url);
    const contentType = res.headers.get('content-type') ?? '';
    let payload;
    if (contentType.includes('application/json')) {
      const json = await res.json();
      payload = JSON.stringify(json, null, 2);
    } else {
      payload = await res.text();
    }
    responseBody.textContent = payload;
    responseBody.dataset.raw = payload;
    toast.show(`Status: ${res.status}`);
  } catch (error) {
    responseBody.textContent = error.message;
  }
}

function init() {
  loadBaseUrl();
  renderEndpoints();
  el('#baseUrl').addEventListener('input', (e) => saveBaseUrl(e.target.value));
  el('#copyBaseUrl').addEventListener('click', () => copy(state.baseUrl));
  el('#copyFullUrl').addEventListener('click', () => {
    const pathValue = el('#pathInput').value.trim();
    if (!pathValue) return toast.show('Isi path dulu');
    const url = fullUrl(pathValue);
    copy(url, 'URL disalin');
  });
  el('#copyResponse').addEventListener('click', () => {
    copy(el('#responseBody').dataset.raw || '', 'JSON disalin');
  });
  el('#requestForm').addEventListener('submit', runRequest);
}

document.addEventListener('DOMContentLoaded', init);
