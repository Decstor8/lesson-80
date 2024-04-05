import { Router, Request, Response } from 'express';
import { RowDataPacket, FieldPacket, ResultSetHeader } from 'mysql2';
import { Place, ErrorResponse } from '../types';
import db from '../database';

const placesRouter = Router();

placesRouter.get('/', async (req: Request, res: Response<Place[] | ErrorResponse>) => {
    try {
        const [places]: [RowDataPacket[], FieldPacket[]] = await db.query('SELECT * FROM places');
        res.json(places as Place[]);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при получении местоположений' });
    }
});

placesRouter.get('/:id', async (req: Request, res: Response<Place | ErrorResponse>) => {
    try {
        const [place]: [RowDataPacket[], FieldPacket[]] = await db.query('SELECT * FROM places WHERE id = ?', [req.params.id]);
        if (place.length === 0) {
            return res.status(404).json({ message: 'Местоположение не найдено' });
        }
        res.json(place[0] as Place);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при получении' });
    }
});

placesRouter.post('/', async (req: Request, res: Response<Place | ErrorResponse>) => {
    const { name, description } = req.body;
    try {
        const [result]: [ResultSetHeader, FieldPacket[]] = await db.query('INSERT INTO places (name, description) VALUES (?, ?)', [name, description]);
        const insertId = result.insertId;
        const [newPlace]: [RowDataPacket[], FieldPacket[]] = await db.query('SELECT * FROM places WHERE id = ?', [insertId]);
        res.status(201).json(newPlace[0] as Place);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка, не получилось создать новое место', error: err });
    }
});

placesRouter.put('/:id', async (req: Request, res: Response<ErrorResponse>) => {
    const { id } = req.params;
    const { name, description } = req.body;
    try {
        await db.query('UPDATE places SET name = ?, description = ? WHERE id = ?', [name, description, id]);
        res.status(200).json({ message: 'Местоположение обновлено' });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка, не удалось обновить местоположение', error: err });
    }
});

placesRouter.delete('/:id', async (req: Request, res: Response<ErrorResponse>) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM places WHERE id = ?', [id]);
        res.status(200).json({ message: 'удалено' });
    } catch (err) {
        res.status(500).json({ message: 'Не удалось удалить', error: err });
    }
});

export default placesRouter;
