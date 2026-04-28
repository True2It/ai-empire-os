import requests
from bs4 import BeautifulSoup
import json
import time

def scrape_craigslist(city, category):
    url = f"https://{city}.craigslist.org/search/{category}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            print(f"Failed to retrieve data from {url}")
            return []
        
        soup = BeautifulSoup(response.text, 'html.parser')
        listings = []
        
        # Craigslist structure can vary, this is a general approach
        for post in soup.find_all('li', class_='cl-static-search-result'):
            title_elem = post.find('div', class_='title')
            link_elem = post.find('a')
            price_elem = post.find('div', class_='price')
            
            if title_elem and link_elem:
                listings.append({
                    'title': title_elem.text.strip(),
                    'url': link_elem['href'],
                    'price': price_elem.text.strip() if price_elem else 'N/A'
                })
        
        return listings
    except Exception as e:
        print(f"An error occurred: {e}")
        return []

if __name__ == "__main__":
    # Example: Scrape 'moving' services in 'atlanta'
    city = "atlanta"
    category = "bbb" # 'bbb' is often used for services/gigs
    leads = scrape_craigslist(city, category)
    
    with open('/home/ubuntu/leads.json', 'w') as f:
        json.dump(leads, f, indent=4)
    
    print(f"Found {len(leads)} leads. Saved to leads.json")
