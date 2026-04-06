from http.server import BaseHTTPRequestHandler
import json
import os
import asyncio
from twikit import Client

def _handle_tweet(tweet_content):
    username = os.getenv("TWITTER_USERNAME")
    email = os.getenv("TWITTER_EMAIL")
    password = os.getenv("TWITTER_PASSWORD")

    if not all([username, email, password]):
        return {"error": "Twitter credentials are not properly set"}

    client = Client('en-US')
    
    # Ideally, we should load cookies here `client.load_cookies('cookies.json')`
    # However, per user request, we perform raw login first.
    # Note: Frequent raw logins may cause Twitter to temporarily lock the account.
    try:
        # Notice: asyncio context in vercel functions can sometimes be tricky.
        # twikit Client methods are mostly async.
        async def post():
            await client.login(
                auth_info_1=username,
                auth_info_2=email,
                password=password
            )
            await client.create_tweet(text=tweet_content)
        
        asyncio.run(post())
        return {"success": True}
    except Exception as e:
        return {"error": str(e)}

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            body = json.loads(post_data.decode('utf-8'))
            tweet = body.get('tweet')
            
            if not tweet:
                self.send_response(400)
                self.send_header('Content-type','application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Tweet content required"}).encode('utf-8'))
                return

            result = _handle_tweet(tweet)
            
            if "error" in result:
                self.send_response(500)
                self.send_header('Content-type','application/json')
                self.end_headers()
                self.wfile.write(json.dumps(result).encode('utf-8'))
            else:
                self.send_response(200)
                self.send_header('Content-type','application/json')
                self.end_headers()
                self.wfile.write(json.dumps(result).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type','application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": f"Server error: {str(e)}"}).encode('utf-8'))

    def do_GET(self):
        self.send_response(405)
        self.send_header('Content-type','text/plain')
        self.end_headers()
        self.wfile.write('Method Not Allowed'.encode('utf-8'))
