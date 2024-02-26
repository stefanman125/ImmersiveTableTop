#!/usr/bin/python3
import time
import random
import textwrap
import sys

# ---------------- Globals ------------------

cooldown = 3 # Cooldown between new News Headlines showing up in seconds
length_output_file = 10 # How many lines to have in the output_file at once in number of lines
source_texts_file = open(sys.argv[1], 'r') # Source texts file
current_headlines = [] # Leave this blank
word_wrap_characters = 80 # Amount of characters to wrap each headline
previous_headline_limit = 8 # The previous N headlines that will not be chosen when fetching a new headline 
previous_headlines = [] # List containing previously chosen headlines

# -------------------------------------------

def refresh_output_file(all_headlines, output_file):
    print("Refreshing output file")
    current_headlines = get_random_headline(all_headlines)
    if (len(current_headlines) > length_output_file): # Removes first element in the list in order to remove old headlines and bring in new ones if there are more than X amount of lines
        current_headlines.pop(0)
    output_file.writelines(headline + '\n' for headline in current_headlines)
    output_file.close()
    time.sleep(cooldown) # Cooldown

def get_random_headline(all_headlines):
    while True:
        headline = random.choice(all_headlines)
        if headline not in current_headlines and headline not in previous_headlines: # Checks if headline is not already in the list, or been previously used
            previous_headlines.append(headline)
            if (len(previous_headlines) > previous_headline_limit): # Removes oldest headline if the limit of previously used headlines is exceeded
                previous_headlines.pop(0)
            previous_headlines.append(headline)
            current_headlines.append(textwrap.fill(headline, word_wrap_characters)) # Appends a text-wrapped headline to the list of current headlines
            return current_headlines
        else:
            pass

def main():
    all_headlines = source_texts_file.readlines() # Need to read the file here instead of later, since the read cursor goes to the end of the file after reading for the first time.
    while True:
        output_file = open(sys.argv[2], 'w') # Open Output file for writing (empties it on opening)
        refresh_output_file(all_headlines, output_file)


# Call main
main()
