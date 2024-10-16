#!/usr/bin/python3
import subprocess
import requests
import time
import datetime
from bs4 import BeautifulSoup
import PlayersScoreObjectives.playersscoreobjectives as playersscoreobjectives
import multiprocessing
import logging
from flask import Flask, render_template, request, url_for, flash, redirect
from flask_httpauth import HTTPBasicAuth
from werkzeug.security import generate_password_hash, check_password_hash

# ---------------- Globals ------------------

mode = "" # Gamemode (frosthaven or twilight imperium currently supported)
password = "frost" # Set a password for the VLC web interfaces (required by VLC), and web application
vlc_music_port = 5001 
vlc_video_port = 5002 
vlc_background_port = 5003 
download_status_cooldown = 1 # In seconds
assets_directory = "./Assets" # Relative path
music_type_frost = ["Intermission", "Combat", "Victory", "Boss"]
music_type_ti = ["Combat", "Idle", "Pre-Game"]
video_directory = "/Videos" # Relative path
background_type_frost = ["Outpost", "Boss", "SummerCombat", "WinterCombat"]
song_name_file = "./Assets/Music/current_song.txt" # Relative path
song_time_file = "./Assets/Music/current_song_time.txt" # Path to the file containing the current time of the song and total length of the song currently playing
players_filename = "./PlayersScoreObjectives/Players.txt" # File containing the player names
objectives_filename = "./PlayersScoreObjectives/Objectives.txt" # File containing public objectives
log_filename = "log.txt" # Name of file used for logging
app = Flask(__name__)
auth = HTTPBasicAuth()
users = { "" : generate_password_hash(password) } # Leave username for blank
vlc_processes = {} # Used for storing and killing VLC processes on the fly

# -------------------------------------------

@auth.verify_password
def verify_password(username, password):
    if username in users and check_password_hash(users.get(username), password):
        return username

# Currently only used for TI
@app.route('/change-video/', methods=('GET', 'POST'))
@auth.login_required
def change_video(): 
    global vlc_processes # Used for organizing and killing processes 

    if (request.method == 'POST'):
        new_video_type = request.form['new_video_type']
        vlc_processes["Video"].kill() # Kill old video VLC instance
        time.sleep(2) # Dramatic pause so that the "Signal Loss" image on OBS can be seen
        vlc(password, assets_directory + video_directory + '/' + new_video_type, vlc_video_port, False, "Video")

    return render_template('changevideo.html', video_types=['Peace', 'War'])

@app.route('/change-music/', methods=('GET', 'POST'))
@auth.login_required
def change_music():
    global vlc_processes # Used for organizing and killing processes 

    if (mode == "ti"):
        music_types=music_type_ti
        music_directory = "/Music/TI4"
    elif (mode == "frost"):
        music_types=music_type_frost
        music_directory = "/Music/Frosthaven"

    # When the user submits the form with the new music type
    if (request.method == 'POST'):
        new_music_type = request.form['new_music_type']
        vlc_processes["Music"].kill() # Kill old music VLC instance
        vlc(password, assets_directory + music_directory + '/' + new_music_type, vlc_music_port, False, "Music") # Start new VLC music instance with new music type

    return render_template("changemusic.html", music_types=music_types)

# Currently only used for TI
@app.route('/add-objective/', methods=('GET', 'POST'))
@auth.login_required
def add_objective():
    if (request.method == 'POST'):
        new_objective = request.form['new_objective']
        playersscoreobjectives.add_objective(objectives_filename, new_objective)
    
    return render_template("addobjective.html")

# Currently only used for TI
@app.route('/change-score/', methods=('GET', 'POST'))
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

@app.route('/')
@auth.login_required
def index():
    # Different index pages for different game modes
    if (mode == "ti"):
        index = "index-ti.html"
    elif (mode == "frost"):
        index = "index-frost.html"

    return render_template(index)

def vlc(password, directory, port, repeat, content_type):
    global vlc_processes

    # If the user does not want the content to repeat, it will shuffle all the media in the directory and repeat it once its all been cycled through.
    if (repeat == False):
        repeat = "--random --no-repeat --loop"
    
    p = subprocess.Popen("vlc -I http --http-port {port} {directory} {repeat} --playlist-autostart --http-password {password}".format(port=port,directory=directory,password=password,repeat=repeat).split(), stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT) # Creates process in the background
    vlc_processes[content_type] = p

def update_song_name(password, vlc_music_port, download_status_cooldown, song_name_file, song_time_file):
    while True:
        #time.sleep(7) # Independent cooldown cuz script breaks if called too soon
        time.sleep(download_status_cooldown)
        session = requests.Session()
        session.auth = ('', password)
        response = session.get("http://localhost:{port}/requests/status.xml".format(port=vlc_music_port))
        soup = BeautifulSoup(response.content, "xml")
        try:
            # Update song name
            song_name = soup.find(attrs={"name": "filename"})
            song_name = song_name.text.split('.')[0] # Remove file extension
            with open(song_name_file, 'w') as file: file.write(song_name)
            logging.warning("Updated current_song.txt")

            # Update song time
            song_time = soup.find("time").getText()
            song_length = soup.find("length").getText()
            with open(song_time_file, 'w') as file: file.write(str(datetime.timedelta(seconds=int(song_time)))[2:] + "/" + str(datetime.timedelta(seconds=int(song_length)))[2:])

        except (AttributeError, TypeError):
            logging.error("Can't update current_song.txt and/or current_song_time.txt, nothing playing.")

        except (ConnectionRefusedError, ConnectionError):
            logging.error("Cannot connect to the VLC status.xml endpoint, perhaps due to a music change request.")

def start_ti():
    # Start Music and Background
    print("[*] Starting Music...")
    vlc(password, assets_directory + "/Music/TI4/Pre-Game", vlc_music_port, False, "Music") 
    print("[*] Starting Video...")
    vlc(password, assets_directory + "/Videos" + "/Peace", vlc_video_port, False, "Video")

    # Start update song function on the side
    proc = multiprocessing.Process(target=update_song_name, args=(password, vlc_music_port, download_status_cooldown, song_name_file, song_time_file))
    proc.start()

    # Create Players file
    playersscoreobjectives.create_players_and_score(players_filename)

    # Create Objectives file with the starting objectives
    playersscoreobjectives.create_objectives(objectives_filename)

def start_frost():
    # Start Music and Background
    print("[*] Starting Music on localhost:" + str(vlc_music_port))
    vlc(password, assets_directory + "/Music/Frosthaven" + "/Intermission", vlc_music_port, False, "Music") # Start with the intermission directory at the start of the game
    print("[*] Starting Backgrounds on localhost:" + str(vlc_video_port))
    vlc(password, assets_directory + "/Backgrounds/Frosthaven", vlc_background_port, True, "Background")

    # Start update song function on the side
    proc = multiprocessing.Process(target=update_song_name, args=(password, vlc_music_port, download_status_cooldown, song_name_file, song_time_file))
    proc.start()

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