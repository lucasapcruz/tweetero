import express, { json } from "express"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())

const users = [
    { username: "bobesponja", avatar: "https://super.abril.com.br/wp-content/uploads/2020/09/04-09_gato_SITE.jpg?quality=70&strip=info" }
]
const tweets = [
    { username: "bobesponja", tweet: "eu amo o hub" }
]

function isValidUrl(url) {
    let regex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
    return regex.test(url)
}

function isValidTextField(inputText) {
    return typeof inputText === "string"
}


app.get("/tweets", (req, res) => {
    const payload = []
    const page = Number(req.query.page)
    if (page < 1) {
        res.status(400).send("Informe uma página válida!")
    } else {
        if (tweets.length > ((page - 1) * 10)) {
            const end = Math.min(tweets.length, (page * 10))
            const start = end - 10
            const tweetsWindow = tweets.slice(start, end)
            tweetsWindow.forEach((tweet) => {
                const user = users.find((user) => user.username === tweet.username)
                const avatar = user.avatar
                tweet.avatar = avatar
                payload.push(tweet)
            })
        }

        res.send(payload)
    }
})

app.get("/tweets/:username", (req, res) => {
    const payload = []
    const username = req.params.username

    tweets.forEach((tweet) => {
        if (tweet.username === username) {
            const user = users.find((user) => user.username === tweet.username)
            const avatar = user.avatar
            tweet.avatar = avatar
            payload.push(tweet)
        }
    })

    res.send(payload)
})


app.post("/tweets", (req, res) => {
    const body = req.body
    const username = req.headers['user']
    const entry = body
    const hasValidTweet = (entry.tweet !== undefined) && isValidTextField(entry.tweet)
    if (hasValidTweet) {
        entry.username = username
        tweets.push(entry)
        res.status(201).send("OK")
    } else {
        res.status(400).send("Todos os campos são obrigatórios!")
    }
})

app.post("/sign-up", (req, res) => {
    const body = req.body
    const hasValidUsername = (body.username !== undefined) && isValidTextField(body.username)
    const hasValidAvatar = (body.avatar !== undefined) && isValidUrl(body.avatar)
    if (hasValidUsername && hasValidAvatar) {
        users.push(body)
        res.status(201).send("OK")
    } else {
        res.status(400).send("Todos os campos são obrigatórios!")
    }
})

app.listen(5000)