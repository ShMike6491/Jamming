import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import PlayList from '../PlayList/PlayList';
import Spotify from '../../util/Spotify';
import './App.css';


class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            //here i am supposed to have my array of songs which i'll pass next
            searchResults: [], 
            playlistName: 'New Playlist',
            playlistTracks: []
        }

        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.search = this.search.bind(this);
    }

    addTrack(track) {
        let list = this.state.playlistTracks;
        if (list.find(savedTrack => (savedTrack.id === track.id))) {return}
        list.push(track);

        this.setState( {playlistTracks : list} );
    }

    removeTrack(track) {
        let list = this.state.playlistTracks;
        list = list.filter(savedTrack => savedTrack.id !== track.id);
        
        this.setState( {playlistTracks : list} );
    }

    updatePlaylistName(name) {
        this.setState( {playlistName : name} )
    }

    savePlaylist() {
        let TrackURIs = this.state.playlistTracks.map(x => x.uri);
        Spotify.savePlayList(this.state.playlistName, TrackURIs).then(() => {
            this.setState({
                playlistName: 'New Playlist',
                playlistTracks: [],
            })
        })
    }

    search(term) {
        Spotify.search(term).then(res => {
            this.setState({ searchResults : res })
        })
    }

    render() {
        return (
            <div>
            <h1>Ja<span className="highlight">mmm</span>ing</h1>
            <div className="App">
                <SearchBar 
                onSearch={this.search}/>
                <div className="App-playlist">
                <SearchResults results={this.state.searchResults} onAdd={this.addTrack}/>
                <PlayList 
                onSave={this.savePlaylist}
                onNameChange={this.updatePlaylistName}
                isRemoval={true}
                plName={this.state.playlistName} 
                playlist={this.state.playlistTracks}
                onRemove={this.removeTrack}/>
                </div>
            </div>
            </div>
        )
    }
};

export default App;