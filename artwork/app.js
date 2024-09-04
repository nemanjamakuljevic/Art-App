const params = new URLSearchParams(window.location.search);
const id = params.get("id");
console.log(id);

const artworkUrl = `https://api.artic.edu/api/v1/artworks/${id}`;
const artistNameEl = document.getElementById('artistName');
const pictureEl = document.getElementById('picture');
const listEl = document.getElementById('list');
const thumbnailEl = document.getElementById('thumbnail-text');
const dateEl = document.getElementById('date-text');
const pictureErrEl = document.getElementById('picture_error');
const classificationEl = document.querySelector('.classification');
const materialEl = document.querySelector('.materials');
const backBtn = document.getElementById('back_button');
let artistId;

/**
 * Function which make request to fetch data and check response
 * @param artWorkByIdData - The response from the API in JSON format
 * @param artworkUrl - full URL of the artwork by id
 * @param {number} artistId - id of the artist, from the response
 */
async function fetchArtworkById(artworkUrl) {
    try {
        const response = await fetch(artworkUrl);
        if (!response.ok) {
            throw new Error(`${response.status}`);
        } else {
            const artWorkByIdData = await response.json();
            artistId = artWorkByIdData.data.artist_id;
            renderData(artWorkByIdData);
            console.log({ artWorkByIdData });
        }
    } catch (error) {
        throw error;
    }
}

function renderData(artWorkByIdData) {
    const { artistName } = displayArtistName(artWorkByIdData);
    const { imgPath } = displayArtImage(artWorkByIdData);
    const { description, thumbnail } = displayDescription(artWorkByIdData);
    displayAdditionals(artWorkByIdData);
}
/*
    0. accept response form the API
    1. initialize artist name according to response
    2. associate initialized value to proper element
    3. return artist name
*/
function displayArtistName(artWorkByIdData) {
    const artistName = artWorkByIdData.data.artist_title;
    artistNameEl.innerText = artistName;
    return {
        artistName
    }
}
/*
    0. accept response form the API
    1. initialize id of the image according to response
    2. making proper img path 
    3. podseti se sta radi ovaj oneliner
    4. returns img path 
*/
function displayArtImage(artWorkByIdData) {
    const imgId = artWorkByIdData.data.image_id;
    const imgPath = `https://www.artic.edu/iiif/2/${imgId}/full/843,/0/default.jpg`;
    imgId ? pictureEl.src = imgPath : pictureErrEl.classList.remove('hidden');

    return {
        imgPath
    }
}

function displayDescription(artWorkByIdData) {
    const description = artWorkByIdData.data.description;
    const thumbnail = artWorkByIdData.data.thumbnail.alt_text;
    const date = artWorkByIdData.data.date_display;
    description ? listEl.innerHTML = description : listEl.innerText = "There is no description for this artwork."
    thumbnail ? thumbnailEl.innerText = thumbnail : thumbnailEl.innerText = "There is no thumbnail for this artwork.";
    date ? dateEl.innerText = `Published at ${date}` : dateEl.innerText = "Unknown published date."

    return {
        description,
        thumbnail
    }
}
/*
    1. initialize classification titles from API response
    2. initialize material titles from API response
    3. append classification titles to proper element
    4. append material titles to proper element
*/
function displayAdditionals(artWorkByIdData) {
    const classificationTitles = artWorkByIdData.data.classification_titles;
    const materialTitles = artWorkByIdData.data.material_titles;
    appendList(classificationTitles, classificationEl);
    appendList(materialTitles, materialEl);
}

/*
    iterate through array in order to make a new list element, 
    assign data to inner text and append new list to selected element
*/
function appendList(arr, selectedEl) {
    for (i = 0; i < arr.length; i++) {
        const newLi = document.createElement('li');
        newLi.innerText = arr[i];
        newLi.classList.add("nostyle");
        selectedEl.append(newLi);
    }
}

function init() {
    window.onload = function () {
        fetchArtworkById(artworkUrl);
    };
    backBtn.addEventListener('click', function () {
        location.href = `http://127.0.0.1:5501/artist-artworks/artist_artworks.html?id=${artistId}`;
    });
}
document.addEventListener('DOMContentLoaded', init);




