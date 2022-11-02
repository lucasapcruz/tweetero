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


app.get("/tweets", (req, res) => {
    const payload = []
    const page = Number(req.query.page)
    if (page < 1) {
        res.status(400).send("Informe uma página válida!")
    } else {
        const end = Math.min(tweets.length, (page * 10))
        const start = end - 10
        const tweetsWindow = tweets.slice(start, end)
        console.log(tweetsWindow)
        tweetsWindow.forEach((tweet) => {
            const user = users.find((user) => user.username === tweet.username)
            const avatar = user.avatar
            tweet.avatar = avatar
            payload.push(tweet)
        })

        res.send(payload)
    }
})

app.post("/tweets", (req, res) => {
    const body = req.body
    tweets.push(body)
    res.send("OK")
})

app.post("/sign-up", (req, res) => {
    const body = req.body
    users.push(body)
    res.send("OK")
})

app.listen(5000)