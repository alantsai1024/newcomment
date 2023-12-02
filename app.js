const express = require('express')
const app = express()
const dotenv = require('dotenv')

const port = 5050


dotenv.config({ path: './config.env' })


const Message = require('./modules/message')

const mongoose = require('mongoose')

app.use(express.urlencoded({ extended: true }))

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

db.on('error', () => {
    console.log('連接數據庫失敗');
})

db.once('open', () => {
    console.log('MONGODB 已連接...');
})

app.set('view engine', 'hbs')

app.use(express.static('public'))

app.get('/', async (req, res) => {

    const message = await Message.find()

    const divElements = message.map((result,index) => {
        return `<div class="comment">
                    <div class="index">${index+1}F</div>
                    <div class="user">${result.name}：</div>
                    <div class="commentcontent">${result.content}</div>
                </div>`;
    });

    const recordmail = divElements.join('');
    res.render('index', { recordmail })
})

app.post('/uploadmessage', async (req, res) => {
    const name = req.body.name;
    const content = req.body.content;

    if (!name | !content) {
        res.render('index', { message: '請輸入完整資訊！' })
    } else {
        const message = new Message({
            name,
            content
        })
        await message.save()
        res.redirect('/')
    }
})

app.listen(port, () => {
    console.log(`服務器運行在 http://localhost:${port}`);
})
