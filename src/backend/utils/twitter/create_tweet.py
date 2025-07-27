import requests
from requests_oauthlib import OAuth1

# Replace with your actual API keys and tokens
API_KEY = "kfOS2VXPpfnkflH7st44MYXNX"
API_SECRET = "DiyEv9X56HWvYcGZqa9jSKF32aJDiT57JMYA5RClYXkrtoNbCK"
ACCESS_TOKEN = "3378518457-arp7DC9eQCl5CqG6p3P4phsX348BrfI4ThIRVUx"
ACCESS_SECRET = "TF3cKUTlRNOfJjpYsPDHYlJ24ITUD2KRB75dfjZOhHgaC"

url = "https://api.twitter.com/2/tweets"

def post_tweet():
    # Tweet content
    tweet_text = """Kapteinsvalg blant topp 1000 i ESF runde 28: #ESfantasy 
        1) Castro- 62.4% 
        2) Heggebø - 14.3% 
        3) Brynhildsen - 10.3% 
        4) Tripic - 9.9% 
        5) Salvesen - 5.4%
        6) Zinckernagel - 3.6%
        7) Hauge - 2.5%
        8) Nunez - 2.3%
        9) Eriksen - 1.0%
        10) Bjørkan - 0.9%"""

    # OAuth 1.0a Authentication
    auth = OAuth1(API_KEY, API_SECRET, ACCESS_TOKEN, ACCESS_SECRET)

    # Payload containing the tweet text
    payload = {"text": tweet_text}

    # Sending POST request to post the tweet
    response = requests.post(url, json=payload, auth=auth)

    # Printing the response to see if it was successful
    if response.status_code == 201:
        print("Tweet posted successfully!")
        print(response.json())
    else:
        print(f"Failed to post tweet. Error: {response.status_code}")
        print(response.json())