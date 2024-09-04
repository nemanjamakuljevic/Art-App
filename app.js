const artistsBaseUrl = "https://api.artic.edu/api/v1/artists";
const fieldsArtistSearchUrl = "/search?q=";
const inputArtistEl = document.querySelector('.inputArtist');
const artistsContentEl = document.getElementById('artistsContent');

const artistsDisplayEl = document.getElementById('artistsDisplay');
const artistsListEl = document.querySelector('.artist-list');

const prevBtn = document.querySelector('.pagination_prev');
const nextBtn = document.querySelector('.pagination_next');
const paginationPageEl = document.querySelector('.pagination_page');

const refreshBtn = document.getElementById('refreshBtn');

let pageCounter = 1;
let totalCounter;

//Function to hide element
function hideElement(el) {
    el.classList.add('hidden');
}
//Function to show element
function showElement(el) {
    el.classList.remove('hidden')
}
/**
 * Function which make request to fetch data and check response
 * @param artistsData - The response from the API in JSON format
 * @param {number} total_pages - number of total pages according to API pagination response
 * @param {number} current_page - number of current page according to API pagination response
 * 
 */
async function fetchArtists(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`${response.status}`)
        } else {
            const artistsData = await response.json();
            filterArtists(artistsData);
            const { total_pages } = artistsData.pagination;
            const { current_page } = artistsData.pagination;
            pageCounter = current_page;
            totalCounter = total_pages;
            updateButtonState(pageCounter, totalCounter);
            getPages(artistsData, total_pages, current_page);

            console.log({ artistsData });
        }
    } catch (error) {
        throw error;
    }
}
/*
  This function:
  1. create a new anchor element
  2. asign the accepted value <name> to new a tag
  3. asign the href atribute with the link
*/
function displayArtist(artist_id, name, apiLink) {
    const newA = document.createElement('a');
    artistsDisplayEl.appendChild(newA);
    newA.innerText = name;
    newA.href = `http://127.0.0.1:5501/artist-artworks/artist_artworks.html?id=${artist_id}`;
    console.log({ artist_id });
}
/**
 * Iterate through response from API(fetching artists request)
 * while assigning the properties id, title and apiLink for 
 * displayArtist() and calling it
 * @param {number} id - id of artist
 * @param {string} title - title of artist
 * @param {string} apiLink - URL for fetch artist by id API request 
 */
function filterArtists(artistsData) {
    if (artistsData.data.length > 0) {
        for (i = 0; i < artistsData.data.length; i++) {
            const { id } = artistsData.data[i];
            const { title } = artistsData.data[i];
            const { apiLink } = artistsData.data[i];
            displayArtist(id, title, apiLink);
        }
    } else {
        artistsDisplayEl.innerText = "The name based on the data you entered does not exist."
        showElement(refreshBtn);
        prevBtn.classList.add("pagination_prev-disabled");
        nextBtn.classList.add("pagination_next-disabled");
    }
}
// Function that helps with logging response, total pages and current page
function getPages(artistsData, total_pages, current_page) {
    console.log({ total_pages })
    console.log({ current_page })
}
// Function which remove anchor elements
function removeElements() {
    const aTags = artistsContentEl.querySelectorAll('a');
    aTags && (aTags.forEach(a => {
        a.remove();
    }));
}
/**
 * Function updating state of the buttons
 * in order to make UI pagination 
 * @param {number} pageCounter
 * @param {number} totalCounter
 */
function updateButtonState(pageCounter, totalCounter) {
    if (pageCounter === totalCounter) {
        nextBtn.classList.add("pagination_next-disabled");
        prevBtn.classList.remove("pagination_prev-disabled");
    } else if (pageCounter === 1) {
        prevBtn.classList.add("pagination_prev-disabled");
    } else {
        prevBtn.classList.remove("pagination_prev-disabled");
        nextBtn.classList.remove("pagination_next-disabled");
    }
}
/**
 * Managing form submittion by:
 * 1. removing anchor tags
 * 2. assigning pageCounter to starting page point
 * 3. displaying pageCounter to UI 
 * 4. calling updateButtonState()
 * 5. initialize nameInput and artistsUrl attributes
 * @param {string} nameInput - value user input when search for artists
 * @param {string} artistsUrl - combined URL based on user input
 * 6. making API request
 * 7. displaying the list of artists made by API reqest
 */
function handleFormSubmit() {
    removeElements();
    pageCounter = 1;
    paginationPageEl.innerText = pageCounter;
    updateButtonState(pageCounter, totalCounter);
    const nameInput = inputArtistEl.value;
    const artistsUrl = `${artistsBaseUrl}${fieldsArtistSearchUrl}${nameInput}&page=${pageCounter}`;
    fetchArtists(artistsUrl);
    artistsListEl.classList.remove('artist-list-hidden');
}

function init() {
    const artistForm = document.getElementById('artist-form');
    artistForm.addEventListener('submit', function (e) {
        e.preventDefault();
        handleFormSubmit();
    });
    nextBtn.addEventListener('click', function () {
        removeElements();
        pageCounter++;
        updateButtonState(pageCounter, totalCounter);
        paginationPageEl.innerText = pageCounter;
        const url = `https://api.artic.edu/api/v1/artists/search?q=${inputArtistEl.value}&page=${pageCounter}`;
        fetchArtists(url);
        console.log(url);
    });
    prevBtn.addEventListener('click', function () {
        removeElements();
        pageCounter--;
        updateButtonState(pageCounter, totalCounter);
        paginationPageEl.innerText = pageCounter;
        const url = `https://api.artic.edu/api/v1/artists/search?q=${inputArtistEl.value}&page=${pageCounter}`;
        fetchArtists(url);
        console.log(url);
    });
}

document.addEventListener('DOMContentLoaded', init);








