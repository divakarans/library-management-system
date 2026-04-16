import json

def load_books():
    try:
        with open("books.json","r") as file:
            return json.load(file)
    except FileNotFoundError:
        return []
    
def save_books():
    with open("books.json", "w") as file:
        json.dump(books, file, indent=4)

def display_book(book):
    print("-------------------------")
    print("Title  :", book['Title'])
    print("Author :", book['Author'])
    print("Year   :", book['Year'])
    print("ISBN   :", book['ISBN'])
    print("-------------------------")

books=load_books()

def add_books():
    Title = input("Enter the Title: ")
    Author = input("Enter the Author: ")
    Year = input("Enter the Year: ")
    Isbn_num=int(input('Enter The ISBN Id: '))
    book={'Title':Title,'Author':Author,'Year':Year,'ISBN':Isbn_num}
    books.append(book)
    save_books()
    return 'Book added successfully'

def list_books():
    if not books:
        return "library empty"
    else:
        for book in books:
            display_book(book)

def search_by_book():
    Title=input("Enter the Title: ").lower()
    result=[]
    for book in books:
        if (Title in book['Title'].lower()):
            result.append(book)
    if not result:
        return "No Book Found"
    else:
        for book in result:
            display_book(book)
    
def search_by_author():
    Author=input("Enter the Name: ").lower()
    final=[]
    for name in books:
        if (Author in name['Author'].lower()):
            final.append(name)
    for book in final:
        display_book(book)

def remove_book():
    if not books:
        return "No Book Exist"
    isbn=int(input("Enter ISBN of book to remove: "))
    for num in books:
        if isbn==num['ISBN']:
            books.remove(num)
            save_books()
            return "Book Successfully Removed: " f"{num['Title']}"
    return "Not Found"
    
while True:
    print("-------------------------")
    print("Welcome to Book Archive")
    print("-------------------------")
    print("1. Add Book")
    print("2. List All Books")
    print("3. Search by Book")
    print("4. Search by Author")
    print("5. Remove Book")
    print("6. Exit\n")
    choice=int(input("Select an Option: "))

    if choice==1:
        print(add_books())
    elif choice==2:
        list_books()
    elif choice==3:
        search_by_book()
    elif choice==4:
        search_by_author()
    elif choice==5:
        print(remove_book())
    elif choice==6:
        print("Good Bye buddy")
        break