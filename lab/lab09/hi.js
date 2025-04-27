const queryField = document.getElementById('query-field');
const findBtn = document.getElementById('find-btn');
const alertBox = document.getElementById('alert-box');
const resultsGrid = document.getElementById('results-grid');
const shelfGrid = document.getElementById('shelf-grid');
const foundCount = document.getElementById('found-count');
const waitIndicator = document.getElementById('wait-indicator');
const navItems = document.querySelectorAll('.nav-item');
const panels = document.querySelectorAll('.panel-content');
const detailPopup = document.getElementById('detail-popup');
const popupContent = document.getElementById('popup-content');
const closeBtn = document.querySelector('.close-btn');
const emptyShelf = document.getElementById('empty-shelf');

let myCollection = [];

document.addEventListener('DOMContentLoaded', () => {
    loadCollection();

    findBtn.addEventListener('click', findBooks);
    queryField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') findBooks();
    });

    navItems.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            changePanel(tabId);
        });
    });

    closeBtn.addEventListener('click', () => {
        detailPopup.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === detailPopup) {
            detailPopup.style.display = 'none';
        }
    });
});

function loadCollection() {
    const savedCollection = localStorage.getItem('bookCollection');

    if (savedCollection) {
        myCollection = JSON.parse(savedCollection);
        updateShelfView();
    }
}

function saveCollection() {
    localStorage.setItem('bookCollection', JSON.stringify(myCollection));
}

function changePanel(tabId) {
    navItems.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });

    panels.forEach(panel => {
        if (panel.id === tabId) {
            panel.classList.add('selected');
        } else {
            panel.classList.remove('selected');
        }
    });
}

async function findBooks() {
    const query = queryField.value.trim();

    if (!query) {
        showAlert('Please enter a search term');
        return;
    }

    clearResults();
    showLoader(true);

    try {
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);

        if (!response.ok) {
            throw new Error('Failed to fetch data from the API');
        }

        const data = await response.json();

        if (data.docs.length === 0) {
            showAlert('No books found. Try a different search term.');
            showLoader(false);
            return;
        }

        foundCount.textContent = `Found ${data.numFound} books`;

        displayBooks(data.docs);

    } catch (error) {
        showAlert('An error occurred. Please try again later.');
        console.error('Search error:', error);
    } finally {
        showLoader(false);
    }
}

function displayBooks(books) {
    resultsGrid.innerHTML = '';

    books.slice(0, 25).forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('item-card');

        let coverUrl = 'https://placehold.co/250x400/e0e0e0/999999?text=No+Cover+Available';
        if (book.cover_i) {
            coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
        }

        const title = book.title;
        const authors = book.author_name ? book.author_name.join(', ') : 'Unknown Author';
        const year = book.first_publish_year || 'Year unknown';
        const key = book.key;

        const isInCollection = myCollection.some(savedBook => savedBook.key === key);

        bookCard.innerHTML = `
            <img src="${coverUrl}" alt="${title}" class="cover-img">
            <div class="item-data">
                <h3 class="item-title">${title}</h3>
                <p class="item-creator">By ${authors}</p>
                <p class="item-date">Published: ${year}</p>
                <div class="item-btns">
                    <button class="detail-btn" data-key="${key}">View Details</button>
                    <button class="save-btn ${isInCollection ? 'saved' : ''}" data-key="${key}">
                        ${isInCollection ? '<i class="fas fa-check"></i>' : '<i class="fas fa-bookmark"></i>'}
                    </button>
                </div>
            </div>
        `;

        bookCard.querySelector('.detail-btn').addEventListener('click', () => {
            showBookDetails(book);
        });

        bookCard.querySelector('.save-btn').addEventListener('click', (e) => {
            const btn = e.currentTarget;
            toggleCollection(book, btn);
        });

        resultsGrid.appendChild(bookCard);
    });
}

function toggleCollection(book, button) {
    const bookData = {
        key: book.key,
        title: book.title,
        author_name: book.author_name || ['Unknown Author'],
        first_publish_year: book.first_publish_year || 'Year unknown',
        cover_i: book.cover_i
    };

    const index = myCollection.findIndex(savedBook => savedBook.key === book.key);

    if (index === -1) {
        myCollection.push(bookData);
        button.classList.add('saved');
        button.innerHTML = '<i class="fas fa-check"></i>';
    } else {
        myCollection.splice(index, 1);
        button.classList.remove('saved');
        button.innerHTML = '<i class="fas fa-bookmark"></i>';
    }

    updateShelfView();
    saveCollection();
}

function updateShelfView() {
    shelfGrid.innerHTML = '';

    if (myCollection.length === 0) {
        emptyShelf.style.display = 'block';
        return;
    }

    emptyShelf.style.display = 'none';

    myCollection.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('item-card');

        let coverUrl = 'https://placehold.co/250x400/e0e0e0/999999?text=No+Cover+Available';
        if (book.cover_i) {
            coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
        }

        bookCard.innerHTML = `
            <img src="${coverUrl}" alt="${book.title}" class="cover-img">
            <div class="item-data">
                <h3 class="item-title">${book.title}</h3>
                <p class="item-creator">By ${book.author_name.join(', ')}</p>
                <p class="item-date">Published: ${book.first_publish_year}</p>
                <div class="item-btns">
                    <button class="detail-btn" data-key="${book.key}">View Details</button>
                    <button class="save-btn saved">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;

        bookCard.querySelector('.detail-btn').addEventListener('click', () => {
            showBookDetails(book);
        });

        bookCard.querySelector('.save-btn').addEventListener('click', () => {
            const index = myCollection.findIndex(savedBook => savedBook.key === book.key);
            if (index !== -1) {
                myCollection.splice(index, 1);
                updateShelfView();
                saveCollection();

                const searchResultBtn = document.querySelector(`.item-card .save-btn[data-key="${book.key}"]`);
                if (searchResultBtn) {
                    searchResultBtn.classList.remove('saved');
                    searchResultBtn.innerHTML = '<i class="fas fa-bookmark"></i>';
                }
            }
        });

        shelfGrid.appendChild(bookCard);
    });
}

async function showBookDetails(book) {
    try {
        const response = await fetch(`https://openlibrary.org${book.key}.json`);

        if (!response.ok) {
            throw new Error('Failed to fetch book details');
        }

        const bookDetails = await response.json();

        let coverUrl = 'https://placehold.co/250x400/e0e0e0/999999?text=No+Cover+Available';
        if (book.cover_i) {
            coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
        }

        let description = 'No description available.';
        if (bookDetails.description) {
            description = typeof bookDetails.description === 'object' ?
                bookDetails.description.value : bookDetails.description;
        }

        const authors = book.author_name ? book.author_name.join(', ') : 'Unknown Author';

        const subjects = bookDetails.subjects ?
            bookDetails.subjects.slice(0, 5).join(', ') : 'No subjects available';

        const isInCollection = myCollection.some(savedBook => savedBook.key === book.key);

        popupContent.innerHTML = `
            <div class="popup-content-inner">
                <div class="popup-header">
                    <img src="${coverUrl}" alt="${book.title}" class="popup-cover">
                    <div class="popup-info">
                        <h2>${book.title}</h2>
                        <p><strong>Author:</strong> ${authors}</p>
                        <p><strong>First Published:</strong> ${book.first_publish_year || 'Unknown'}</p>
                        <p><strong>Subjects:</strong> ${subjects}</p>
                        ${bookDetails.number_of_pages ? `<p><strong>Pages:</strong> ${bookDetails.number_of_pages}</p>` : ''}
                        ${bookDetails.publishers ? `<p><strong>Publisher:</strong> ${bookDetails.publishers.join(', ')}</p>` : ''}
                        <button class="save-btn ${isInCollection ? 'saved' : ''}" id="popup-save-btn" style="margin-top: 1rem;">
                            ${isInCollection ? 'Remove from Collection' : 'Add to Collection'}
                        </button>
                    </div>
                </div>
                <div class="popup-desc">
                    <h3>Description</h3>
                    <p>${description}</p>
                </div>
            </div>
        `;

        document.getElementById('popup-save-btn').addEventListener('click', () => {
            const btn = document.querySelector(`.item-card .save-btn[data-key="${book.key}"]`);
            toggleCollection(book, btn || document.getElementById('popup-save-btn'));

            const popupBtn = document.getElementById('popup-save-btn');
            const isNowInCollection = myCollection.some(savedBook => savedBook.key === book.key);

            popupBtn.textContent = isNowInCollection ? 'Remove from Collection' : 'Add to Collection';
            if (isNowInCollection) {
                popupBtn.classList.add('saved');
            } else {
                popupBtn.classList.remove('saved');
            }
        });

        detailPopup.style.display = 'block';

    } catch (error) {
        showAlert('An error occurred while fetching book details.');
        console.error('Error fetching book details:', error);
    }
}

function showAlert(message) {
    alertBox.textContent = message;
    alertBox.style.display = 'block';

    setTimeout(() => {
        alertBox.textContent = '';
        alertBox.style.display = 'none';
    }, 4000);
}

function clearResults() {
    resultsGrid.innerHTML = '';
    foundCount.textContent = '';
    alertBox.textContent = '';
    alertBox.style.display = 'none';
}

function showLoader(show) {
    waitIndicator.style.display = show ? 'flex' : 'none';
}