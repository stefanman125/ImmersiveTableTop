#!/usr/bin/python3
from operator import itemgetter

# ---------------- Globals ------------------

space = 2 # Space between the player name and score in whitespaces

# -------------------------------------------

def create_players_and_score(players_filename): # Prompts the user to enter player names
    print("[*] Creating a players file...")
    new_players_file = input("Would you like to create a new players file? y/n (Say 'n' if this application crashed for some reason, so you don't have to re-enter player names and set scores): ")
    if (new_players_file == 'n'): # Exits function if user does not want to recreate the players file
        print("[*] Skipping players file...")
        return None
    players_file = open(players_filename, 'w')
    players = []
    print("Enter player names! Type out a players real name (or alias) and hit enter. Do this until all the players have been entered, then type 'done' and hit enter once more.")
    while True:
        player = input("Player "+str(len(players)+1)+": ")
        if player != "done": players.append([player, '0'])
        else: break
    players_file.writelines(player[0] + ' '*(get_longest_name(players) + space - len(player[0])) + str(player[1]) + '\n' for player in players)
    players_file.close()
    print("[*] New players file created")

def change_score(players_filename, selected_player, new_score):
    players_file = open(players_filename, 'r+')
    players = [player.strip().split() for player in players_file.readlines()] # Splits players from the formatted file to a dictionary
    for player in players:
        if (player[0] == selected_player):
            player[1] = new_score
    players = sorted(players, key=lambda x: x[1], reverse=True)
    players_file.seek(0) # Place file seeker at the beginning of the file to overwrite old score data
    players_file.writelines(player[0] + ' '*(get_longest_name(players) + space - len(player[0])) + str(player[1]) + '\n' for player in players)
    players_file.close()
    print("[*] Successfully changed score")

def get_player_data(players_filename):
    players_file = open(players_filename, 'r+')
    players = [player.strip().split() for player in players_file.readlines()] # Splits players from the formatted file to a dictionary
    players_file.close()
    return players

def get_longest_name(players): # Takes list of player names and their scores
    longest = 0
    for player in players:
        if len(player[0]) > longest:
            longest = len(player[0])
    return longest

def create_objectives(objectives_filename):
    print("[*] Creating an objectives file...")
    new_file = input("Would you like to create a new Objectives file? y/n (Say 'n' if this application crashed for some reason, so you don't have to re-enter all the public objectives): ")
    if (new_file == 'n'): # Exits function if user does not want to recreate the players file
        print("[*] Skipping Objectives file...")
        return None
    objectives_file = open(objectives_filename, 'w')
    objectives = []
    print("Enter the two starting public objectives! Type out an Objective name name and hit enter.")
    for i in range(2):
        objective = input("Objective #" + str(i+1) + ": ")
        objectives.append(objective)
    objectives_file.writelines(objective + '\n' for objective in objectives)
    objectives_file.close()
    print("[*] New Objectives file created")

def add_objective(objectives_filename, new_objective):
    objectives_file = open(objectives_filename, 'r+')
    objectives = [objective.strip() for objective in open(objectives_filename, 'r+')] 
    objectives.append(new_objective)
    objectives_file.seek(0) # Place file seeker at the beginning of the file to overwrite old data
    objectives_file.writelines(objective + '\n' for objective in objectives)
    objectives_file.close()
    print("[*] Added new objective!")

def remove_objective(objectives_filename):
    pass