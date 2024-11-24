
function addMovieToWatchlist(movieId, watchlistId) {
    // Send the POST request to add the movie to the watchlist
    fetch('/watchlist/addMovie', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ watchlistId, movieId }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Movie added to watchlist') {
                alert('Movie added to your watchlist!');
            } else {
                alert('Error adding movie to watchlist.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error adding movie to watchlist.');
        });
}
