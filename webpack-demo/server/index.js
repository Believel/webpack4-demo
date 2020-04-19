if (typeof window === 'undefined') {
    global.window = {}
}
const express = require('express')
const fs = require('fs')
const path = require('path')
const { renderToString } = require('react-dom/server')
const SSR = require('../dist/index-server');
const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf-8');

const server = (port) => {
    const app = express()
    // 静态文件设置
    app.use(express.static(path.join(__dirname, '../dist')));
    app.get('/index', (req, res) => {
        console.log(renderToString(SSR))
        const html = renderMarkUp(renderToString(SSR))
        res.status(200).send(html)
    })
    app.listen(port, () => {
        console.log('Server is running on port:', port)
    })
}
const renderMarkUp = (str) => {
   return template.replace('<!--HTML_PLACEHOLDER-->', str)
}

server(process.env.PORT || 3001)