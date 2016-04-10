'use strict'

import React from 'react-native'
import Button from 'react-native-button'
import superagent from 'superagent'
import RNFS from 'react-native-fs'

import Index from './js/components/Index'
import Connect from './js/components/Connect'

const { AppRegistry, Linking } = React

const soundgo = React.createClass ({
  getInitialState () {
    return ({ accessToken: null })
  },

  componentWillMount () {
    Linking.getInitialURL().then((url) => {
      if (url) {
        const accessToken = /access_token=([\d\-\w]*)/.exec(url)[1]
        this.setState({accessToken: accessToken})
      }
    })
  },

  render() {
    const { accessToken } = this.state
    return accessToken ? <Index accessToken={accessToken} /> : <Connect />
  }
})

AppRegistry.registerComponent('soundgo', () => soundgo)
