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
        this.books = this.getBooksFromLocalStorage();
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
        this.setBooksToLocalStorage();
    }


    removeBookById(bookId) {
        this.books = this.books.filter(book => book.id != bookId);

        this.assignLocalBooksIds();
        this.setBooksToLocalStorage();
    }


    toggleReadById(bookId) {
        this.books = this.books.map(book => {
            if (book.id == bookId) book.isRead = !book.isRead;
            return book;
        });

        this.setBooksToLocalStorage();
    }


    // It is used to assign an id to local stored books
    // It uses the index of the book in the array
    assignLocalBooksIds() {
        this.books = this.books.map((book, index) => {
            return { ...book, id: index };
        });
    }


    // Local Storage Methods
    getBooksFromLocalStorage() {
        return JSON.parse(localStorage.getItem('books'));
    }

    setBooksToLocalStorage() {
        localStorage.setItem('books', JSON.stringify(this.books));
    }
}


class App {
    constructor() {
        this.library = new Library();

        this.isModalBookActive = false;
    }


    // Creates event listeners for dom elements
    initialize() {
        document.addEventListener('keydown', (e) => {
            if (!this.isModalBookActive) return;

            if (e.key === 'Escape') {
                this.closeBookModal();
            }
        });

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

            $modalBookForm.reset();

            this.library.addBook(book);
            this.renderBooks();

            this.closeBookModal();
        });

        this.renderBooks();
    }


    openBookModal() {
        $overlay.classList.add('overlay--active');
        $modalBook.classList.add('modal-book--active');
    }


    closeBookModal() {
        $overlay.classList.remove('overlay--active');
        $modalBook.classList.remove('modal-book--active');
    }


    renderBooks() {
        $booksContainer.innerHTML = null; // Clears container

        this.library.getBooks().map(book => {
            this.renderBook(book);
        });
    }


    renderBook(book) {
        const $bookCard = document.createElement('div');
        $bookCard.classList.add('book-card');

        const $bookTitle = document.createElement('h3');
        $bookTitle.classList.add('book-title');
        $bookTitle.textContent = book.title;
        $bookCard.appendChild($bookTitle);

        const $bookAuthor = document.createElement('h4');
        $bookAuthor.classList.add('book-author');
        $bookAuthor.textContent = book.author;
        $bookCard.appendChild($bookAuthor);

        const $bookPages = document.createElement('h4');
        $bookPages.classList.add('book-pages');
        $bookPages.textContent = book.pages;
        $bookCard.appendChild($bookPages);

        const $toggleReadButton = document.createElement('button');
        $toggleReadButton.classList.add('button', 'button--toggle-read');
        $toggleReadButton.dataset.bookId = book.id;
        $toggleReadButton.textContent = book.isRead ? 'Read' : 'Not Read';
        $toggleReadButton.addEventListener('click', (e) => this.handleToggleReadClick(e));
        $bookCard.appendChild($toggleReadButton);

        const $removeBookButton = document.createElement('button');
        $removeBookButton.classList.add('button', 'button--remove');
        $removeBookButton.dataset.bookId = book.id;
        $removeBookButton.textContent = 'Remove';
        $removeBookButton.addEventListener('click', (e) => this.handleRemoveClick(e));
        $bookCard.appendChild($removeBookButton);


        $booksContainer.appendChild($bookCard);
    }


    handleToggleReadClick(e) {
        const bookId = e.target.dataset.bookId;

        if (bookId) {
            this.library.toggleReadById(bookId);
            this.renderBooks();
        }
    }


    handleRemoveClick(e) {
        const bookId = e.target.dataset.bookId;

        if (bookId) {
            this.library.removeBookById(bookId);
            this.renderBooks();
        }
    }
}



const main = () => {
    const app = new App();
    app.initialize();
};


main();
