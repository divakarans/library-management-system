from flask import Flask,jsonify,request
import mysql.connector
from flask_cors import CORS

app=Flask(__name__)
CORS(app)

conn=mysql.connector.connect(host='localhost',password='Divakarandk99@',user='root',database='book_archive')
cursor=conn.cursor(dictionary=True)

@app.route("/books", methods=["GET"])
def get_books():
    user_id = request.args.get("user_id")

    print("Received user_id:", user_id)

    query = "SELECT * FROM book WHERE user_id = %s"

    cursor.execute(query, (user_id,))

    books = cursor.fetchall()

    return jsonify(books)

# ADD book
@app.route("/books", methods=["POST"])
def add_book():
    data = request.json

    # Check duplicate
    cursor.execute(
        "SELECT * FROM book WHERE isbn=%s",
        (data['ISBN'],)
    )

    existing_book = cursor.fetchone()

    if existing_book:
        return jsonify({"message": "Book already exists"}), 400

    query="""Insert into book(title,author,year,isbn,image_url, user_id) values (%s,%s,%s,%s,%s,%s)"""

    cursor.execute(query,(
        data['Title'],
        data['Author'],
        data['Year'],
        data['ISBN'],
        data['ImageURL'],
        data['user_id']
    ))

    conn.commit()

    return jsonify({"message": "Book added"})

@app.route("/books/<id>", methods=["PUT"])
def update_book(id):
    data = request.json

    query = """
    UPDATE book
    SET title=%s, author=%s, year=%s, isbn=%s, image_url=%s
    WHERE id=%s
    """

    cursor.execute(query, (
        data['Title'],
        data['Author'],
        data['Year'],
        data['ISBN'],
        data['ImageURL'],
        id
    ))

    conn.commit()

    return jsonify({"message": "Book updated"})

# DELETE book
@app.route("/books/<id>", methods=["DELETE"])
def delete_book(id):
    cursor.execute("delete from book where id = %s",(id,))
    conn.commit()
    return jsonify({"message": "Book deleted"})



if __name__ == "__main__":
    app.run(debug=True)