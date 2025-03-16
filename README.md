# ReadingRally

An interactive repeated reading application for K-3 students to improve reading fluency.

> **Note:** This project is currently in alpha stage. More features and improvements are actively being developed.

## Features

- One-minute reading sessions
- Immediate feedback and corrections
- Progress tracking with visual graphs
- Reward system for achievements
- Grade-appropriate reading content
- AI-powered reading analysis

## Roadmap

### Reading Content Management
- [ ] Build content management system for reading passages
- [ ] Add different difficulty levels
- [ ] Include age-appropriate content categories
- [ ] Support for different languages

### Speech Recognition
- [ ] Improve handling of different accents and speech patterns
- [ ] Add real-time word highlighting during reading
- [ ] Implement more accurate word timing analysis
- [ ] Add offline speech recognition option

### User Management
- [ ] Implement user authentication system
- [ ] Create teacher/parent dashboard
- [ ] Add class/group management
- [ ] Generate progress reports and analytics

### Performance
- [ ] Implement caching strategies for API calls
- [ ] Optimize animations and transitions
- [ ] Reduce bundle size
- [ ] Improve loading states

### Analytics
- [ ] Add detailed reading metrics
- [ ] Implement long-term progress tracking
- [ ] Add reading pattern analysis
- [ ] Create personalized recommendations

### Accessibility
- [ ] Improve screen reader support
- [ ] Add high contrast mode
- [ ] Include dyslexia-friendly font options
- [ ] Enhance keyboard navigation

### Testing
- [ ] Add unit tests for core functionality
- [ ] Implement integration tests
- [ ] Add end-to-end testing
- [ ] Perform performance benchmarking

### Mobile Support
- [ ] Improve responsive design
- [ ] Add PWA capabilities
- [ ] Optimize touch interfaces
- [ ] Implement mobile-specific features

### Backend Infrastructure
- [ ] Build backend service
- [ ] Implement user data persistence
- [ ] Add reading history storage
- [ ] Create analytics database

### Educational Features
- [ ] Add vocabulary building exercises
- [ ] Include comprehension questions
- [ ] Create interactive reading games
- [ ] Implement progress certificates

## Prerequisites

- Node.js 16 or higher
- npm or yarn
- OpenAI API key (for reading analysis features)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your OpenAI API key to `.env.local`:
     ```
     VITE_OPENAI_API_KEY=your_openai_api_key_here
     ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `/src/components`: Reusable UI components
- `/src/pages`: Application pages
- `/src/services`: Core services (API, speech recognition, etc.)
- `/src/store`: State management
- `/src/hooks`: Custom React hooks
- `/src/types`: TypeScript type definitions

## Environment Variables

The following environment variables are required:

- `VITE_OPENAI_API_KEY`: Your OpenAI API key for reading analysis features

You can obtain an OpenAI API key by:
1. Creating an account at [OpenAI](https://platform.openai.com)
2. Navigating to the API section
3. Creating a new API key

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.
