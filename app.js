"use strict";


const $overlay = document.getElementById('overlay');
const $modalBook = document.getElementById('modal-book');
const $modalBookDiv = document.querySelector('#modal-book>div');
const $modalBookForm = document.querySelector('#modal-book .form');
const $addBookButton = document.getElementById('button--add-book');
const $booksContainer = document.getElementById('books-container');


class Book {
    constructor(id, title, author, pages, isRead) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.isRead = isRead;
    }
}


class Library {
    constructor() {
        this.books = [];
    }


    getBooks() {
        return this.books;
    }


    clearBooks() {
        this.books = [];
    }


    addBook(book) {
        this.books = [...this.books, book];

        this.assignLocalBooksIds();
    }


    removeBookById(bookId) {
        this.books = this.books.filter(book => book.id != bookId);
    }


    // It is used to assign an id to local stored books
    // It uses the index of the book in the array
    assignLocalBooksIds() {
        this.books = this.books.map((book, index) => {
            return { ...book, id: index };
        });
    }
}


class App {
    constructor() {
        this.library = new Library();

        this.isModalBookActive = false;
    }


    // Creates event listeners for dom elements
    initialize() {
        $addBookButton.addEventListener('click', () => {
            this.isModalBookActive = true;
            this.openBookModal();
        });

        $modalBook.addEventListener('click', () => {
            if (!this.isModalBookActive) return;
            this.closeBookModal();
        });

        $modalBookDiv.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        $modalBookForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const entries = Object.fromEntries(formData.entries());

            // Creates book with an id from array lenght
            const book = new Book(
                null,
                entries['title'] || '',
                entries['author'] || '',
                entries['pages'] || 5,
                !!entries['read']
            );

            this.library.addBook(book);
            this.renderBook(book);
        });
    }


    openBookModal() {
        $overlay.classList.add('overlay--active');
        $modalBook.classList.add('modal-book--active');
    }


    closeBookModal() {
        $overlay.classList.remove('overlay--active');
        $modalBook.classList.remove('modal-book--active');
    }


    renderBook(book) {
        const $h1 = document.createElement('h1');
        $h1.textContent = book.title;
        $booksContainer.appendChild($h1);
    }
}



const main = () => {
    const app = new App();
    app.initialize();
};


main();