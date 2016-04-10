import React from 'react-native'
import RNFS from 'react-native-fs'
import TrackItem from './TrackItem'
import * as api from './../api'

const { View, Text, ListView } = React

const TrackList = React.createClass ({
  getInitialState () {
    return ({
      loaded: false,
      files: [],
      tracksDataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    })
  },

  componentWillMount () {
    api.loadTracks(this.props.accessToken)
      .end((err, res) => {
        this.setState({
          loaded: true,
          tracksDataSource: this.state.tracksDataSource.cloneWithRows(
            res.body.collection.map((item) => item.origin)
          )
        })
      })

    this.loadLocalFiles()
  },

  loadLocalFiles () {
    RNFS.readDir('/mnt/sdcard').then((files) => {
      this.setState({
        files: files.map((file) => ({
          name: file.name,
          isDownloaded: true
        }))
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
          (start) => {
            this.setState({
              files: this.state.files.concat([{name: `${track.id}.${track.original_format}`, isDownloading: true}])
            })
          },
          (progress) => {
            const progressSummary = parseInt(progress.bytesWritten / progress.contentLength * 100)
            this.setState({
              files: this.state.files.map((file) => {
                if (file.name === `${track.id}.${track.original_format}`) {
                  return Object.assign({}, file, { downloadProgress: progressSummary })
                } else {
                  return file
                }
              })
            })
          }
        ).then((success) => {
          this.loadLocalFiles()
        })
      }
    )
  },

  renderTrack (track) {
    return (
      <TrackItem
        track={track}
        file={this.state.files.find((file) => file.name === `${track.id}.${track.original_format}`)}
        onPress={this.downloadTrack}
      />
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

export default TrackList
