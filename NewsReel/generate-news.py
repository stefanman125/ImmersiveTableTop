#!/usr/bin/python3

import random
import sys

# ---------------- Globals ------------------

delimiter = " /// "
with open(sys.argv[1], 'r') as f: lines = f.readlines()
output_file = open(sys.argv[2], 'w') # Output texts file

# -------------------------------------------

def main():
    random.shuffle(lines) # Randomize list
    new_text = delimiter
    for line in lines:
        new_text += line.strip() + delimiter
    output_file.write(new_text)
    output_file.close()

main()
