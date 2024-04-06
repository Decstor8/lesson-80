import express from 'express';
import categoriesRouter from './router/categories';
import placesRouter from './router/places';
import itemsRouter from './router/items';

const app = express();
const port = 8000;


app.use(express.json());
app.use('/categories', categoriesRouter);
app.use('/places', placesRouter);
app.use('/items', itemsRouter);

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
