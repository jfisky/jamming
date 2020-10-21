import React from 'react';
import './App.css';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import { Spotify } from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [
        // {name: 'disco tits', artist:'Tove Lo', album:'BLUE LIPS', id:'track1'},
        // {name:'Slow Down', artist:'The Academy Is...', album:'Almost Here', id:'track2'},
        // {name:'Garden', artist:'Meet Me @ The Alter', album:'Bigger Than Me', id:'track3'}
      ],
      playlistName: '',
      playlistTracks: [
        // {name: '1+1', artist: 'Beyonce', album: '4', id: 'Bey_1+1'},
        // {name: 'Cranes in the Sky', artist: 'Solange', album: 'A Seat At The Table', id: 'Solance_CITS'}
      ]
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    let temp = this.state.playlistTracks;
    temp.push(track);
    this.setState({playlistTracks: temp});
    // console.log('ADDED NEW SONG: '+track.id);
  }

  removeTrack(track) {
    let ind = this.state.playlistTracks.findIndex(savedTrack => savedTrack.id === track.id);
    let temp = this.state.playlistTracks;
    temp.splice(ind, 1);
    this.setState({playlistTracks: temp});
    // console.log('REMOVED SONG: '+track.name+' ... '+track.id);
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(track => {
      return track.uri;
    });
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
  }

  async search(term) {
    let results = await Spotify.search(term);
    // console.log(typeof results);
    // console.log(results);
    // console.log();
    this.setState({searchResults: results});
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} 
              playlistTracks={this.state.playlistTracks} 
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
};

export default App;
