# 🔥 Komiku Real-time Scraper API

API scraper real-time untuk manga dari Komiku.org tanpa penyimpanan database.

## ✨ Fitur

- 🚀 **Real-time Scraping** - Data langsung dari Komiku.org
- 📱 **RESTful API** - Endpoint lengkap untuk manga data
- 🔄 **No Database** - Tanpa penyimpanan, data selalu fresh
- 🎯 **Optimized Selectors** - CSS selectors yang robust
- 🛡️ **Error Handling** - Try-catch untuk setiap request
- 📊 **Multiple Data Types** - Manga, manhwa, manhua support

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev

# Production
npm start
```

## 📡 API Endpoints

### Base URL: `http://localhost:3001`

#### Main Endpoints:
- `GET /` - API info
- `GET /v1/` - Version info & endpoints list
- `GET /v1/home` - Homepage (ongoing, complete, latest)
- `GET /v1/search/:keyword` - Pencarian manga
- `GET /v1/manga/:slug` - Detail manga
- `GET /v1/manga/:slug/chapters` - Daftar chapter
- `GET /v1/ongoing-manga` - Manga ongoing
- `GET /v1/complete-manga` - Manga selesai

## 📝 Contoh Response

### Home Data:
```json
{
  "status": "Ok",
  "data": {
    "ongoing_manga": [
      {
        "title": "Solo Leveling",
        "slug": "solo-leveling",
        "poster": "https://komiku.org/wp-content/uploads/2023/12/Solo-Leveling.jpg",
        "type": "Manhwa",
        "chapter_info": "Chapter 200",
        "update_info": "2 hari lalu",
        "url": "https://komiku.org/manga/solo-leveling/"
      }
    ],
    "complete_manga": [...],
    "latest_update": [...]
  }
}
```

### Manga Detail:
```json
{
  "status": "Ok",
  "data": {
    "title": "Solo Leveling",
    "alternativeTitle": "나 혼자만 레벨업",
    "slug": "solo-leveling",
    "poster": "https://komiku.org/wp-content/uploads/2023/12/Solo-Leveling.jpg",
    "synopsis": "Di dunia yang memiliki hunter...",
    "author": "Chugong",
    "type": "Manhwa",
    "status": "Ongoing",
    "released": "2018",
    "genres": ["Action", "Adventure", "Fantasy"],
    "chapter_lists": [...],
    "total_chapters": 200
  }
}
```

## 🛠️ Teknologi

- **Node.js** + **Express.js** - Backend framework
- **Axios** - HTTP client
- **Cheerio** - HTML parser
- **ES6 Modules** - Modern JavaScript

## 📁 Struktur Project

```
komiku-scraper/
├── api/
│   ├── src/
│   │   ├── komiku.js          # Main export
│   │   ├── utils/             # API functions
│   │   └── lib/               # Scraping libraries
│   ├── routes/                # Express routes
│   ├── package.json
│   └── index.js               # Server entry
└── README.md
```

## 🔧 Konfigurasi

Edit file `.env`:
```env
BASEURL=https://komiku.org
PORT=3001
USER_AGENT=Mozilla/5.0...
```

## 🚨 Penting

- **No Database** - API tidak menyimpan data
- **Rate Limiting** - Jangan spam request
- **Real-time** - Data langsung dari source
- **Respect** - Gunakan dengan bijak

## 📄 License

MIT License - Gunakan dengan tanggung jawab
