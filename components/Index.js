import React from 'react-native'
import Button from 'react-native-button'
import superagent from 'superagent'

const {
  View,
  Text,
  StyleSheet,
  ListView,
  TouchableHighlight
} = React

const Index = React.createClass ({
  getInitialState () {
    return ({
      tracks: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    })
  },

  loadTracks () {
    superagent
      .get('https://api.soundcloud.com/tracks')
      .query({client_id: '613b49e595474fe66d19172652fe8423'})
      .end((err, res) => {
        console.log(res)
        this.setState({
          tracks: this.state.tracks.cloneWithRows(
            res.body.filter((track) => track.downloadable)
          )
        })
      })
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
        ).then((success) => {
          console.log('Download finished!')
        })
      }
    )
  },

  renderTrack (track) {
    return (
      <TouchableHighlight
       onPress={() => {this.downloadTrack(track)}}>
        <View style={styles.track}>
          <Text>{track.title}</Text>
        </View>
      </TouchableHighlight>
    )
  },

  render () {
    return (
      <View style={styles.container}>
        <Button onPress={this.loadTracks}>Load tracks</Button>
        <ListView
          dataSource={this.state.tracks}
          renderRow={this.renderTrack}
          style={styles.listView}
        />
      </View>
    )
  }
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default Index
