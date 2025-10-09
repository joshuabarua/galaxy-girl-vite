# Emma Barua - Makeup Artist Portfolio

A minimal, Scandinavian-style portfolio website showcasing makeup artistry work. Clean, elegant, and focused entirely on the images.

## ✨ Features

- **Minimal Design**: Black and white Scandinavian aesthetic
- **MenuToGrid Animation**: Smooth GSAP-powered transitions from rows to grid
- **Cloudinary Integration**: Optimized image delivery
- **Easy CV Updates**: JSON-based resume system - no coding required
- **Fully Responsive**: Beautiful on all devices
- **Fast**: Built with React + Vite

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Add your Cloudinary credentials

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open browser:**
   - Navigate to `http://localhost:5173`

## 📚 Documentation

- **[SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)** - Complete setup checklist
- **[MINIMAL_REDESIGN_SUMMARY.md](./MINIMAL_REDESIGN_SUMMARY.md)** - Overview of the design
- **[HOW_TO_UPDATE_CV.md](./HOW_TO_UPDATE_CV.md)** - Guide for updating CV/Resume
- **[CLOUDINARY_SETUP.md](./CLOUDINARY_SETUP.md)** - Cloudinary setup guide
- **[QUICK_START.md](./QUICK_START.md)** - Quick start guide

## 📁 Key Files

### For Emma to Update:

**CV/Resume Data:**
```
src/pages/resume/resumeData.json
```
Simply edit this JSON file to add new projects, skills, or experience.

**Gallery Data:**
```
src/pages/portfolio/data/cloudinaryGalleryData.js
```
Update image IDs after uploading to Cloudinary.

**Contact Information:**
```
src/pages/contact/ContactMinimal.jsx
```
Update email, phone, and social links.

## 🎨 Design

- **Color Palette**: Pure black and white with light gray accents
- **Typography**: System fonts with thin weights (300-400)
- **Layout**: Generous white space, clean lines
- **Animation**: Subtle, purposeful transitions

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **GSAP** - Animation library
- **Cloudinary** - Image hosting and optimization
- **React Router** - Navigation

## 📦 Build for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## 🌐 Deploy

Deploy to:
- **Vercel** (recommended): `vercel`
- **Netlify**: Connect GitHub repo or upload `dist/` folder
- **Any static host**: Upload contents of `dist/` folder

## 📄 License

Private portfolio website for Emma Barua.

---

Built with ❤️ using React + Vite
