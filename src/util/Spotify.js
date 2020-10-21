let accessToken;
const clientID = "ec5382bb39f94dbfb8e7eef9304bb648";
const redirectURI = "http://fisk-jammming.surge.sh";

export const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }
        let url = window.location.href;
        const accessRegex = /access_token=([^&]*)/;
        const expireRegex = /expires_in=([^&]*)/;
    
        let accessGrab = url.match(accessRegex);
        let expireTime = url.match(expireRegex);
        if (accessGrab !== null && expireTime !== null) {
            accessToken = accessGrab["1"];
            window.setTimeout(() => accessToken = '', expireTime["1"] * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
        }
    },
    async search(term) {
        if (!accessToken) {
            this.getAccessToken();
        }
        let tracks = await fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {Authorization: `Bearer ${accessToken}`}
        })
        .then(response => response.json())
        .then(result => {
            if(Object.keys(result).length === 0) {
                return [];
            }
            let tracks = result.tracks.items.map(track => {
                let t = {
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                }
                return t;
            });
            return tracks;
        });
        return tracks;
    },

    async savePlaylist(playlistName, trackURIs) {
        if (!playlistName || !trackURIs) {
            return;
        }
        let headers = {Authorization: `Bearer ${accessToken}`};
        let userID;
        await fetch('https://api.spotify.com/v1/me', {headers: headers})
        .then(response => response.json())
        .then(result => {
            // console.log(Object.keys(result));
            // console.log(result);
            userID = result.id;
            console.log(userID);
        });
        let playlistID = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
            method: 'POST',
            headers: { 
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: playlistName})
            }
        )
        .then(response => response.json())
        .then(result => {
            // console.log(Object.keys(result))
            // console.log(result.id);
            return result.id;
        })
        console.log('PLAYLIST SAVED! Playlist ID: '+playlistID);
        
        let updatedPlaylistID = await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
            method: 'POST',
            headers: { 
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ uris: trackURIs })
        })
        .then(response => response.json())
        .then(result => {
            console.log(Object.keys(result));
            console.log(result.snapshot_id);
            return result.snapshot_id;
        })
        console.log('ADDED SONGS TO PLAYLIST! Playlist ID: '+updatedPlaylistID);
    }
}