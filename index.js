var assert = require('assert')
var qs = require('querystring')
var https = require('https')
require('array-foreach-async');

// just so it doesn't show up in automated searches
var DEFAULT_KEY = Buffer.from('QUl6YVN5QW55eWZaZ0w4TWZ2WVctMnZOTWFhZ0xmekdyX0hST0NFCg==', 'base64') + ''

module.exports = function searchPlaylist (keyword) {
  return new Promise(resolve => {
    assert(typeof keyword === 'string', 'search-youtube-playlist: keyword must be string')
  
    var url = 'https://www.googleapis.com/youtube/v3/search'
    url += '?' + qs.stringify({
      key: DEFAULT_KEY,
      part: 'snippet',
      type: 'playlist',
      q: keyword
    })
    
    https.request(url, (res) => {
      var data = ''
      res.on('data', (chunk) => {
        data += chunk
      })
      res.on('end', () => {
        try { var json = JSON.parse(data) } catch (err) { throw err }
        resolve(onresponse(json))
      })
    }).end()
  })

  function onrequest (res) {
      var data = ''
      res.on('data', ondata)
      res.on('end', onend)
  
      function ondata (chunk) { data += chunk }
      function onend () {
        try { var json = JSON.parse(data) } catch (err) { throw err }
        return onresponse(json)
      }
  }

  function onresponse (json) {
    if (json.error) throw json.error
    if (json.items.length === 0) throw new Error('Not found')
    const videos = []
    for(const item of json.items) {
      videos.push({ title: item.snippet.title, id: item.id.playlistId});
    }
    return videos
  }
}
