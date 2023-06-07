const express = require("express")
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const app = express()
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())
app.post("/uploadFile",(req,res)=>{
    console.log(req.body,11);
    const jsonFile = path.join(process.cwd(), `./file/jsonFile${Date.now()}.json`)
    fs.writeFileSync(jsonFile, JSON.stringify(req.body.events))
    res.send({
        data:"",
        msg:"上传成功",
        code:200
    })
})
app.post("/getFile",(req,res)=>{
    const fileDirPath = path.join(process.cwd(), `./file`);
    const files = fs.readdirSync(fileDirPath);
    console.log(files);
    let file;
    if(files && files.length) {
        file = fs.readFileSync(`${fileDirPath}/${files[files.length-1]}`); // 此处只取第一个文件片段验证
    }
    res.send({
        data:JSON.parse(file),
        msg:"上传成功",
        code:200
    })
})
// 清理文件内容
app.post('/clearFile', ctx => {
    const fileDirPath = path.join(process.cwd(), `./file`);
    const files = fs.readdirSync(fileDirPath);
    if(files && files.length) {
        files.forEach(item => {
            const filePath = `${fileDirPath}/${item}`;
            fs.unlinkSync(filePath);
        })
    }
    ctx.response.body = {
        status: '00'
    }
})
app.get("/count",(req,res)=>{
    res.send("1111")
})
// 2. 设置请求对应的处理函数
//    当客户端以 GET 方法请求 / 的时候就会调用第二个参数：请求处理函数
app.get('/', (req, res) => {
  res.send('hello world')
})
 
// 3. 监听端口号，启动 Web 服务
app.listen(3000, () => console.log('app listening on port 3000!'))