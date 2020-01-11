let accessToken;
let clientID = 'client ID';
let redirectURL = 'http://localhost:3000/';

let Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        } 
        
        //check for access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            //This clears the parameters, allowing us to grab a new access token when it expires.
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURL}`;
            
            window.location = accessURL;
        }
        
    },

    //implementing search results
    search(term) {
        const token = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, 
        { headers: {
                        Authorization: `Bearer ${token}`
                    }
        }).then(res => res.json()).then(data => {
            if (!data.tracks) { 
                return [];
            }
            return data.tracks.items.map(x => ({
                id: x.id,
                name: x.name,
                artists: x.artists[0].name,
                album: x.album.name,
                uri: x.uri,
            }))
        })
    },

    //saving a playlist
    savePlayList(name, tracks) {
        if (!name || !tracks.length) {
            return;
        }

        const token = Spotify.getAccessToken();
        const h = { Authorization : `Bearer ${token}`};
        let userID;

        return fetch(`https://api.spotify.com/v1/me`, 
        {headers: h}).then(res => res.json()).then(data => {
            userID = data.id;
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, 
            {
                headers: h,
                method: 'POST',
                body: JSON.stringify({ name: name })
            }).then(res => res.json()).then(data => {
                const playlistID = data.id;
                return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, 
                {
                    headers: h,
                    method: 'POST',
                    body: JSON.stringify({ uris: tracks })
                })
            })
        })
    }
};

export default Spotify;