import axios from 'axios'
import jsonp from 'jsonp'
import sha1 from '../utils/sha1'
export default {
  cloudapi: (url, method, data, callback) => {
    let AppId = 'A6054211052206'
    let AppKey = '5305A293-A078-235A-937E-92E35B768FD3'
    let now = Date.now()
    let appKey = sha1.SHA1(AppId + 'UZ' + AppKey + 'UZ' + now) + '.' + now
    let headers = {'X-APICloud-AppId': AppId, 'X-APICloud-AppKey': appKey}
    switch (method) {
      case 'GET':
        axios.get(url + encodeURIComponent(JSON.stringify(data)), {headers: headers})
          .then(function (response) {
            callback(response.data)
          })
          .catch(function (error) {
            console.log(error)
            callback(error)
          })
        break
      case 'PUT':
        axios.put(url, data, {headers: headers})
          .then(function (response) {
            callback(response.data)
          })
          .catch(function (error) {
            console.log(error)
            callback(error)
          })
        break
    }
  },
  doubanapi: (isbn, callback) => {
    jsonp('https://api.douban.com/v2/book/isbn/' + isbn, null, function (err, data) {
      if (err) {
        console.error(err.message)
        callback(null)
      } else {
        //  console.log(data)
        callback(data)
      }
    })
  }
}
