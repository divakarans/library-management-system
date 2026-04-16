from flask import Flask,jsonify,request
from simple_salesforce import Salesforce
from flask_cors import CORS

app=Flask(__name__)
CORS(app)

sf=Salesforce(username="divasundar99.fa433fd94ec3@agentforce.com",password="Divakarandk99@",security_token="s6sKcTTJWaZnCw35556S2uidS")

@app.route("/books", methods=["GET"])
def get_books():
    query = sf.query(
        "SELECT Id, Title__c, Author__c, Year__c, ISBN__c FROM Book__c"
    )

    books = []
    for r in query['records']:
        books.append({
            "Id": r.get("Id"),
            "Title": r.get("Title__c") or "",
            "Author": r.get("Author__c") or "",
            "Year": r.get("Year__c") or "",
            "ISBN": r.get("ISBN__c") or ""
        })

    return jsonify(books)

# ADD book
@app.route("/books", methods=["POST"])
def add_book():
    data = request.json

    sf.Book__c.create({
        "Title__c": data["Title"],
        "Author__c": data["Author"],
        "Year__c": data["Year"],
        "ISBN__c": data["ISBN"]
    })

    return jsonify({"message": "Book added"})

# DELETE book
@app.route("/books/<id>", methods=["DELETE"])
def delete_book(id):
    sf.Book__c.delete(id)
    return jsonify({"message": "Book deleted"})



if __name__ == "__main__":
    app.run(debug=True)