import superagent from 'superagent'

export function loadTracks (accessToken) {
  return (
    superagent
      .get('https://api.soundcloud.com/me/activities/tracks/affiliated')
      .query({client_id: '613b49e595474fe66d19172652fe8423'})
      .query({oauth_token: accessToken})
  )
}
