import http from 'http'
import bibleApi from '@bible-api/bible-api'

const server = http.createServer((request, response) => {
  if (request.method !== 'POST') {
    response.statusCode = 405
    response.end()
    return
  }

  let body = ''
  request.on('data', chunk => {
    body += chunk
  })

  request.on('end', () => {
    const requestData = JSON.parse(body)
    console.log(requestData)
    try {
      const version = bibleApi.localVersions[requestData.version.toLowerCase()]
      let passage = {}
      if (requestData.getVerseOptions)
        passage = version.getVerse(requestData.getVerseOptions)
      else passage = version.getPassage(requestData.getPassageOptions)

      response.setHeader('Content-Type', 'application/json')
      response.end(JSON.stringify(passage))
    } catch (error) {
      response.statusCode = 400
      response.end()
    }
  })
})

const port = 1337
server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
