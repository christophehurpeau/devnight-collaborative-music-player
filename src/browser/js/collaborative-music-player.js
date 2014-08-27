document.addEventListener( "DOMContentLoaded", main, false );

function main() {
}


global.playerController = function() {
    var playingCssClass = 'playing';
    var audioObject;


    var fetchTracks = function (albumId, callback) {
        $.ajax({
            url: 'https://api.spotify.com/v1/albums/' + albumId,
            success: function (response) {
                callback(response);
            }
        });
    };

    var results = loadSearch();
    results.addEventListener('click', function(e) {
        var target = e.target;
        if (target !== null && target.classList.contains('cover')) {
            if (target.classList.contains(playingCssClass)) {
                audioObject.pause();
            } else {
                if (audioObject) {
                    audioObject.pause();
                }
                fetchTracks(target.getAttribute('data-album-id'), function(data) {
                    audioObject = new Audio(data.tracks.items[0].preview_url);
                    audioObject.play();
                    target.classList.add(playingCssClass);
                    audioObject.addEventListener('ended', function() {
                        target.classList.remove(playingCssClass);
                    });
                    audioObject.addEventListener('pause', function() {
                        target.classList.remove(playingCssClass);
                   });
                });
            }
        }
    });
};



function loadSearch() {
    var results = document.getElementById('results');

    var searchAlbums = function(query) {
        $.ajax({
            url: 'https://api.spotify.com/v1/search',
            data: {
                q: query,
                type: 'album'
            },
            success: function (response) {
                results.innerHTML = '';
                var fragment = document.createDocumentFragment();
                response.albums.items.forEach(function(item) {
                    var div = document.createElement('div');
                    div.setAttribute('style', 'background-image:url(' + item.images[0].url + ')');
                    div.setAttribute('data-album-id', item.id);
                    div.setAttribute('class', 'cover');
                    fragment.appendChild(div);
                });
                results.appendChild(fragment);
            }
        });
    };


    document.getElementById('search-form').addEventListener('submit', function (e) {
        e.preventDefault();
        searchAlbums(document.getElementById('query').value);
    }, false);

    return results;
}