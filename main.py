#!/usr/bin/python3
import subprocess
import requests
import time
import datetime
from bs4 import BeautifulSoup
import PlayersScoreObjectives.playersscoreobjectives as playersscoreobjectives
import multiprocessing
import logging

# ---------------- Globals ------------------

password = "frost" # Set a password for the VLC web interfaces (required by VLC)
vlc_music_port = "5001" # VLC web interface port
vlc_video_port = "5002" # VLC web interface port
vlc_background_port = "5003" # VLC web interface port
download_status_cooldown = 1 # In seconds
music_directory = "./Assets/Music" # Relative path
video_directory = "./Assets/Videos" # Relative path
background_directory = "./Assets/Backgrounds" # Relative Path
song_name_file = "./Assets/Music/current_song.txt" # Relative path
song_time_file = "./Assets/Music/current_song_time.txt" # Path to the file containing the current time of the song and total length of the song currently playing
players_filename = "./PlayersScoreObjectives/Players.txt" # File containing the player names
objectives_filename = "./PlayersScoreObjectives/Objectives.txt" # File containing public objectives
log_filename = "log.txt" # Name of file used for logging

# -------------------------------------------

def vlc(password, directory, port):
    #subprocess.Popen("vlc -I http --http-port {port} --playlist-tree {directory} --loop --playlist-autostart --http-password {password}".format(port=port,directory=directory,password=password).split(), stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT) # Creates process in the background
    subprocess.Popen("vlc -I http --http-port {port} --playlist-tree {directory} --loop --playlist-autostart --http-password {password}".format(port=port,directory=directory,password=password).split(), stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT) # Creates process in the background

def update_song_name(password, vlc_music_port, download_status_cooldown, song_name_file, song_time_file):
    while True:
        #time.sleep(7) # Independent cooldown cuz script breaks if called too soon
        time.sleep(download_status_cooldown)
        session = requests.Session()
        session.auth = ('', password)
        response = session.get("http://localhost:{port}/requests/status.xml".format(port=vlc_music_port))
        soup = BeautifulSoup(response.content, 'lxml')
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

def menu(proc):
    # Print Menu
    print("""
    ------------ ImmersiveTableTop ------------ 

    1) Change a Players Score
    2) Add a Public Objective
    3) Remove a Public Objective
    4) Play Next Song in Queue (todo)
    0) Exit

    -------------------------------------------
    """)

    option = input("Enter an option: ")

    # If 0, exit program
    if (option == '0' or option.lower() == "exit"):
        are_you_sure = input("Are you sure you want to exit? y/n: ")
        if (are_you_sure == 'y'):
            print("[*] Exiting...")
            proc.terminate()
            exit(0)
        else:
            return None

    elif (option == '1' or option.lower() == "change"):
        playersscoreobjectives.change_score(players_filename)
    
    elif (option == '2' or option.lower() == "add"):
        playersscoreobjectives.add_objective(objectives_filename)

    elif (option == '3' or option.lower() == "remove"):
        playersscoreobjectives.remove_objective(objectives_filename)

def main():
    # Start logging
    logging.basicConfig(filename=log_filename, filemode='w', format='[%(asctime)s] [%(levelname)s] %(message)s')

    # Start Music and Video
    print("[*] Starting Music...")
    vlc(password, music_directory, vlc_music_port) # Sometimes doesn't start on its own because of directory structure (inherent VLC limitation it seems)
    print("[*] Starting Video...")
    vlc(password, video_directory, vlc_video_port)
    print("[*] Starting Backgrounds...")
    vlc(password, background_directory, vlc_background_port)

    # Create Players file
    playersscoreobjectives.create_players_and_score(players_filename)

    # Create Objectives file with the starting objectives
    playersscoreobjectives.create_objectives(objectives_filename)

    # Start update song function on the side
    proc = multiprocessing.Process(target=update_song_name, args=(password, vlc_music_port, download_status_cooldown, song_name_file, song_time_file))
    proc.start()

    # Print menu containing realtime controls
    while True: 
        menu(proc)

main()