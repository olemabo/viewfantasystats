import requests

print("test")
r = requests.get("https://fantasy.tv2.no/api/entry/69/history/")
print(r)
jsonResponse = r.json()
print(jsonResponse)
