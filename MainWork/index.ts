import express from 'express';
import categoriesRouter from './router/categories';
import placesRouter from './router/places';

const app = express();
const port = 8000;


app.use(express.json());
app.use('/categories', categoriesRouter);
app.use('/places', placesRouter);

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
