#!/usr/bin/python3
import subprocess
import requests
import time
import datetime
from bs4 import BeautifulSoup
import PlayersScoreObjectives.playersscoreobjectives as playersscoreobjectives
import NewsReel.generatenews as generatenews
import multiprocessing
import logging
from flask import Flask, render_template, request, url_for, flash, redirect
from flask_httpauth import HTTPBasicAuth
from werkzeug.security import generate_password_hash, check_password_hash
import os
import random
import json

# ---------------- Globals ------------------

mode = "" # Gamemode (frosthaven or twilight imperium currently supported)
password = "frost" # Set a password for the web application admin panel
download_status_cooldown = 1 # In seconds
assets_directory = "./Assets" # Relative path
music_type_frost = ["Intermission", "Combat", "Victory", "Boss"]
music_type_ti = ["Combat", "Idle", "Pre-Game"]
video_directory = "/Videos" # Relative path
background_type_frost = ["Outpost", "Boss", "SummerCombat", "WinterCombat"]
players_filename = "./PlayersScoreObjectives/Players.txt" # File containing the player names
objectives_filename = "./PlayersScoreObjectives/Objectives.txt" # File containing public objectives
log_filename = "log.txt" # Name of file used for logging
app = Flask(__name__)
auth = HTTPBasicAuth()
users = { "" : generate_password_hash(password) } # Leave username for blank

# -------------------------------------------

@auth.verify_password
def verify_password(username, password):
    if username in users and check_password_hash(users.get(username), password):
        return username

@app.route('/admin/music-selection/', methods=['GET'], endpoint='music_selection')
@auth.login_required
def music_selection():
    pass

@app.route('/admin/video-selection/', methods=['GET'], endpoint='video_selection')
@auth.login_required
def music_selection():
    pass

# Currently only used for TI
@app.route('/admin/change-video/', methods=('GET', 'POST'))
@auth.login_required
def change_video(): 

    if (request.method == 'POST'):
        new_video_type = request.form['new_video_type']
        time.sleep(2) # Dramatic pause so that the "Signal Loss" image on OBS can be seen
        print("Changed Video")

    return render_template('changevideo.html', video_types=['Peace', 'War'])

@app.route('/admin/change-music/', methods=('GET', 'POST'))
@auth.login_required
def change_music():
    if (mode == "ti"):
        music_types=music_type_ti
        music_directory = "/Music/TI4"
    elif (mode == "frost"):
        music_types=music_type_frost
        music_directory = "/Music/Frosthaven"

    # When the user submits the form with the new music type
    if (request.method == 'POST'):
        new_music_type = request.form['new_music_type']
        print("Changed Music type")

    return render_template("changemusic.html", music_types=music_types)

# Currently only used for TI
@app.route('/admin/add-objective/', methods=('GET', 'POST'))
@auth.login_required
def add_objective():
    if (request.method == 'POST'):
        new_objective = request.form['new_objective']
        playersscoreobjectives.add_objective(objectives_filename, new_objective)
    
    return render_template("addobjective.html")

# Currently only used for TI
@app.route('/admin/change-score/', methods=('GET', 'POST'))
@auth.login_required
def change_score():
    players = playersscoreobjectives.get_player_data(players_filename)
    player_names = [player[0] for player in players]

    # When a user submits the new score in the /change-score/ page, do this:
    if request.method == 'POST':
        player_name = request.form['player_name']
        new_score = request.form['new_score']
        playersscoreobjectives.change_score(players_filename, player_name, new_score)

    return render_template("changescore.html", player_names=player_names)

@app.route('/admin/', methods=['GET'])
@auth.login_required
def admin_panel():
    # Different admin_panel pages for different game modes
    if (mode == "ti"):
        admin_panel = "admin-panel-ti.html"
    elif (mode == "frost"):
        admin_panel = "admin-panel-frost.html"

    return render_template(admin_panel)

# Returns a list of music files in a given directory, which is then passed into the respective HTML pages through jinja templates.
def get_music(music_type):
    try:
        filenames = os.listdir("static/Music/TI4/{music_type}".format(music_type=music_type))
        return ["Music/TI4/{music_type}/{file}".format(music_type=music_type, file=f) for f in filenames if os.path.isfile(os.path.join("static/Music/TI4/{music_type}".format(music_type=music_type), f))]
    except Exception as e:
        print("[*] Error Excepted: {e}".format(e=e))

def get_videos(video_type):
    try:
        filenames = os.listdir("static/Videos/TI4/{video_type}".format(video_type=video_type))
        return ["Videos/TI4/{video_type}/{file}".format(video_type=video_type, file=f) for f in filenames if os.path.isfile(os.path.join("static/Videos/TI4/{video_type}".format(video_type=video_type), f))]
    except Exception as e:
        print("[*] Error Excepted: {e}".format(e=e))
    
@app.route('/ti-peace', methods=['GET'])
def ti_peace():
    headlines = generatenews.get_news_texts('NewsReel/sourcetexts-peace.txt')
    music = get_music("Peace")
    videos = get_videos("Peace")
    print(videos)
    return render_template("ti-peace.html", headlines=headlines, music=music, videos=videos)

@app.route('/players', methods=['GET'])
def ti_players():
    return render_template("players.html")

@app.route('/', methods=['GET'])
def index():
    match mode:
        case "ti":
            setup_dir = os.path.join(app.static_folder, 'Music/TI4/Pre-Game')
            audio_files = [f for f in os.listdir(setup_dir) if f.endswith('.mp3')]
            setup_song = random.choice(audio_files)
            setup_song = 'Music/TI4/Pre-Game/'+setup_song
            return render_template("ti-setup.html", setup_song=setup_song)
        case "frost":
            pass

def start_ti():
    # Start Music and Background
    print("[*] Starting Music...")
    print("[*] Starting Video...")

    # Create Players file
    # playersscoreobjectives.create_players_and_score(players_filename)

    # Create Objectives file with the starting objectives
    playersscoreobjectives.create_objectives(objectives_filename)

def start_frost():
    # Start Music and Background
    pass

def main():
    # Start logging
    logging.basicConfig(filename=log_filename, filemode='w', format='[%(asctime)s] [%(levelname)s] %(message)s')

    # Global variable "mode" defines what mode to start the program in, frost or TI
    global mode

    # Ask the user for the mode
    while (True):
        mode = input('Enter the mode ("frost" for Frosthaven, "ti" for Twilight Imperium): ')
        if (mode != "frost" and mode != "ti"):
            print("Please enter a valid mode.")
        else:
            break
    print("Starting ImmsersiveTableTop in '{mode}' mode...".format(mode=mode))

    if (mode == "frost"):
        start_frost()
    elif (mode == "ti"):
        start_ti()

    print("[*] Starting web app on localhost:5000")
    app.run(host="0.0.0.0", debug=False) 

main()