# AI Career Assistant

A comprehensive AI-powered career development platform that helps professionals enhance their resumes, craft compelling emails, and prepare for interviews using advanced AI analysis and optimization.

## 🚀 Features

### 📄 Resume Enhancement
- **ATS Optimization**: Analyze and optimize resumes for Applicant Tracking Systems
- **Industry Analysis**: Get insights on how your resume fits specific industries
- **Career Path Guidance**: Receive personalized career progression recommendations
- **Structure Analysis**: Improve resume formatting and organization
- **Skills Assessment**: Identify gaps and suggest improvements

### 📧 Email Optimization
- **Psychology Analysis**: Understand the psychological impact of your emails
- **Deliverability Check**: Ensure emails reach their intended recipients
- **Alternative Suggestions**: Get multiple email variations for different contexts
- **Tone Analysis**: Optimize email tone for different audiences

### 🎯 Interview Preparation
- **STAR Method Analysis**: Structure responses using Situation, Task, Action, Result framework
- **Behavioral Questions**: Practice common interview scenarios
- **Performance Metrics**: Track improvement over time
- **Personalized Feedback**: Get tailored advice based on your responses

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Shadcn/ui
- **AI Integration**: Google Gemini API
- **Deployment**: Vercel
- **File Processing**: Custom document parsers
- **Security**: Rate limiting, input validation, sanitization

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/NoobSambit/AI-Career-Assistant.git
cd AI-Career-Assistant
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Google Gemini API key to `.env.local`:
```env
GEMINI_API_KEY=your_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
AI-Career-Assistant/
├── app/
│   ├── api/                 # API routes
│   │   ├── email/          # Email analysis endpoints
│   │   ├── interview/      # Interview preparation endpoints
│   │   └── resume/         # Resume enhancement endpoints
│   ├── components/         # React components
│   │   ├── email/          # Email-specific components
│   │   ├── interview/      # Interview-specific components
│   │   ├── resume/         # Resume-specific components
│   │   └── shared/         # Shared components
│   ├── email/              # Email analysis page
│   ├── interview/          # Interview preparation page
│   ├── resume/             # Resume enhancement page
│   └── globals.css         # Global styles
├── lib/
│   ├── schemas/            # TypeScript schemas
│   ├── gemini.ts          # AI integration
│   ├── documentParser.ts  # File processing
│   └── validation.ts      # Input validation
└── public/                 # Static assets
```

## 🔧 API Endpoints

### Resume Enhancement
- `POST /api/resume` - Analyze and enhance resume

### Email Optimization
- `POST /api/email` - Analyze and optimize emails

### Interview Preparation
- `POST /api/interview` - Prepare for interviews

## 🎨 UI/UX Features

- **Dark Theme**: Professional, modern dark interface
- **Responsive Design**: Works on all device sizes
- **File Upload**: Drag-and-drop file upload with preview
- **Real-time Analysis**: Instant AI-powered feedback
- **Progress Tracking**: Visual progress indicators
- **Export Options**: Download enhanced documents

## 🔒 Security Features

- Rate limiting to prevent abuse
- Input validation and sanitization
- Secure file processing
- Environment variable protection
- CORS configuration

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Environment Variables

```env
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**NoobSambit**
- GitHub: [@NoobSambit](https://github.com/NoobSambit)
- Email: sambitpradhan.dev2004@gmail.com

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- Next.js team for the amazing framework
- Tailwind CSS for styling utilities
- Shadcn/ui for beautiful components

## 📊 Project Status

✅ **Resume Agent**: Fully functional with comprehensive analysis
✅ **Email Agent**: Complete with psychology and deliverability analysis  
✅ **Interview Agent**: Ready with STAR method analysis
✅ **UI/UX**: Professional dark theme implementation
✅ **API Integration**: All endpoints working with Gemini AI
✅ **Deployment Ready**: Configured for Vercel deployment

---

**Ready to boost your career?** 🚀 [Try the AI Career Assistant](https://ai-career-assistant.vercel.app)
