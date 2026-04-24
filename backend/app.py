from flask import Flask,jsonify,request
import mysql.connector
from flask_cors import CORS

app=Flask(__name__)
CORS(app)

conn=mysql.connector.connect(host='localhost',password='Divakarandk99@',user='root',database='book_archive')
cursor=conn.cursor(dictionary=True)

@app.route("/books", methods=["GET"])
def get_books():
    cursor.execute('select * from book')
    books=cursor.fetchall()
    return jsonify(books)

# ADD book
@app.route("/books", methods=["POST"])
def add_book():
    data = request.json

    query="""Insert into book(title,author,year,isbn,image_url) values (%s,%s,%s,%s,%s)"""

    cursor.execute(query,(
        data['Title'],
        data['Author'],
        data['Year'],
        data['ISBN'],
        data['ImageURL']
    ))

    conn.commit()

    return jsonify({"message": "Book added"})

# DELETE book
@app.route("/books/<id>", methods=["DELETE"])
def delete_book(id):
    cursor.execute("delete from book where id = %s",(id,))
    conn.commit()
    return jsonify({"message": "Book deleted"})



if __name__ == "__main__":
    app.run(debug=True)