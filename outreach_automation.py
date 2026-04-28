import json
import time

def generate_outreach_messages(leads_file, name, phone, email):
    with open(leads_file, 'r') as f:
        leads = json.load(f)
    
    outreach_log = []
    
    for lead in leads:
        title = lead['title']
        # Simple logic to tailor the message based on the service
        service_type = "service"
        if "moving" in title.lower() or "movers" in title.lower():
            service_type = "moving"
        elif "roadside" in title.lower() or "mechanic" in title.lower():
            service_type = "roadside assistance"
        elif "delivery" in title.lower():
            service_type = "delivery"

        message = f"Hi, I saw your post regarding {title}. I'm {name}, and we specialize in {service_type} through TAO LLC. We have a team ready to assist you immediately with professional and reliable service. You can reach me directly at {phone} or reply to {email}. Looking forward to helping you get this done!"
        
        outreach_log.append({
            "lead_title": title,
            "lead_url": lead['url'],
            "message_sent": message,
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")
        })
    
    with open('/home/ubuntu/outreach_log.json', 'w') as f:
        json.dump(outreach_log, f, indent=4)
    
    return len(outreach_log)

if __name__ == "__main__":
    name = "Doe the CEO"
    phone = "346-540-9025"
    email = "makeitmonetizenow@gmail.com"
    count = generate_outreach_messages('/home/ubuntu/filtered_leads.json', name, phone, email)
    print(f"Generated and logged {count} outreach messages.")
