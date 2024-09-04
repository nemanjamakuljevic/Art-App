const params = new URLSearchParams(window.location.search)
const artistId = params.get("id")
console.log(artistId);

const artistUrl = `https://api.artic.edu/api/v1/artists/${artistId}`;
const baseArtworksUrl = "https://api.artic.edu/api/v1/artworks";
const fieldsArtworksUrl = `/search?&query[term][artist_id]=${artistId}`;

const birthEl = document.getElementById('birthYear');
const deathEl = document.getElementById('deathYear');
const ageEl = document.getElementById('age');
const artistNameEl = document.getElementById('artist_name');
const artworksBtn = document.getElementById('artworks_btn');
const artworksListEl = document.querySelector('.artworks-list');
const artworksEl = document.querySelector('.artworks');

const prevBtn = document.querySelector('.pagination_prev');
const nextBtn = document.querySelector('.pagination_next');
const paginationPageEl = document.querySelector('.pagination_page');
const descriptionEl = document.querySelector('#desc');

const descBtn = document.getElementById('desc_btn');
const modal = document.getElementById("descModal");

const closeBtn = document.getElementsByClassName("close")[0];

let pageCounter = 1;
let totalCounter;
let pageIncreased = true;

/**
 * fetching the data and checking response
 * @param artistUrl - URL of an artist which contains id
 * @param artistData - The response from the API in JSON format
 * @param {number} birthYear - a year of birth, from API data
 * @param {number} deathYear - a year of death, from API data
 * @param {string} artistName - full name of an artist, from API data
 * @param {string} description - artist information, from API data
 */
async function fetchArtistById(artistUrl) {
    try {
        const response = await fetch(artistUrl);
        if (!response.ok) {
            throw new Error(`${response.status}`);
        } else {
            const artistData = await response.json();
            console.log({ artistData });
            const birthYear = artistData.data.birth_date;
            const deathYear = artistData.data.death_date;
            const artistName = artistData.data.title;
            const { description } = artistData.data;
            displayArtistData(birthYear, deathYear, artistName, description);
            alignDescription(description);
        }
    } catch (error) {
        throw error;
    }
}
// checking if there is a data associated to an element
function validateDataValue(el, data) {
    if (data === null) {
        el.innerText = "No data associated."
        return false
    } else {
        el.innerText = data;
        return true
    }
}
// function related to description field in data response,
// trimming the text if there is more than 500 characters
function trimDescription(descriptionEl) {
    const maxLen = 500;

    if (descriptionEl.textContent.length > maxLen) { // if too long.... trim it!
        let trimedDesc = descriptionEl.textContent.substring(0, 500);
        let trimedTxt = trimedDesc.replace(/<[^>]*>?/gm, '');
        descriptionEl.textContent = `${trimedTxt} ......`;
    } else {
        descriptionEl.textContent
    }
}
// using certain data from API and displaying in UI
function displayArtistData(birthYear, deathYear, artistName, description) {
    validateDataValue(artistNameEl, artistName);
    validateDataValue(birthEl, birthYear);
    validateDataValue(deathEl, deathYear);
    const age = deathYear - birthYear;

    if (validateDataValue(birthEl, birthYear) && validateDataValue(deathEl, deathYear)) {
        ageEl.innerText = age;
    } else {
        ageEl.innerText = " Unknown."
    }

    if (validateDataValue(descriptionEl, description)) {
        descBtn.classList.remove('btn-hidden');
    } else {
        descBtn.classList.add('btn-hidden');
    }
    trimDescription(descriptionEl);

}

function alignDescription(description) {
    let modalDescriptionEl = document.getElementById('modalDesc');
    modalDescriptionEl.textContent = description.replace(/<[^>]*>?/gm, '');
}
/**
 * fetching all artworks associated with certain artist
 * @param artistArtWorks - The response from the API in JSON format
 * @param {number} pageCounter - number of the current page
 * @param {number} totalCounter - number of the toral pages
 */
async function fetchAtristsArtWorks(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`${response.status}`)
        } else {
            const artistArtWorks = await response.json();
            filterArtworks(artistArtWorks);
            const { total_pages } = artistArtWorks.pagination;
            const { current_page } = artistArtWorks.pagination;
            pageCounter = current_page;
            totalCounter = total_pages;
            console.log({ total_pages }, { totalCounter })
            console.log({ current_page }, { pageCounter })
            updateButtonState(pageCounter, totalCounter);
            console.log({ artistArtWorks });
        }
    } catch (error) {
        throw error;
    }
}
/**
 * 
  1. iterate throught response targeting data array
  2. initializing id, title and api link from the response for every artwork 
  3. displays initialized data
 * @param {number} id - id of artwork
 * @param {string} title - title of artwork
 * * @param api_link - full URL of artwork, by id
 */
function filterArtworks(artistArtWorks) {
    for (i = 0; i < artistArtWorks.data.length; i++) {
        const { id, title, api_link } = artistArtWorks.data[i];
        console.log({ id, title, api_link });
        displayArtWorkTitles(id, title, api_link);
    }
}
/*
  This function:
  1. create a new anchor element
  2. placing the newly created a tag to proper element
  3. asign the inner text to title of artwork
  4. making a full URL of artwork
*/
function displayArtWorkTitles(artwork_id, artworkTitle, apiLink) {
    const newA = document.createElement('a');
    artworksEl.appendChild(newA);
    newA.innerText = artworkTitle;
    //newA.href = apiLink;
    newA.href = `http://127.0.0.1:5501/artwork/artwork.html?id=${artwork_id}`;
}
// updating button state in order to make pagination
function updateButtonState(pageCounter, totalCounter) {
    if (pageCounter === 1 && pageCounter < totalCounter) {
        prevBtn.classList.add("pagination_prev-disabled");
        nextBtn.classList.remove("pagination_next-disabled");
    } else if (pageCounter > 1 && pageCounter === totalCounter) {
        nextBtn.classList.add("pagination_next-disabled");
        prevBtn.classList.remove("pagination_prev-disabled");
    } else {
        prevBtn.classList.remove("pagination_prev-disabled");
        nextBtn.classList.remove("pagination_next-disabled")
    }
}
// fetching first page of artworks
function getInitialArtworks() {
    artworksListEl.classList.remove('artworks-list-hidden');
    const artistsArtWorksUrl = `${baseArtworksUrl}${fieldsArtworksUrl}&page=${pageCounter}`;

    fetchAtristsArtWorks(artistsArtWorksUrl);
    paginationPageEl.innerText = pageCounter;
    console.log(artistsArtWorksUrl);
}
function removeElements() {
    const aTags = artworksEl.querySelectorAll('a');
    aTags && (aTags.forEach(a => {
        a.remove();
    }));
}
function isPageCounterIncreased(pageIncreased) {
    if (pageIncreased) {
        pageCounter++;
    } else {
        pageCounter--;
    }
}
// changing a URL based on page decrease or
function getPaginatedArtworks() {
    removeElements();
    paginationPageEl.innerText = pageCounter;
    const url = `${baseArtworksUrl}${fieldsArtworksUrl}&page=${pageCounter}`;
    fetchAtristsArtWorks(url);
}

function openModal() {
    modal.style.display = "block";
}
function closeModal() {
    modal.style.display = "none";
}

function init() {
    window.onload = function () {
        fetchArtistById(artistUrl);
    };
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            closeModal();
        }
    }
    artworksBtn.addEventListener('click', function () {
        getInitialArtworks();
        artworksBtn.classList.add('btn-disabled');
    });
    nextBtn.addEventListener('click', function () {
        pageIncreased = true;
        isPageCounterIncreased(pageIncreased);
        getPaginatedArtworks();
    });
    prevBtn.addEventListener('click', function () {
        pageIncreased = false;
        isPageCounterIncreased(pageIncreased);
        getPaginatedArtworks();
    });
    // When the user clicks the button, open the modal 
    descBtn.onclick = function () {
        openModal();
    };
    // When the user clicks on <span> (x), close the modal
    closeBtn.onclick = function () {
        closeModal();
    };

}
document.addEventListener('DOMContentLoaded', init);