import React from 'react-native'
const { View, Text, TouchableHighlight, Image } = React

const TrackItem = React.createClass ({
  renderTrackStatus () {
    const { file } = this.props

    if (file.isDownloaded) {
      return 'Tap to play'
    } else if (file.isDownloading) {
      return `Downloading ${file.downloadProgress}%`
    } else {
      return 'Tap to download'
    }
  },

  render () {
    const {track, file} = this.props

    return (
      <TouchableHighlight onPress={() => {this.props.onPress(track)}}>
        <View style={style.container}>
          <Image source={{uri: track.artwork_url}} style={style.image} />
          <View style={style.right}>
            <Text style={style.title}>{track.title}</Text>
            <Text>by {track.user.username}</Text>
            <Text>{this.renderTrackStatus(track)}</Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
})

const style = {
  container: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  right: {
    flex: 1
  },
  image: {
    width: 75,
    height: 75,
    marginRight: 10
  },
  title: {
    fontWeight: 'bold'
  }
}

export default TrackItem
