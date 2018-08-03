'use strict'

const { parse } = require('url')
const { join, extname } = require('path')
const { stat } = require('fs')

const VALID_METHODS = ['GET', 'HEAD']
const VALID_EXTS = ['jpg', 'jpeg', 'png']

const isValidMethod = (methods, method) => methods.includes(method)
const isValidExtension = (exts, ext) => exts.includes(ext.replace(/^\./, ''))
const isValidAcceptHeader = (accept) => accept && accept.indexOf('image/webp') !== -1

module.exports = function(dirname, extensions = VALID_EXTS) {
  return async function(ctx, next) {
    const { pathname } = parse(ctx.request.url)
    const ext = extname(pathname)

    if (
      !isValidMethod(VALID_METHODS, ctx.request.method.toUpperCase()) ||
      !isValidExtension(extensions, ext) ||
      !isValidAcceptHeader(ctx.request.headers.accept)
    ) {
      return await next()
    }

    const newPathname = pathname.replace(ext, '') + '.webp'
    const filePath =  decodeURIComponent(join(dirname, newPathname))

    try {
      const stats = await new Promise((resolve, reject) => {
        stat(filePath, (err, stat) => {
          if (err) {
            reject(err)
          }
          else {
            resolve(stat)
          }
        })
      })

      if (stats.isFile()) {
        ctx.request.url = ctx.request.url.replace(pathname, newPathname)
      }

      ctx.response.vary('Accept')
      return await next()
    }
    catch(err) {
      return await next()
    }
  }
}
