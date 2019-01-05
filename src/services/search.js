import ajax from '../config/ajax'
import tools from '../utils/tools'
const pageSize = 25
export default {
  pageSize: pageSize,
  getBooks: (method, key, fields, type, pageno, callback) => {
    let where = {}
    switch (method) {
      case 'bookno':
        where = {'no': tools.zhuanyi(key)}
        break
      default:
        where['or'] = []
        for (let i = 0; i < type.length; i++) {
          let fieldJson = {}
          fieldJson[type[i]] = {'like': (type[i] === 'no' ? '^' : '') + key + '.*'}
          where['or'].push(fieldJson)
        }
    }
    let filtedic = {'fields': fields, 'where': where, 'limit': pageSize, 'skip': (pageno - 1) * pageSize, 'order': 'createtime DESC,no ASC'}
    let url = 'https://d.apicloud.com/mcm/api/Book?filter='
    let methodstr = 'GET'
    ajax.cloudapi(url, methodstr, filtedic, callback)
  },
  getCategories: (method, key, fields, type, pageno, callback) => {
    let where = {}
    switch (method) {
      case 'categoryno':
        where = {'pno': tools.zhuanyi(key)}
        break
      default:
        where['or'] = []
        for (let i = 0; i < type.length; i++) {
          let fieldJson = {}
          fieldJson[type[i]] = {'like': '%' + key + '%'}
          where['or'].push(fieldJson)
        }
    }
    let filtedic = {'fields': fields, 'where': where, 'limit': pageSize, 'skip': (pageno - 1) * pageSize, 'order': 'sort_num ASC'}
    let url = 'https://d.apicloud.com/mcm/api/Category?filter='
    let methodstr = 'GET'
    ajax.cloudapi(url, methodstr, filtedic, callback)
  },
  getDoubanInfo: (isbn, callback) => {
    ajax.doubanapi(isbn, callback)
  },
  saveBook: (id, book, callback) => {
    let url = 'https://d.apicloud.com/mcm/api/Book/' + id
    ajax.cloudapi(url, 'PUT', book, callback)
  }
}
