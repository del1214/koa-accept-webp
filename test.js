const { expect } = require('chai')
const Koa = require('koa')
const static = require('koa-static')
const acceptWebp = require('./index')
const imageType = require('image-type')
const supertest = require('supertest')
const app = new Koa()
app.use(acceptWebp(__dirname))
app.use(static(__dirname))
const request = supertest.agent(app.listen(1337))

describe('koa-accept-webp', () => {
  it('should send logo.png if accept header does not contain image/webp', (done) => {
    request
      .get('/fixtures/logo.png')
      .set('Accept', 'image/*,*/*;q=0.8')
      .expect(200)
      .end((err, res) => {
        expect(imageType(res.body).mime).equals('image/png')
        done()
      })
  })

  it('should send logo.webp if accept header contain image/webp', (done) => {
    request
      .get('/fixtures/logo.png')
      .set('Accept', 'image/webp,image/*,*/*;q=0.8')
      .expect(200)
      .end((err, res) => {
        expect(imageType(res.body).mime).equals('image/webp')
        done()
      })
  })

  it('should send webp version only when the original format is compatible with webp', (done) => {
    request
      .get('/fixtures/logo.gif')
      .set('Accept', 'image/webp,image/*,*/*;q=0.8')
      .expect(200)
      .end((err, res) => {
        expect(imageType(res.body).mime).equals('image/gif')
        done()
      })
  })

  it('should send webp version only if it exists', (done) => {
    request
      .get('/fixtures/other.png')
      .set('Accept', 'image/webp,image/*,*/*;q=0.8')
      .expect(200)
      .end((err, res) => {
        expect(imageType(res.body).mime).equals('image/png')
        done()
      })
  })
})
