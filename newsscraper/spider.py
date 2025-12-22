import requests
from bs4 import BeautifulSoup
import json
import os
from datetime import datetime

# URL to scrape
URL = "https://thehackernews.com/"

def scrape_data():
    print(">> [BOT] Connecting to Target: The Hacker News...")
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    try:
        response = requests.get(URL, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, "html.parser")
        articles_list = []
        
        news_items = soup.select(".body-post")[:8]

        for item in news_items:
            try:
                title = item.select_one(".home-title").get_text(strip=True)
                link = item.select_one("a.story-link")['href']
                tag = item.select_one(".item-label").get_text(strip=True)
                
                articles_list.append({
                    "title": title,
                    "source": "The Hacker News",
                    "time": datetime.now().strftime("%Y-%m-%d"),
                    "category": tag,
                    "link": link
                })
                print(f"[+] Scraped: {title[:30]}...")
            except Exception as e:
                print(f"[-] Skipped item: {e}")

    
        # If running from root (GitHub Actions), go into the folder
        if os.path.exists('newsscraper'):
            file_path = 'newsscraper/data.json'
        else:
            # If inside the folder, save directly
            file_path = 'data.json'

        with open(file_path, 'w') as f:
            json.dump(articles_list, f, indent=4)
        
        print(f">> [SUCCESS] {len(articles_list)} articles saved to {file_path}")

    except Exception as e:
        print(f">> [ERROR] Bot Failed: {e}")

if __name__ == "__main__":
    scrape_data()