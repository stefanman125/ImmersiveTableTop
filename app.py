#!/usr/bin/python3
import subprocess
import requests
import time
import datetime
import logging
from flask import Flask, render_template, request, url_for, flash, redirect, jsonify
from flask_httpauth import HTTPBasicAuth
from werkzeug.security import generate_password_hash, check_password_hash
import os
import random
import json

# ---------------- Globals ------------------

# App Configuration
password = "frost" # Set a password for the web application admin panel
app = Flask(__name__)
auth = HTTPBasicAuth()
users = { "" : generate_password_hash(password) } # Leave username for blank

# Frost
frost_music_type = ["Intermission", "Combat", "Victory", "Boss"]
frost_background_type = ["Outpost", "Boss", "SummerCombat", "WinterCombat"]

# TI4
ti_music_type = ["Combat", "Idle", "Pre-Game"]
ti_players_filepath = "./static/data/TI4/players.json" # File containing the player names
ti_objectives_filepath = "./static/data/TI4/objectives.json" # File containing public objectives
ti_agendas_filepath = "./static/data/TI4/agendas.json"
ti_music_filepath = "./static/data/TI4/music.json"
ti_gamedata_filepath = "./static/data/TI4/gamedata.json"

# Logging
log_filepath = "./static/data/log.txt" # Name of file used for logging
GAME_LEVEL = 25 # Logging verbosity level for the custom logging level only used for logging game actions performed in the admin panel
logging.addLevelName(GAME_LEVEL, "GAME")
logger = logging.getLogger(__name__)

# -------------------------------------------

@auth.verify_password
def verify_password(username, password):
    if username in users and check_password_hash(users.get(username), password):
        return username

def get_news_texts(newsFile):
    delimiter = " /// "
    with open(newsFile, 'r') as f: lines = f.readlines()
    random.shuffle(lines) # Randomize list
    new_text = delimiter
    for line in lines:
        new_text += line.strip() + delimiter
    return new_text

@app.route('/ti/admin/music', methods=['GET'])
@auth.login_required
def change_music():
    return render_template("TI4/music.html")

@app.route('/ti/admin/music', methods=['POST'])
def change_currently_playing():
    try:
        # Parse the JSON data from the request
        data = request.get_json()

        # Check if the data contains the expected structure for updating the current music time
        if data and 'currentlyPlaying' in data:
            new_currently_playing = data['currentlyPlaying']  # Extract the song info (songId, currentTime, maxTime)

            # Read the existing music.json file
            with open(ti_music_filepath, 'r') as file:
                music_data = json.load(file)

            # Update the currentlyPlaying section with the new values
            music_data['currentlyPlaying']['songId'] = new_currently_playing.get('songId')
            music_data['currentlyPlaying']['currentTime'] = new_currently_playing.get('currentTime')
            music_data['currentlyPlaying']['maxTime'] = new_currently_playing.get('maxTime')

            # Write the updated data back to the music.json file
            with open(ti_music_filepath, 'w') as file:
                json.dump(music_data, file, indent=4)

            return jsonify({'Status': "currentlyPlaying successfully changed."}), 200

        # Check if the data only has the override field, in which case only reset the override field
        if data and 'override' in data:
            new_override = data["override"]

            # Read the existing music.json file
            with open(ti_music_filepath, 'r') as file:
                music_data = json.load(file)

            # Update the override 
            music_data['override'] = new_override

            # Write the updated data back to the music.json file
            with open(ti_music_filepath, 'w') as file:
                json.dump(music_data, file, indent=4)

            return jsonify({'Status': "override successfully changed."}), 200

        # Check if the data has the rebuild field, which rebuilds the music json database
        if data and 'rebuild' in data:
            build_music_json("TI4")

            return jsonify({'Success': "Music JSON rebuild request successfully received."}), 200

    except Exception as e:
        print(e)
        return jsonify({"error": "Invalid data"}), 400

@app.route('/ti/admin', methods=['GET'])
@app.route('/ti/admin/', methods=['GET'])
@auth.login_required
def admin_panel_ti():
    return render_template("TI4/admin.html")

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
    
@app.route('/ti/admin/gamedata', methods=['GET', 'POST'])
@auth.login_required
def ti_gamedata():
    if (request.method == 'GET'):
        return render_template("TI4/gamedata.html")
    elif (request.method == 'POST'):
        try:
            data = request.get_json()
            with open(ti_gamedata_filepath, 'w') as gamedata_file:
                json.dump(data, gamedata_file, indent=4)
            return jsonify({"Success": "New gamedata file successfully saved."}), 200
        except Exception as e:
            return jsonify({"Error", "Could not save gamedata file."})

@app.route('/ti/', methods=['GET'])
@app.route('/ti', methods=['GET'])
def ti():
    try:
        peace_headlines = get_news_texts('static/data/TI4/sourcetexts-peace.txt')
        war_headlines = get_news_texts('static/data/TI4/sourcetexts-war.txt')
        music = get_music("Peace")
        peace_videos = get_videos("Peace")
        war_videos = get_videos("War")
        return render_template("TI4/ti.html", 
            peaceHeadlines=peace_headlines, 
            warHeadlines=war_headlines, 
            music=music, 
            peaceVideos=peace_videos,
            warVideos=war_videos
        )
    except Exception as e:
        return jsonify({"Error": "{e}".format(e=e)})

@app.route('/ti/admin/players', methods=['GET'])
@auth.login_required
def ti_players():
    return render_template("TI4/players.html")

# When the players in the players management admin panel are updated
@app.route('/ti/admin/players', methods=['POST'])
@auth.login_required
def ti_update_players():
    try:
        new_data = request.get_json()
        with open(ti_players_filepath, 'w') as file:
            json.dump(new_data, file, indent=4)
        return jsonify({"message": "New Player data saved successfully!"}), 200
    except Exception as e:
        print("Error when updating players file")
        print(e)

@app.route('/ti/admin/agendas', methods=['POST'])
@auth.login_required
def ti_agendas():
    try:
        new_data = request.get_json()
        with open(ti_agendas_filepath, 'w') as file:
            json.dump(new_data, file, indent=4)
        return jsonify({"message": "New Agenda data saved successfully!"}), 200
    except Exception as e:
        print("Error when updating Agendas file")
        print(e)

@app.route('/ti/admin/objectives', methods=['GET'])
@auth.login_required
def ti_objectives():
    return render_template("TI4/objectives.html")

# When the players in the players management admin panel are updated
@app.route('/ti/admin/objectives', methods=['POST'])
@auth.login_required
def ti_update_objectives():
    try:
        new_data = request.get_json()
        with open(ti_objectives_filepath, 'w') as file:
            json.dump(new_data, file, indent=4)
        return jsonify({"message": "New Objective data saved successfully!"}), 200
    except Exception as e:
        print("Error when updating objectives file")
        print(e)

@app.route('/ti/admin/log', methods=['GET'])
@auth.login_required
def view_log():
    return render_template("TI4/view-log.html") # Should always be able to the view the logs, regardless of if a game is going on or not.

@app.route('/ti/admin/log', methods=['POST'])
@auth.login_required
def log_message():
    data = request.json
    message = data.get('message', '')
    print(message)
    message += " [{local_ip}]".format(local_ip=request.remote_addr)
    logger.game(message)

    return jsonify({"status": "success"}), 200

def game_logging_level(self, message, *args, **kwargs):
    if self.isEnabledFor(GAME_LEVEL):
        self._log(GAME_LEVEL, message, args, **kwargs)

def build_music_json(game):
    audio_dir = os.path.join(app.static_folder, 'Music/{game}/'.format(game=game))
    audio_files = []
    # Walk through the music directory and subdirectories to build a list of relative music file paths
    for root, dirs, files in os.walk(audio_dir):
        for file in files:
            # Build the relative path and prepend "/static/Music/TI4/"
            full_path = "/static/Music/{game}/{relpath}".format(game=game, relpath=os.path.relpath(os.path.join(root, file), audio_dir))
            audio_files.append(full_path)

    # Music.json skeleton
    music_data = {
        "override": "",
        "currentlyPlaying": {
            "songId": "",
            "currentTime": 0,
            "maxTime": 0
        },
        "available": {}
    } 

    # If the game played is TI4, assign categories to the songs. This should be done after audio_files is populated
    if (game == "TI4"):
        for song in audio_files:
            if ("/TI4/Peace" in song): category = "Peace"
            elif ("/TI4/War" in song): category = "War"
            elif ("/TI4/Pre-Game" in song): category = "Pre-Game"
            music_data["available"][str(audio_files.index(song)+1)] = {
                "song": song,
                "category": category
            }

    # Save the JSON data to a file
    with open(os.path.join(app.static_folder, "data/{game}/music.json".format(game=game)), "w") as json_file:
        json.dump(music_data, json_file, indent=4)

@app.route('/ti/setup', methods=['GET'])
def ti_setup():
    return render_template("TI4/setup.html")

@app.route('/ti/admin/reset', methods=['POST'])
@auth.login_required
def reset_game():
    try:
        data = request.json
        if (data.get("resetGame", "") == True):
            # Clear Objectives
            with open(ti_objectives_filepath, 'w') as file:
                json.dump([], file)

            # Clear Players
            with open(ti_players_filepath, 'w') as file:
                json.dump([], file)

            # Change gamestate back to Peace
            with open(ti_gamedata_filepath, 'w') as file:
                json.dump({"gameState":"Peace"}, file, indent=4)

            return jsonify({"Success": "Game has been successfully reset."}), 200
        else:
            raise Exception("Not enough values provided.")
    except Exception as e:
        return jsonify({"Error": "{e}".format(e=e)}), 400

@app.route('/', methods=['GET'])
def index():
    return render_template("index.html")

def main():
    # Build TI music json
    build_music_json("TI4")

    # Start logging
    global logger  # Declare the logger as global here
    logging.Logger.game = game_logging_level
    
    # Set up logging configuration
    logger = logging.getLogger(__name__)
    logger.setLevel(logging.DEBUG)  # Set the desired logging level (DEBUG, INFO, etc.)
    
    # Create a file handler to log to a specific file
    file_handler = logging.FileHandler(log_filepath)
    file_handler.setLevel(logging.DEBUG)  # You can set the level for the file handler here

    # Create a logging format
    formatter = logging.Formatter('[%(asctime)s] [%(levelname)s] %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
    file_handler.setFormatter(formatter)

    # Add the file handler to the logger
    logger.addHandler(file_handler)

    # Uncomment the line below to start in development mode
    app.run(host="0.0.0.0", debug=False) 

main()