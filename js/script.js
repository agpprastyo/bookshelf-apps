const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";

const searchForm = document.getElementById("searchBook");

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  searchBook();
});

function generateId() {
  return +new Date();
}

const findBook = (bookId) => {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
};

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
  const {
    id,
    title,
    author,
    year,
    isCompleted
  } = bookObject;

  const textTitle = document.createElement("h2");
  textTitle.innerText = title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = author;

  const textYear = document.createElement("p");
  textYear.innerText = year;

  const textContainer = document.createElement("div");
  textContainer.append(textTitle, textAuthor, year);

  const container = document.createElement("div");
  container.classList.add("book_item");
  container.append(textContainer);
  container.setAttribute("id", `book-${id}`);

  if (isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("btn-undo");
    undoButton.innerHTML = `<i class='bx bx-undo'></i>`;
    undoButton.addEventListener("click", function () {
      undoFromHasRead(id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("btn-delete");
    trashButton.innerHTML = `<i class='bx bx-trash'></i>`;
    trashButton.addEventListener("click", function () {
      removeFromHasRead(id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("btn-done");
    checkButton.innerHTML = `<i class='bx bx-check'></i>`;
    checkButton.addEventListener("click", function () {
      addBookHasRead(id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("btn-delete");
    trashButton.innerHTML = `<i class='bx bx-trash'></i>`;
    trashButton.addEventListener("click", function () {
      removeFromHasRead(id);
    });

    container.append(checkButton, trashButton);
  }

  return container;
}

function addBook() {
  const textTitle = document.getElementById("inputBookTitle").value;
  const textAuthor = document.getElementById("inputBookAuthor").value;
  const textYear = document.getElementById("inputBookYear").value;
  const finishedBookCheck = document.getElementById("inputBookIsComplete");
  const generatedID = generateId();
  let bookStatus;

  if (finishedBookCheck.checked) {
    bookStatus = true;
  } else {
    bookStatus = false;
  }

  const bookObject = generateBookObject(generatedID, textTitle, textAuthor, textYear, bookStatus);

  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();

  inputBookTitle.value = '';
  inputBookAuthor.value = '';
  inputBookYear.value = '2022';
  inputBookIsComplete.checked = false;


}

function addBookHasRead(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeFromHasRead(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoFromHasRead(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function searchBook() {
  const searchInput = document.getElementById("searchBookTitle").value.toLowerCase();
  const bookItems = document.getElementsByClassName("book_item");

  for (let i = 0; i < bookItems.length; i++) {
    const bookTitle = bookItems[i].querySelector("h2");
    if (bookTitle.textContent.toLowerCase().includes(searchInput)) {
      bookItems[i].classList.remove("hidden");
    } else {
      bookItems[i].classList.add("hidden");
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  const customAlert = document.createElement("div");
  customAlert.classList.add("alert");
  customAlert.innerText = "Data Berhasil Diperbarui!";

  document.body.insertBefore(customAlert, document.body.children[0]);
  setTimeout(() => {
    customAlert.remove();
  }, 3000);
});

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById("incompleteBookshelfList");
  const listCompleted = document.getElementById("completeBookshelfList");

  // clearing list item
  uncompletedBookList.innerHTML = "";
  listCompleted.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isCompleted) {
      listCompleted.append(bookElement);
    } else {
      uncompletedBookList.append(bookElement);
    }
  }
});