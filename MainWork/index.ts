import express from 'express';
import categoriesRouter from './router/categories';

const app = express();
const port = 8000;


app.use(express.json());
app.use('/categories', categoriesRouter);

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
