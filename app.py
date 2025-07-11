from flask import Flask, render_template, jsonify
from notion_client import Client
import requests
from config import NOTION_TOKEN, DATABASE_ID

app = Flask(__name__)
notion = Client(auth=NOTION_TOKEN)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/photos')
def get_photos():
    try:
        response = notion.databases.query(
            database_id=DATABASE_ID,
            filter={
                "property": "Posted",
                "checkbox": {
                    "equals": True
                }
            },
            sorts=[
                {
                    "property": "Created time",
                    "direction": "descending"
                }
            ]
        )
        
        photos = []
        for page in response['results']:
            properties = page['properties']
            
            # Get files from Content Files property
            content_files = properties.get('Content Files', {}).get('files', [])
            
            # Get caption
            caption_text = ''
            if 'Caption' in properties and properties['Caption']['rich_text']:
                caption_text = properties['Caption']['rich_text'][0]['plain_text']
            
            # Get created time
            created_time = properties.get('Created time', {}).get('created_time', '')
            
            # Process each file in the Content Files property
            for file_info in content_files:
                if file_info['type'] == 'file':
                    # Direct file upload
                    image_url = file_info['file']['url']
                elif file_info['type'] == 'external':
                    # External file link
                    image_url = file_info['external']['url']
                else:
                    continue
                
                photo = {
                    'id': page['id'] + '_' + str(len(photos)),  # Unique ID for each image
                    'image_url': image_url,
                    'caption': caption_text,
                    'created_time': created_time,
                    'name': file_info.get('name', 'Untitled')
                }
                
                photos.append(photo)
                
        return jsonify(photos)
    
    except Exception as e:
        print(f"Error fetching photos: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    import os
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
