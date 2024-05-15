import os
import json
from dotenv import load_dotenv, find_dotenv
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from data import songs

load_dotenv(find_dotenv(), override=True)

spotify_client = os.environ.get("SPOTIFY_CLIENT_ID")
spotify_secret = os.environ.get("SPOTIPY_CLIENT_SECRET")

manager = SpotifyClientCredentials(spotify_client, spotify_secret)
sp = spotipy.Spotify(client_credentials_manager=manager)

WEBSITE_PUBLIC_SONGS_PATH = os.environ.get("WEBSITE_PUBLIC_SONGS_PATH")


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
    song_ids = set()
    resp = []
    for limit in range(0, 1000, 50):
        playlist = sp.playlist_items(
            "https://open.spotify.com/playlist/32kj5oTYUpIJwW240Z1jli?si=dbb184186b034109",
            limit=50,
            offset=limit,
        )
        for liked_song in playlist["items"]:
            try:
                track_info = {
                    "image": liked_song["track"]["album"]["images"][0]["url"],
                    "name": liked_song["track"]["name"],
                    "id": liked_song["track"]["id"],
                    "artist": liked_song["track"]["artists"][0]["name"],
                }
                if liked_song["track"]["id"] in song_ids:
                    continue
                song_ids.add(liked_song["track"]["id"])
                resp.append(track_info)
            except:
                continue

    for song in songs:
        if song.split("/")[-1].split("?")[0] in song_ids:
            continue
        track_info = get_track_info(song.split("/")[-1].split("?")[0])
        track_info["url"] = song
        song_ids.add(song.split("/")[-1].split("?")[0])
        resp.append(track_info)
    print(len(resp))
    with open(WEBSITE_PUBLIC_SONGS_PATH + "songs.json", "w+") as f:
        json.dump(resp, f)


main()
