// Add Movie to Watchlist
function addMovieToWatchlist(movieId) {
    const watchlistId = document.getElementById('watchlistId').value; // Get the watchlist ID

    fetch('/watchlist/addMovie', { // Send a POST request to add the movie
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ // Pass the watchlist ID and movie ID in the request body
            watchlistId: watchlistId,
            movieId: movieId
        }),
    }).then(response => {
        if (window.opener && !window.opener.closed) {
            window.opener.refreshWatchlist(); // Refresh the watchlist in the parent window if open
        }
    });
}

// Remove Movie from Watchlist
function removeMovieFromWatchlist(movieId) {
    const watchlistId = document.getElementById('watchlistId').value; // Get the watchlist ID

    fetch('/watchlist/removeMovie', { // Send a POST request to remove the movie
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            watchlistId: watchlistId,
            movieId: movieId
        }),
    }).then(response => response.json())
        .then(data => {
            if (data.success) {
                updateWatchlistTable(data.movies); // Update the table with the remaining movies
            }
        })
        .catch(error => {
            console.error('Error fetching watchlist movies:', error);
        });
}

// Update the Watchlist Table with new data
function updateWatchlistTable(movies) {
    const tbody = document.querySelector('table tbody'); // Target the table body
    tbody.innerHTML = ''; // Clear the existing table content

    if (movies.length > 0) {
        movies.forEach(movie => {
            const row = document.createElement('tr'); // Create a new row

            // Add poster cell
            const posterCell = document.createElement('td');
            const posterImg = document.createElement('img');
            posterImg.src = movie.poster_path 
                ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` 
                : '/images/placeholder.png'; // Use a placeholder if no poster is available
            posterImg.alt = `${movie.title} Poster`;
            posterCell.appendChild(posterImg);

            // Add title cell
            const titleCell = document.createElement('td');
            titleCell.textContent = movie.title;

            // Add overview cell
            const overviewCell = document.createElement('td');
            overviewCell.textContent = movie.overview;

            // Add release date cell
            const releaseDateCell = document.createElement('td');
            releaseDateCell.textContent = movie.release_date;

            // Add rating cell with star ratings
            const ratingCell = document.createElement('td');
            const starRatingDiv = document.createElement('div');
            starRatingDiv.classList.add('star-rating');

            for (let i = 5; i >= 1; i--) {
                const input = document.createElement('input');
                input.type = 'radio';
                input.id = `star${i}-${movie.id}`;
                input.name = `rating-${movie.id}`;
                input.value = i;

                if (movie.rating && movie.rating == i) {
                    input.checked = true;
                }

                input.addEventListener('change', () => {
                    updateMovieRating(movie.id, i); // Update rating on change
                });

                const label = document.createElement('label');
                label.setAttribute('for', `star${i}-${movie.id}`);
                label.textContent = '★';

                starRatingDiv.appendChild(input);
                starRatingDiv.appendChild(label);
            }

            ratingCell.appendChild(starRatingDiv);

            // Add watched checkbox
            const watchedCell = document.createElement('td');
            const watchedCheckbox = document.createElement('input');
            watchedCheckbox.type = 'checkbox';
            watchedCheckbox.classList.add('watched-checkbox');
            watchedCheckbox.dataset.id = movie.id;
            watchedCheckbox.checked = movie.watched;
            watchedCheckbox.addEventListener('change', () => {
                toggleWatchedStatus(movie.id, watchedCheckbox.checked);
            });
            watchedCell.appendChild(watchedCheckbox);

            // Add remove button
            const actionCell = document.createElement('td');
            const removeButton = document.createElement('button');
            removeButton.classList.add('remove');
            removeButton.textContent = '-';
            removeButton.onclick = () => removeMovieFromWatchlist(movie._id);
            actionCell.appendChild(removeButton);

            // Append cells to the row
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
        // Display message if no movies are found
        const noResultsRow = document.createElement('tr');
        const noResultsCell = document.createElement('td');
        noResultsCell.colSpan = 7;
        noResultsCell.classList.add('no-results');
        noResultsCell.textContent = 'No movies found.';
        noResultsRow.appendChild(noResultsCell);
        tbody.appendChild(noResultsRow);
    }
}
