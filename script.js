// ==UserScript==
// @name         Natomanga Bookmark Exporter
// @namespace    https://www.natomanga.com/
// @version      1.0
// @description  Exports bookmarks from natomanga.com, fetches the latest chapter release date from Mangadex, and sorts them from newest to oldest.
// @author       Wardf
// @match        https://www.natomanga.com/bookmark*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// ==/UserScript==

(function() {
    'use strict';

    let bookmarks = [];
    let page = 1;
    let processed = 0;
    let exportButton;

    function updateButton(text) {
        if (exportButton) {
            exportButton.innerText = text;
        }
    }

    async function fetchBookmarks(page) {
        let url = page === 1 ? "https://www.natomanga.com/bookmark" : `https://www.natomanga.com/bookmark?page=${page}`;
        updateButton(`Fetching bookmarks... Page ${page}`);
        console.log(`Fetching: ${url}`);
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    if (response.status !== 200) {
                        console.error(`Error fetching page ${page}:`, response.status);
                        updateButton("❌ Failed to fetch bookmarks");
                        resolve(false);
                        return;
                    }
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(response.responseText, 'text/html');
                    let items = doc.querySelectorAll(".user-bookmark-item");

                    if (!items || items.length === 0) {
                        console.warn("No bookmarks found on page", page);
                        updateButton("Fetching complete! Processing...");
                        resolve(false);
                        return;
                    }

                    items.forEach(item => {
                        let titleElement = item.querySelector(".bm-title a");
                        if (!titleElement) {
                            console.warn("Skipping an entry: Missing title");
                            return;
                        }

                        let title = titleElement.innerText.trim();
                        let lastUpdatedElement = item.querySelector(".chapter-datecreate");

                        bookmarks.push({
                            title,
                            lastUpdated: lastUpdatedElement ? lastUpdatedElement.innerText.trim() : null,
                            latestChapterDate: null // Placeholder for latest chapter release date
                        });
                    });
                    console.log(`Fetched ${items.length} bookmarks from page ${page}`);
                    updateButton(`Fetched ${bookmarks.length} bookmarks...`);
                    resolve(true);
                },
                onerror: function(error) {
                    console.error("Request failed:", error);
                    updateButton("❌ Request failed");
                    resolve(false);
                }
            });
        });
    }

    async function fetchLatestChapterFromMangadex(bookmark) {
        return new Promise((resolve) => {
            let searchUrl = `https://api.mangadex.org/manga?title=${encodeURIComponent(bookmark.title)}`;
            updateButton(`Fetching Mangadex data for ${bookmark.title}`);

            GM_xmlhttpRequest({
                method: 'GET',
                url: searchUrl,
                onload: function(response) {
                    let data = JSON.parse(response.responseText);
                    if (data.data && data.data.length > 0) {
                        let mangaId = data.data[0].id;
                        let chapterUrl = `https://api.mangadex.org/manga/${mangaId}/feed?limit=1&translatedLanguage[]=en&order[publishAt]=desc`;

                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: chapterUrl,
                            onload: function(chapterResponse) {
                                let chapterData = JSON.parse(chapterResponse.responseText);
                                if (chapterData.data && chapterData.data.length > 0) {
                                    bookmark.latestChapterDate = chapterData.data[0].attributes.publishAt;
                                }
                                resolve();
                            },
                            onerror: function(error) {
                                console.error("Error fetching latest chapter from Mangadex:", error);
                                resolve();
                            }
                        });
                    } else {
                        console.warn(`No Mangadex entry found for: ${bookmark.title}`);
                        resolve();
                    }
                },
                onerror: function(error) {
                    console.error("Error searching Mangadex:", error);
                    resolve();
                }
            });
        });
    }

    async function fetchLatestUpdateDates() {
        return new Promise(async (resolve) => {
            for (let i = 0; i < bookmarks.length; i++) {
                console.log(`Fetching Mangadex latest chapter date for: ${bookmarks[i].title}`);
                updateButton(`Fetching latest chapter dates (${i + 1}/${bookmarks.length})`);
                await fetchLatestChapterFromMangadex(bookmarks[i]);
                processed++;
            }
            resolve();
        });
    }

    async function getAllBookmarks() {
        updateButton("Starting export...");
        while (await fetchBookmarks(page)) {
            page++;
        }

        if (bookmarks.length === 0) {
            updateButton("❌ No bookmarks found");
            console.warn("No bookmarks found! Check if the website structure changed.");
            return;
        }

        updateButton("Fetching latest chapter dates from Mangadex...");
        await fetchLatestUpdateDates();

        bookmarks.sort((a, b) => new Date(b.latestChapterDate) - new Date(a.latestChapterDate));

        let data = JSON.stringify(bookmarks, null, 2);
        updateButton("Exporting bookmarks...");
        console.log("Final bookmarks data:", data);

        GM_download({
            url: "data:text/json;charset=utf-8," + encodeURIComponent(data),
            name: "natomanga_bookmarks.json",
            saveAs: true
        });
        updateButton("✅ Export Complete!");
    }

    function addExportButton() {
        exportButton = document.createElement("button");
        exportButton.innerText = "📥 Export Bookmarks";
        exportButton.style.position = "fixed";
        exportButton.style.bottom = "20px";
        exportButton.style.right = "20px";
        exportButton.style.padding = "10px 20px";
        exportButton.style.backgroundColor = "#ff4500";
        exportButton.style.color = "white";
        exportButton.style.border = "none";
        exportButton.style.borderRadius = "5px";
        exportButton.style.cursor = "pointer";
        exportButton.style.zIndex = "1000";

        exportButton.onclick = getAllBookmarks;
        document.body.appendChild(exportButton);
    }

    window.addEventListener("load", addExportButton);
})();
