# NewsReel

Insert peaceful news headlines in the `sourcetexts-peace.txt` file, and conflict news headlines in the `sourcetexts-conflict.txt` delimitted by newlines. These lines will be randomly selected and placed in the `output-peace.txt` and `output-conflict.txt` files respectively, which will be rendered in the peace and conflict scenes. Currently, lines will not be unique. They may randomly be selected again and printed on screen, but never at once.

After populating the `sourcetexts.txt` file, `main.py` will call `startnews.py`. It is NOT RECOMMENDED to run `startnews.py` manually.
