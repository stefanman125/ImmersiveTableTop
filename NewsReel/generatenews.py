#!/usr/bin/python3

import random
import sys

# ---------------- Globals ------------------

delimiter = " /// "

# -------------------------------------------

# Grabs news texts from the source file provided
def get_news_texts(newsFile):
    with open(newsFile, 'r') as f: lines = f.readlines()
    random.shuffle(lines) # Randomize list
    new_text = delimiter
    for line in lines:
        new_text += line.strip() + delimiter
    return new_text