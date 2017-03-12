# koa-accept-webp
> Koa middleware for serving webp images when support is detected

## Install
`npm install koa-accept-webp`

## Usage
```js
const Koa = require('koa')
const static = require('koa-static')
const acceptWebp = require('koa-accept-webp')

const app = new Koa()

// Add the acceptWebp middleware before the statics middleware,
// so it can redirect image requests to the webp versions
app.use(acceptWebp(__dirname))
app.use(static(__dirname))
app.listen(1337)
```

## Arguments
```
acceptWebp(root[, extensions])
```

| Argument   | Type   | Description                           | Default                  | Required |
|------------|--------|---------------------------------------|--------------------------|----------|
| root       | String | Statics root directory                |                          | Yes      |
| extensions | Array  | Extensions that can be served as webp | `['jpg', 'jpeg', 'png']` | No       |

## License
MIT
