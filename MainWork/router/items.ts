import { Router, Request, Response } from 'express';
import { RowDataPacket, ResultSetHeader, FieldPacket } from 'mysql2/promise';
import multer from 'multer';
import db from './database';
import { ErrorResponse, Item } from '../types';

const itemsRouter = Router();
const upload = multer({ dest: 'uploads/' });

itemsRouter.get('/', async (req: Request, res: Response<Item[] | ErrorResponse>) => {
    try {
        const [items] = await db.query<RowDataPacket[]>('SELECT * FROM items');
        res.json(items as Item[]);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
        res.status(500).json({ message: 'Ошибка при получении предметов учета', error: errorMessage });
    }
    
});

itemsRouter.get('/:id', async (req: Request, res: Response<Item | ErrorResponse>) => {
    try {
      const [item, _]: [RowDataPacket[], FieldPacket[]] = await db.query<RowDataPacket[]>('SELECT * FROM items WHERE id = ?', [req.params.id]);
      if (item.length === 0) {
        return res.status(404).json({ message: 'Предмет учета не найден' });
      }
      res.json(item[0] as Item);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      res.status(500).json({ message: 'Ошибка при получении предмета учета', error: errorMessage });
    }
  });
  
  itemsRouter.post('/', upload.single('photo'), async (req: Request, res: Response<Item | ErrorResponse>) => {
    const { name, description } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : null;
    try {
        const [result]: [ResultSetHeader, FieldPacket[]] = await db.query<ResultSetHeader>(
            'INSERT INTO items (name, description, photo) VALUES (?, ?, ?)',
            [name, description, photo]
        );
        const insertId = result.insertId;
        const [newItem]: [RowDataPacket[], FieldPacket[]] = await db.query<RowDataPacket[]>(
            'SELECT * FROM items WHERE id = ?',
            [insertId]
        );
        res.status(201).json(newItem[0] as Item);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
        res.status(500).json({ message: 'Ошибка при создании предмета учета', error: errorMessage });
    }
});

itemsRouter.delete('/:id', async (req: Request, res: Response<ErrorResponse>) => {
  try {
    await db.query('DELETE FROM items WHERE id = ?', [req.params.id]);
    res.status(200).json({ message: 'Предмет учета удален' });
  } catch (err) {
    res.status(500).json({ message: 'Ошибка при удалении предмета учета' });
  }
});

export default itemsRouter;
