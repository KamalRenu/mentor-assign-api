require('dotenv').config();
const express = require('express');
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3001;
const URL = process.env.MONGI_URI;

const assignMentorRoute = require("./routes/assignMentor");

app.use(express.json())
app.use(cors({
    origin: "*"
}))
app.use(express.urlencoded({extended: false}));

mongoose.connect(URL, {useNewUrlParser:true, useUnifiedTopology:true});
const connection = mongoose.connection;
connection.on('open', () => console.log("MongoDB connected..."));

app.use('/api/assignmentor', assignMentorRoute);

app.get('/', (req, res)=>{
    res.send('Server is running successfully');
})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));