# AIccasion

**AIccasion** is an AI-powered web app that helps users find their perfect used car ("occasion") in the Netherlands. It uses OpenAI's GPT to understand user preferences and Google Custom Search to find relevant car listings on trusted Dutch car sites.

## Features

- **Conversational Car Search**: Chat with an AI advisor to describe your ideal car.
- **Smart Model Suggestions**: The AI suggests specific car models based on your needs.
- **Live Search Results**: Finds real-time listings from Marktplaats and Autotrack.
- **Modern UI**: Responsive, clean interface built with React, Next.js, and Tailwind CSS.

## Demo

![screenshot or gif here if available]

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- Yarn or npm

### Installation

1. **Clone the repository:**

   ```bash
   git clone <your-repo-url>
   cd aiccasion
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   # or
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root with the following:

   ```
   OPENAI_API_KEY=your-openai-api-key
   GOOGLE_API_KEY=your-google-api-key
   GOOGLE_CSE_ID=your-google-cse-id
   ```

   - Get your OpenAI API key from https://platform.openai.com/
   - Get your Google API key and Custom Search Engine ID from https://programmablesearchengine.google.com/

4. **Run the development server:**

   ```bash
   yarn dev
   # or
   npm run dev
   ```

5. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

- `components/` – Reusable React components (ChatBox, MessageBubble, SearchResults, ChatInput, etc.)
- `pages/` – Next.js pages and API routes
  - `api/advisor.ts` – Handles chat logic and AI integration
  - `api/google-search.ts` – Handles Google Custom Search API requests
- `lib/` – Utility functions (e.g., Google query builder)
- `public/data/` – Example car data

## How it Works

1. **User chats** with the AI advisor, describing their car wishes.
2. **AI (OpenAI GPT)** asks clarifying questions and suggests specific models.
3. **AI builds a Google search query** for trusted car sites and fetches live results.
4. **Results are shown** in the chat interface, with links and thumbnails.

## Customization

- **Styling**: Uses Tailwind CSS for easy customization.
- **Car Data**: You can extend or replace the car data and search logic as needed.

## Scripts

- `yarn dev` – Start development server
- `yarn build` – Build for production
- `yarn start` – Start production server

## License

MIT
