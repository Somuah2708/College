# College App

A React Native Expo app for college students featuring news feeds, university information, and educational content.

## Features

- 📱 Clean, modern UI with dark/light theme support
- 🏛️ University information and filtering
- 📰 Trending news feed
- 🎥 Video content with autoplay
- 📚 Educational resources and tools
- 🎓 UPS (University Preparation System) modules
- 💰 Scholarship and funding information

## Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Supabase** for backend and database
- **Expo Router** for navigation
- **Lucide React Native** for icons
- **Expo AV** for video playback

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd college
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials

4. Start the development server:
   ```bash
   npx expo start
   ```

## Project Structure

```
app/
├── (tabs)/           # Tab navigation screens
│   ├── index.tsx     # Home screen
│   ├── tools.tsx     # Tools screen
│   └── ups/          # UPS module screens
├── _layout.tsx       # Root layout
└── ...other screens
components/           # Reusable components
context/             # React contexts (Theme, etc.)
lib/                 # Utilities and services
supabase/           # Database migrations
```

## Database Schema

The app uses Supabase with the following main tables:
- `posts` - User posts and content
- `universities` - University information
- `post_media` - Media attachments for posts

## Development

- Run `npx expo start` for development
- Use `npx expo start -c` to clear cache
- Access via Expo Go app or simulators

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.