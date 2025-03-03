# Natomanga Bookmark Exporter

## 📌 Overview
This **Tampermonkey user script** exports bookmarks from **Natomanga.com**, fetches the **latest chapter release date** from **Mangadex**, and sorts them **from newest to oldest**. The exported data is saved as a JSON file.

## 🔧 Features
- 📑 **Fetches all bookmarks** from your Natomanga account.
- 🔍 **Checks the latest chapter release date** via **Mangadex API**.
- 🔄 **Sorts bookmarks** by the **newest chapter release date**.
- 📥 **Exports data as a JSON file**.
- 🖱️ **User-friendly interface** with a single button click.

## 📦 Installation
### 1️⃣ Install Tampermonkey Extension
- **Google Chrome**: [Tampermonkey Extension](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- **Mozilla Firefox**: [Tampermonkey Extension](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
- **Microsoft Edge**: [Tampermonkey Extension](https://microsoftedge.microsoft.com/addons/detail/tampermonkey)

### 2️⃣ Install the Script
1. Open Tampermonkey and go to `Create a new script`.
2. Copy and paste the code from [Natomanga Bookmark Exporter](https://github.com/Wardf1/MangaNatoExporter/blob/main/script.js).
3. Click `File > Save`.

## 🚀 How to Use
1. **Go to** [Natomanga Bookmark Page](https://www.natomanga.com/bookmark).
2. Click the **📥 Export Bookmarks** button (appears at the bottom-right corner).
3. The script will:
   - Fetch all bookmarks with Currect and last Viewed Chapter 📑.
   - Retrieve the latest chapter release date from Mangadex 🔍.
   - Sort bookmarks from newest to oldest 🔄.
   - Generate a **JSON file** with all the sorted bookmarks 📥.
4. Once completed, the file `natomanga_bookmarks.json` will be downloaded.

## 📄 JSON File Format
```json
[
    "title": "MangaTitle!",
    "lastUpdated": "Last updated :\n                                        Date/Time",
    "lastViewedChapter": "Last Viewed Chapter",
    "lastViewedChapterUrl": "Last Viewed Chapter Link",
    "currentChapter": "Last Current Chapter",
    "currentChapterUrl": "Last Current Chapter Link",
    "latestChapterDate": "MangaDex Last Current Chapter (for Sorting)"
  }
  ...
]
```

## 🛠️ Troubleshooting
**Problem:** The button doesn't appear.  
✅ **Solution:** Refresh the page or check if Tampermonkey is enabled.

**Problem:** The script freezes on `Fetching bookmarks...`.  
✅ **Solution:** Check your **network connection** or **reload the page**.

**Problem:** No bookmarks are found.  
✅ **Solution:** Ensure you are **logged into Natomanga** before running the script.

---
📌 **Made by**: Wardf
