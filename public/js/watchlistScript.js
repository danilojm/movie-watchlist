
// Add Movie to Watchlist
function addMovieToWatchlist(movieId) {
    const watchlistId = document.getElementById('watchlistId').value;

    fetch('/watchlist/addMovie', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            watchlistId: watchlistId,
            movieId: movieId
        }),
    })
        .then(response => {
            if (window.opener && !window.opener.closed) {
                window.opener.refreshWatchlist();
            }
        })
}

function removeMovieFromWatchlist(movieId) {
    const watchlistId = document.getElementById('watchlistId').value;

    fetch('/watchlist/removeMovie', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            watchlistId: watchlistId,
            movieId: movieId
        }),
    }).then(response => {
        return response.json();
    })
        .then(data => {
            if (data.success) {
                updateWatchlistTable(data.movies); // Atualiza a tabela com os filmes
            }
        })
        .catch(error => {
            console.error('Error fetching watchlist movies:', error);
        });
}

// Update the Watchlist Table
function updateWatchlistTable(movies) {
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = ''; // Clear current table content

    if (movies.length > 0) {
        movies.forEach(movie => {
            // Create a row with movie details
            const row = document.createElement('tr');

            // Create poster cell
            const posterCell = document.createElement('td');
            const posterImg = document.createElement('img');
            posterImg.src = movie.poster_path
                ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                : '/images/placeholder.png';
            posterImg.alt = `${movie.title} Poster`;
            posterCell.appendChild(posterImg);

            // Create title cell
            const titleCell = document.createElement('td');
            titleCell.textContent = movie.title;

            // Create overview cell
            const overviewCell = document.createElement('td');
            overviewCell.textContent = movie.overview;

            // Create release date cell
            const releaseDateCell = document.createElement('td');
            releaseDateCell.textContent = movie.release_date;

            // Create rating cell with star ratings
            const ratingCell = document.createElement('td');
            const starRatingDiv = document.createElement('div');
            starRatingDiv.classList.add('star-rating');

            // Loop through star ratings (5 to 1)
            for (let i = 5; i >= 1; i--) {
                const input = document.createElement('input');
                input.type = 'radio';
                input.id = `star${i}-${movie.id}`; // Unique ID for each star
                input.name = `rating-${movie.id}`; // Unique name for each movie's rating
                input.value = i;

                // Pre-select the rating
                if (movie.rating && movie.rating == i) {
                    input.checked = true;
                }

                // Add event listener to update the rating for the specific movie
                input.addEventListener('change', () => {
                    updateMovieRating(movie.id, i); // Pass the correct movie ID and rating
                });

                const label = document.createElement('label');
                label.setAttribute('for', `star${i}-${movie.id}`);
                label.textContent = '★';

                starRatingDiv.appendChild(input);
                starRatingDiv.appendChild(label);
            }

            ratingCell.appendChild(starRatingDiv);

            // Create watched cell with a checkbox
            const watchedCell = document.createElement('td');
            const watchedCheckbox = document.createElement('input');
            watchedCheckbox.type = 'checkbox';
            watchedCheckbox.classList.add('watched-checkbox');
            watchedCheckbox.dataset.id = movie.id;
            if (movie.watched) {
                watchedCheckbox.checked = true;
            }
            watchedCheckbox.addEventListener('change', () => {
                toggleWatchedStatus(movie.id, watchedCheckbox.checked);
            });
            watchedCell.appendChild(watchedCheckbox);

            // Create action cell with a remove button
            const actionCell = document.createElement('td');
            const removeButton = document.createElement('button');
            removeButton.classList.add('remove');
            removeButton.textContent = '-';
            removeButton.onclick = () => removeMovieFromWatchlist(movie._id); // Call the function to remove the movie
            actionCell.appendChild(removeButton);

            // Append all cells to the row
            row.appendChild(posterCell);
            row.appendChild(titleCell);
            row.appendChild(overviewCell);
            row.appendChild(releaseDateCell);
            row.appendChild(ratingCell);
            row.appendChild(watchedCell);
            row.appendChild(actionCell);

            // Append the row to the table body
            tbody.appendChild(row);
        });
    } else {
        // Display "No movies found" message if no movies are in the list
        const noResultsRow = document.createElement('tr');
        const noResultsCell = document.createElement('td');
        noResultsCell.colSpan = 7;
        noResultsCell.classList.add('no-results');
        noResultsCell.textContent = 'No movies found.';
        noResultsRow.appendChild(noResultsCell);
        tbody.appendChild(noResultsRow);
    }
}


function updateMovieRating(movieId, rating) {
    const watchlistId = document.getElementById('watchlistId').value; 
    fetch('/watchlist/updateRating', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            watchlistId: watchlistId,
            movieId: movieId,
            rating: rating,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log(`Rating for movie ${movieId} updated to ${rating}`);
        } else {
            console.error('Error updating rating:', data.message);
        }
    })
    .catch(error => {
        console.error('Error updating rating:', error);
    });
}


function openWatchlistPopup(action) {
    const watchlistId = document.getElementById('watchlistId').value;
    const watchlistName = document.getElementById('watchlistName').value;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const popupWidth = Math.round(screenWidth * 0.8); // 80% of screen width
    const popupHeight = Math.round(screenHeight * 0.8); // 80% of screen height

    const left = Math.round((screenWidth - popupWidth) / 2); // Center horizontally
    const top = Math.round((screenHeight - popupHeight) / 2); // Center vertically

    let query = '';
    let url = '';

    if (action === 'watchlist') {
        query = document.getElementById('searchQuery').value;

        if (!query) {
            alert("Please enter a movie tittle!");
            return;
        }

        url = `/watchlist/search?watchlistName=${encodeURIComponent(watchlistName)}&watchlistId=${encodeURIComponent(watchlistId)}&query=${encodeURIComponent(query)}`;

    } else if (action === 'discover') {

        url = `/watchlist/discover?watchlistName=${encodeURIComponent(watchlistName)}&watchlistId=${encodeURIComponent(watchlistId)}`;
    }

    // Open the popup with the constructed URL
    const popup = window.open(
        url,
        'WatchlistPopup',
        `width=${popupWidth},height=${popupHeight},left=${left},top=${top},scrollbars=yes,resizable=no`
    );

    if (!popup) {
        alert('Popup blocked! Please allow popups for this site.');
    }
}

function refreshWatchlist() {
    const watchlistId = document.getElementById('watchlistId').value;

    if (!watchlistId) {
        alert('Watchlist ID is missing!');
        return;
    }

    fetch(`/watchlist/refreshWatchlist/${watchlistId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response => {
        return response.json();
    })
        .then(data => {
            if (data.success) {
                updateWatchlistTable(data.movies); // Atualiza a tabela com os filmes
            }
        })
        .catch(error => {
            console.error('Error fetching watchlist movies:', error);
        });
}

// Function to update the rating stars when the page loads or rating changes
function setInitialRating(movieId, rating) {
    // Find all the radio buttons for the given movie
    const ratingInputs = document.querySelectorAll(`input[name="rating-${movieId}"]`);

    // Set the correct radio button as checked
    ratingInputs.forEach(input => {
        if (input.value == rating) {
            input.checked = true;
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    // Get all checkboxes with class 'watched-checkbox'
    const checkboxes = document.querySelectorAll('.watched-checkbox');
    
    // Add event listeners to each checkbox
    checkboxes.forEach(function (checkbox) {
        checkbox.addEventListener('change', function () {
            const movieId = checkbox.getAttribute('data-id');
            const isWatched = checkbox.checked;
            
            // Send the updated status to the server
            toggleWatchedStatus(movieId, isWatched);
        });
    });
});

// Function to toggle the watched status
function toggleWatchedStatus(movieId, isWatched) {
    const watchlistId = document.getElementById('watchlistId').value;
    fetch('/watchlist/toggleWatched', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            watchlistId: watchlistId,
            movieId: movieId,
            watched: isWatched
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Watched status updated');
            } else {
                console.log('Error updating watched status');
            }
        })
        .catch(error => {
            console.error('Error updating watched status:', error);
        });
}