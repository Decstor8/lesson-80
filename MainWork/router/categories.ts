import { Router, Request, Response } from 'express';
import { RowDataPacket, FieldPacket, ResultSetHeader } from 'mysql2';
import { Category, ErrorResponse } from '../types';
import db from './database';

const categoriesRouter = Router();

categoriesRouter.get('/', async (req: Request, res: Response<Category[] | ErrorResponse>) => {
    try {
        const [categories]: [RowDataPacket[], FieldPacket[]] = await db.query('SELECT * FROM categories');
        res.json(categories as Category[]);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при получении категорий'});
    }
});

categoriesRouter.get('/:id', async (req: Request, res: Response<Category | ErrorResponse>) => {
    try {
        const [category]: [RowDataPacket[], FieldPacket[]] = await db.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
        if (category.length === 0) {
            return res.status(404).json({ message: 'Упс.. не удалось найти категорию' });
        }
        res.json(category[0] as Category);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при получении категории'});
    }
});

categoriesRouter.post('/', async (req: Request, res: Response<Category | ErrorResponse>) => {
    const { name, description } = req.body;
    try {
        const [result]: [ResultSetHeader, FieldPacket[]] = await db.query('INSERT INTO categories (name, description) VALUES (?, ?)', [name, description]);
        const insertId = result.insertId;
        const [newCategory]: [RowDataPacket[], FieldPacket[]] = await db.query('SELECT * FROM categories WHERE id = ?', [insertId]);
        res.status(201).json(newCategory[0] as Category);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка, не получилось создать категорию', error: err });
    }
});

categoriesRouter.put('/:id', async (req: Request, res: Response<ErrorResponse>) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        await db.query('UPDATE categories SET name = ?, description = ? WHERE id = ?', [name, description, id]);
        res.status(200).json({ message: 'Категория обновилась!'});
    } catch (err) {
        res.status(500).json({ message: 'Ошибка, не получилось обновить категорию', error: err });
    }
});

categoriesRouter.delete('/:id', async (req: Request, res: Response<ErrorResponse>) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM categories WHERE id = ?', [id]);
        res.status(200).json({ message: 'Удалена' });
    } catch (err) {
        res.status(500).json({ message: 'Не удалось удалить категория :(', error: err });
    }
});

export default categoriesRouter;
