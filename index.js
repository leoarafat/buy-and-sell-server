const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;

const app = express();
// middleware
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.send('buy and sell server is running');
})

app.listen(port, () => console.log(`Doctors portal running on ${port}`))