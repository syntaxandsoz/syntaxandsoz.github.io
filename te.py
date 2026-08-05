import requests
from bs4 import BeautifulSoup
import json
import sys

def audit_syntax_and_soz(url="http://localhost:3000"):
    print(f"[INFO] Scanning URL: {url} ...\n")
    try:
        response = requests.get(url, timeout=10)
        if response.status_code != 200:
            print(json.dumps({"error": f"Failed to fetch site. Status Code: {response.status_code}"}, indent=4))
            return
            
        soup = BeautifulSoup(response.text, 'html.parser')
        
        report = {
            "status": "Success",
            "url_scanned": url,
            "seo_missing": [],
            "ux_missing": [],
            "structural_missing": [],
            "total_links_found": len(soup.find_all('a')),
            "data_for_antigravity": {}
        }

        # 1. SEO Checks
        title = soup.find('title')
        if not title or not title.text.strip():
            report["seo_missing"].append("Missing or empty <title> tag.")
            
        meta_desc = soup.find('meta', attrs={'name': 'description'})
        if not meta_desc or not meta_desc.get('content'):
            report["seo_missing"].append("Missing or empty <meta name='description'>.")
            
        canonical = soup.find('link', rel='canonical')
        if not canonical:
            report["seo_missing"].append("Missing <link rel='canonical'> tag (Critical for indexing).")

        # 2. Legacy Vanilla CSS Structure Checks
        if not soup.find(class_="doc-layout"):
            report["structural_missing"].append("Missing 'doc-layout' class (Legacy wrapper not found).")
            
        if not soup.find(class_="sidebar"):
            report["structural_missing"].append("Missing 'sidebar' class (Navigation broken or missing).")
            
        if not soup.find('main', class_="content"):
            report["structural_missing"].append("Missing <main class='content'> (Semantic core content area not found).")

        # 3. Micro-Utility UX Checks
        buttons = soup.find_all('button')
        copy_button_found = any('copy' in btn.text.lower() or 'copy' in btn.get('class', []) for btn in buttons)
        if not copy_button_found:
            report["ux_missing"].append("Missing 'Copy to Clipboard' button logic (Crucial for developer tools retention).")

        input_areas = soup.find_all(['textarea', 'input'])
        if not input_areas:
            report["ux_missing"].append("No input fields or textareas found for data processing.")

        # Consolidate for Antigravity Prompt
        report["data_for_antigravity"] = {
            "seo_fixes_required": len(report["seo_missing"]) > 0,
            "layout_fixes_required": len(report["structural_missing"]) > 0,
            "ux_fixes_required": len(report["ux_missing"]) > 0
        }

        print(json.dumps(report, indent=4))

    except requests.exceptions.RequestException as e:
        print(json.dumps({"error": f"Connection failed: {str(e)}"}, indent=4))
        print("Make sure 'npm run dev' is running if checking localhost.")

if __name__ == "__main__":
    # URL argument de sakta hai, warna localhost:3000 default check karega
    target_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:3000"
    audit_syntax_and_soz(target_url)