import { Request, Response } from 'express';
import { IBooks } from '../models/book';

//initial booklist
let bookList:IBooks[]=[
    {"id":1,"title":"The Hobbit: An Unexpected Journey",price:980},
    {"id":2,"title":"The Hobbit: Desolution of Smaug",price:981},
    {"id":3,"title":"The Hobbit: Battle of Five Armies",price:982},
    {"id":4,"title":"The Hobbit: Hardcover Edition",price:983}
]


export const getAllBooks = (_req: Request, res: Response) => {
  console.log('Retrieving all Books')
  res.send(bookList).status(200);
};

export const getBookById = (req: Request, res: Response) => {
    console.log('Retrieving Book by ID')
    const id:number = parseInt(req.params.id)
    const book = bookList.find((books)=> books.id === id)
    if(!book){
        return res.status(404).json({message:'Book not found'})
    }
    res.send(book).status(200)
};

export const createBook = (req: Request, res: Response) => {
    try {
        console.log("Creating New Book");
        const { id, title, price }: IBooks = req.body;
        // Check if required fields are present
        if (!id || !title || !price) {
            return res.status(400).send('Required fields are missing.');
        }
        const newBook: IBooks = { id, title, price };
        bookList.push(newBook);
        res.status(201).send(newBook);
    } catch (error) {
        console.error("Error creating new book:", error);
        res.status(500).send('Internal server error');
    }
};

export const updateBookbyID = (req: Request, res: Response) => {
    console.log('updating the existing book')
    const id:number = parseInt(req.params.id)

    const { title, price }: IBooks = req.body;

    const index: number = bookList.findIndex(books => books.id === id);
    if (index < 1){
        res.send(`Book with id ${id} not found in DB`).status(404)
    }
    //update the book object
    bookList[index] = {id,title,price}
    res.send(bookList[index]).status(201)
};

export const deleteBook = (req: Request, res: Response) => {
    console.log('Deleting a book from list of books')
    const id:number = parseInt(req.params.id)
    const index: number = bookList.findIndex(a => a.id === id);
    if (index !== -1) {
        const deletedBook: IBooks = bookList.splice(index, 1)[0];
        res.send(deletedBook);
    } else {
        res.send(`Book with id ${id} not found in DB`).status(404)
    }
};
