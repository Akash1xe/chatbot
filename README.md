# 🤖 AI ChatBot

A beautiful, interactive AI chatbot with floating background animations powered by Google's Gemini AI.

## 🚀 Features


- **AI-Powered Conversations**: Uses Google's Gemini AI for intelligent responses
- **Image Support**: Upload and analyze images
- **Floating Animations**: Beautiful GSAP-powered background animations
- **Modern UI**: Glass morphism design with smooth interactions
- **Responsive**: Works on all devices

## 🔧 Local Development

1. Clone the repository:
```bash
git clone <your-repo-url>
cd chatbot
```

2. Create a `config.js` file in the root directory:
```javascript
window.CONFIG = {
  API_KEY: "your-gemini-api-key-here"
};
```

3. Open `index.html` in your browser or use a local server.

## 🌐 Vercel Deployment

### Step 1: Environment Variables
In your Vercel dashboard, add the following environment variable:
- **Name**: `GEMINI_API_KEY`
- **Value**: Your Google Gemini API key

### Step 2: Deploy
1. Connect your GitHub repository to Vercel
2. Deploy automatically or manually trigger deployment

### Step 3: Verify
Your chatbot will be live at your Vercel URL with the API key securely stored in environment variables.

## 🔒 Security

- ✅ API keys are stored in environment variables
- ✅ Local config file is ignored by Git
- ✅ Production uses Vercel's secure environment variables
- ✅ No sensitive data exposed in client-side code

## 📁 Project Structure

```
chatbot/
├── index.html          # Main HTML file
├── style.css           # Styles and animations
├── script.js           # Main JavaScript logic
├── config.js           # Local config (git-ignored)
├── api/
│   └── config.js       # Vercel API endpoint for config
├── vercel.json         # Vercel configuration
├── .env                # Environment variables (git-ignored)
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## 🎨 Customization

- **Icons**: Modify floating icons in `index.html`
- **Colors**: Update gradient and theme in `style.css`
- **Animations**: Adjust GSAP animations in `script.js`
- **AI Model**: Change Gemini model in the API URL

## 📱 Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
