import scraperjs from 'scraperjs'
import moment from 'moment'
import writeTracksToFirebase from './writeTracksToFirebase'
import spotify from './initialiseSpotify.js'

const addSpotifyId = (station, track) => {
  spotify.searchTracks(`track:${track.title} artist:${track.artist}`, { limit: 1 })
    .then((trackData) => {
      track.spotifyId = trackData.body.tracks.items[0].id

      writeTracksToFirebase(station, track.title, track)
    })
    .catch((error) => {
      console.log(error)
    })
}

export default (url, station, titleSelector, artistSelector) => {
  scraperjs.StaticScraper.create(url)
    .scrape(($) => {
      return {
        title: $(titleSelector).first().text(),
        artist: $(artistSelector).first().text(),
        timeStamp: moment().format('DDHmmss')
      }
    })
    .then((track) => {
      addSpotifyId(station, track)
    })
}

