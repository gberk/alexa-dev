import logging

from random import randint

from flask import Flask, render_template

from flask_ask import Ask, statement, question, session


app = Flask(__name__)

ask = Ask(app, "/")

logging.getLogger("flask_ask").setLevel(logging.DEBUG)

words = ["banana", "watermelon", "strawberry", "lychee"]


@ask.launch

def launch():
    numFave = randint(0,3)

    msg = render_template('welcome', fave=words[numFave])

    return statement(msg)


if __name__ == '__main__':

    app.run(debug=True)