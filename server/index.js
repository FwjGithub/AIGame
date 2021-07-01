const express = require('express')
const port = 8888
const app = new express()
const formatData = require('./util/formatData')
const AipBodyAnalysisClient = require('baidu-aip-sdk').bodyanalysis

// 设置APPID/AK/SK
const APP_ID = '24456953'
const API_KEY = 'AgFl0VjBdeRX4Z6lqFm2qpfd'
const SECRET_KEY = 'ikXGdAmIgs1xfRXlmMyniFLkP5kryY2Q'
const client = new AipBodyAnalysisClient(APP_ID, API_KEY, SECRET_KEY)

const accessToken = '24.4c970024b9ba655b8f2869f94a24c4db.2592000.1627528349.282335-24456953'

// 跨域问题解决方面
app.all('*', function (req, res, next) {
    console.log('all接受到请', req.url)
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Origin', 'http://localhost:8888')
    res.header('Access-Control-Allow-Headers', 'Content-Type')
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
    next()
})
app.get('/api', function (req, resp) {
    console.log('来了请求：', req.url)
    resp.writeHead(200)
    resp.write('查询成功, url:' + req.url)
    resp.end()
})
app.post('/api', function (req, resp) {
    console.log('post', req.url)
    let allData = '';
    const imgBase64 = '';
    req.on('data', function (data) {
        allData += data.toString();
        if (allData[allData.length - 1] === '}') {
            const image = JSON.parse(allData).image.toString()

            // console.log('image:', image)
            client.gesture(image).then(function (result) {
                // console.log('后端调用AI接口结果：', JSON.stringify(result))
                resp.writeHead('200')
                resp.write(formatData('success', '数据如result所示', result))
                resp.end()
            }).catch(function (err) {
                // 如果发生网络错误
                console.log(err)
            })
        }

    })
})
app.listen(port, () => {
    console.log(`开始监听端口${port}`)
})
