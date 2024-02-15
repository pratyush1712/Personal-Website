import os
import json
from dotenv import load_dotenv
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from data import songs

load_dotenv()

spotify_client = os.environ.get("SPOTIFY_CLIENT_ID")
spotify_secret = os.environ.get("SPOTIFY_SECRET")

client_credentials_manager = SpotifyClientCredentials(
    client_id=spotify_client, client_secret=spotify_secret
)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

WEBSITE_PUBLIC_SONGS_PATH = "../src/utils/"


def get_track_info(track_id):
    """
    Fetch track information using Spotipy.

    :param track_id: Spotify track ID
    :return: Dictionary with track information
    """
    track = sp.track(track_id)

    track_info = {
        "image": track["album"]["images"][0]["url"],
        "name": track["name"],
        "id": track["id"],
        "artist": track["artists"][0]["name"],
    }

    return track_info


def main():
    """
    Fetch track information and write to file.

    :return: None
    """
    resp = []
    for song in songs:
        track_info = get_track_info(song.split("/")[-1].split("?")[0])
        track_info["url"] = song
        resp.append(track_info)

    with open(WEBSITE_PUBLIC_SONGS_PATH + "songs.json", "w+") as f:
        json.dump(resp, f)


main()
