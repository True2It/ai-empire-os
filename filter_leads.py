import json

def filter_leads(input_file, output_file, keywords):
    with open(input_file, 'r') as f:
        leads = json.load(f)
    
    filtered = []
    for lead in leads:
        title = lead['title'].lower()
        if any(keyword in title for keyword in keywords):
            filtered.append(lead)
    
    with open(output_file, 'w') as f:
        json.dump(filtered, f, indent=4)
    
    return len(filtered)

if __name__ == "__main__":
    keywords = ['moving', 'movers', 'roadside', 'notary', 'delivery', 'dispatch']
    count = filter_leads('/home/ubuntu/leads.json', '/home/ubuntu/filtered_leads.json', keywords)
    print(f"Filtered {count} relevant leads.")
