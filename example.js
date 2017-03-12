const Koa = require('koa')
const static = require('koa-static')
const acceptWebp = require('./index')

const app = new Koa()
app.use(acceptWebp(__dirname))
app.use(static(__dirname))
app.listen(1337)
