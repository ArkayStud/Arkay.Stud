# Instagram Grid Widget for Notion

A beautiful, responsive Instagram-style grid widget that displays photos from your Notion database.

## Features

- 📸 Beautiful Instagram-style grid layout
- 🔄 Auto-refresh every 2 minutes
- 📱 Fully responsive design
- 🖼️ Lightbox for full-size image viewing
- ✅ Only shows photos marked as "Posted"
- 📅 Shows creation dates
- 💬 Displays captions

## Setup Instructions

### 1. Notion Database Properties
Your database should have these properties:
- **Content Files** (Files and Media) - Upload your images here
- **Caption** (Text) - Description for your photos
- **Created time** (Created time) - Automatically set when created
- **Posted** (Checkbox) - Check this to make photos visible in the grid

### 2. Installation

1. Open terminal in the project folder
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

### 3. Running the App

1. Start the Flask server:
   ```
   python app.py
   ```

2. Open your browser and go to: `http://localhost:5000`

### 4. Embedding in Notion

1. In your Notion page, type `/embed`
2. Enter the URL: `http://localhost:5000`
3. Adjust the embed size as needed

## Usage

1. **Add Photos:**
   - Go to your Notion database
   - Upload images to "Content Files"
   - Add captions in "Caption" field
   - Check the "Posted" checkbox to make them visible

2. **View Grid:**
   - The widget automatically refreshes every 2 minutes
   - Click on any photo to view it in full size
   - Only photos with "Posted" checked will appear

## Configuration

The widget is configured with your specific Notion credentials in the `.env` file:
- Database ID: f5f0d424-6a67-4298-a33e-954735133a56
- Integration Token: [Your token is securely stored]

## Customization

You can customize the grid by editing:
- `static/css/style.css` - Styling and layout
- `static/js/script.js` - Functionality and interactions
- `templates/index.html` - HTML structure

## Troubleshooting

- Make sure your Notion integration has access to your database
- Check that the "Posted" checkbox is enabled for photos you want to display
- Verify that images are properly uploaded to the "Content Files" property
- Check the browser console for any error messages
