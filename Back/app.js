import express from 'express'
import main from './db.js';
import pictureRouter from './routes/picture.js';
import cors from 'cors'

const app = express();
const port = process.env.PORT || 3000;
app.use(cors())
app.use(express.json())
app.use('/files', express.static('uploads'))
app.use("/pictures", pictureRouter)

app.listen(port, () => {
    console.log('Server is running on port 3000');
});

export default app