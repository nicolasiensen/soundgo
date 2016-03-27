import React from 'react-native'
import Button from 'react-native-button'

const {
  View,
  Text,
  StyleSheet,
  Linking,
  BackAndroid
} = React

const Connect = React.createClass ({
  connect () {
    Linking.openURL(`https://soundcloud.com/connect?client_id=613b49e595474fe66d19172652fe8423&redirect_uri=soundgo://soundcloud/callback&display=popup&response_type=token`)
      .catch(err => console.error('An error occurred', err))
  },

  render () {
    return (
      <View style={styles.container}>
        <Button onPress={this.connect}>Connect</Button>
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

export default Connect
