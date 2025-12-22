import requests
from bs4 import BeautifulSoup
import json
import os
from datetime import datetime

# URL to scrape (The Hacker News)
URL = "https://thehackernews.com/"

def scrape_data():
    print(">> [BOT] Connecting to Target: The Hacker News...")
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    try:
        response = requests.get(URL, headers=headers)
        response.raise_for_status() # Check for errors
        
        soup = BeautifulSoup(response.text, "html.parser")
        articles_list = []
        
        # Select news items (Specific to The Hacker News structure)
        news_items = soup.select(".body-post")[:8] # Get top 8 stories

        for item in news_items:
            try:
                # Title
                title = item.select_one(".home-title").get_text(strip=True)
                
                # Link
                link = item.select_one("a.story-link")['href']
                
                # Tag/Category
                tag = item.select_one(".item-label").get_text(strip=True)
                
                # Time (Fake relative time logic for demo, or fetch real date)
                # THN doesn't show exact time easily on home, so we assume "Latest"
                
                articles_list.append({
                    "title": title,
                    "source": "The Hacker News",
                    "time": datetime.now().strftime("%Y-%m-%d"), # Aaj ki date
                    "category": tag,
                    "link": link
                })
                print(f"[+] Scraped: {title[:30]}...")
            except Exception as e:
                print(f"[-] Skipped an item: {e}")

        # JSON file save karna
        # Note: Github Actions root se chalta hai, isliye path ka khayal rakhein
        file_path = 'scraper/data.json'
        
        # Check if running locally or in Action (Path adjustment)
        if not os.path.exists('scraper'):
            file_path = 'data.json' # Local run inside folder

        with open(file_path, 'w') as f:
            json.dump(articles_list, f, indent=4)
        
        print(f">> [SUCCESS] {len(articles_list)} articles saved to {file_path}")

    except Exception as e:
        print(f">> [ERROR] Bot Failed: {e}")

if __name__ == "__main__":
    scrape_data()