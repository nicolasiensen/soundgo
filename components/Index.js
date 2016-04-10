import React from 'react-native'
import Button from 'react-native-button'
import superagent from 'superagent'
import RNFS from 'react-native-fs'

const {
  View,
  Text,
  StyleSheet,
  ListView,
  TouchableHighlight,
  Image
} = React

const Index = React.createClass ({
  getInitialState () {
    return ({
      loaded: false,
      tracksDataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    })
  },

  componentWillMount () {
    this.loadTracks()
  },

  loadTracks () {
    superagent
      .get('https://api.soundcloud.com/me/activities/tracks/affiliated')
      .query({client_id: '613b49e595474fe66d19172652fe8423'})
      .query({oauth_token: this.props.accessToken})
      .end((err, res) => {
        this.setState({
          loaded: true,
          tracksDataSource: this.state.tracksDataSource.cloneWithRows(
            res.body.collection.map((item) => item.origin)
          )
        })
      })
  },

  downloadTrack (track) {
    RNFS.downloadFile(
      `${track.uri}/download?client_id=613b49e595474fe66d19172652fe8423`,
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
      <TouchableHighlight onPress={() => {this.downloadTrack(track)}}>
        <View style={{padding: 10, flexDirection: 'row', alignItems: 'center'}}>
          <Image source={{uri: track.artwork_url}} style={{width: 75, height: 75, marginRight: 10}} />
          <View style={{flex: 1}}>
            <Text style={{fontWeight: 'bold'}}>{track.title}</Text>
            <Text>by {track.user.username}</Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  },

  renderTrackList () {
    return (
      <ListView
        style={{flex: 1}}
        dataSource={this.state.tracksDataSource}
        renderRow={this.renderTrack}
      />
    )
  },

  renderLoading () {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Loading...</Text>
      </View>
    )
  },

  render () {
    return (
      <View style={{flex: 1}}>
        {this.state.loaded ? this.renderTrackList() : this.renderLoading()}
      </View>
    )
  }
})

export default Index
