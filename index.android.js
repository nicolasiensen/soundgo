'use strict';

import React from 'react-native';
import Button from 'react-native-button';
import superagent from 'superagent';
import RNFS from 'react-native-fs';
const { StyleSheet, AppRegistry, View, Text, ListView, TouchableHighlight } = React;

const soundgo = React.createClass ({
  loadTracks () {
    superagent
      .get('https://api.soundcloud.com/tracks')
      .query({client_id: '613b49e595474fe66d19172652fe8423'})
      .end((err, res) => {
        this.setState({
          tracks: this.state.tracks.cloneWithRows(
            res.body.filter((track) => track.downloadable)
          )
        })
      });
  },

  downloadTrack (track) {
    RNFS.downloadFile(
      `${track.download_url}?client_id=613b49e595474fe66d19172652fe8423`,
      `/mnt/sdcard/${track.id}.${track.original_format}.tmp`,
      (start) => {
        RNFS.downloadFile(
          start.headers.Location,
          `/mnt/sdcard/${track.id}.${track.original_format}`,
          (start) => {console.log(start)},
          (progress) => {console.log(progress)}
        )
      }
    )
  },

  getInitialState () {
    return (
      {
        tracks: new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 !== row2,
        })
      }
    );
  },

  renderTrack (track) {
    return (
      <TouchableHighlight onPress={() => {this.downloadTrack(track)}}>
        <View style={styles.track}>
          <Text>{track.title}</Text>
        </View>
      </TouchableHighlight>
    )
  },

  render() {
    const tracks = this.state.tracks;
    return (
      <View style={styles.container}>
        <Button
          containerStyle={{padding:10, overflow:'hidden', borderRadius:4, backgroundColor: 'orange'}}
          style={{fontSize: 20, color: 'white'}}
          onPress={this.loadTracks}>
          Load tracks
        </Button>
        <ListView
          dataSource={this.state.tracks}
          renderRow={this.renderTrack}
          style={styles.listView}
        />
      </View>
    );
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  introduction: {
    fontSize: 20,
    marginBottom: 2
  },
  button: {
    backgroundColor: '#666',
    padding: 2
  },
  listView: {
    backgroundColor: '#F5FCFF'
  },
  track: {
    padding: 20
  }
});

AppRegistry.registerComponent('soundgo', () => soundgo);
