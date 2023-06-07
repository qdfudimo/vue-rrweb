const express = require("express")
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.urlencoded({
    extended: false
}))
app.post("/uploadFile",(req,res)=>{
    console.log(req);
    res.send({
        data:"",
        msg:"上传成功",
        code:200
    })
})
app.get("/count",(req,res)=>{
    console.log(111000);
    res.send("1111")
})
// 2. 设置请求对应的处理函数
//    当客户端以 GET 方法请求 / 的时候就会调用第二个参数：请求处理函数
app.get('/', (req, res) => {
  res.send('hello world')
})
 
// 3. 监听端口号，启动 Web 服务
app.listen(3000, () => console.log('app listening on port 3000!'))