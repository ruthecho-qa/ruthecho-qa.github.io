# Portfolio Assets Guide

## 📁 Folder Structure

```
Ruth_WebPortfolio/
├── assets/
│   ├── downloads/          # Downloadable files (templates, PDFs, etc.)
│   └── images/
│       └── projects/       # Project screenshots and images
├── index.html
├── style.css
└── script.js
```

## 📋 How to Add Downloadable Files

### Step 1: Prepare Your File
Create or export your test case template as an Excel file (.xlsx)

### Step 2: Add to Downloads Folder
Place your file here:
```
assets/downloads/test-case-template.xlsx
```

### Step 3: File Naming Convention
Use descriptive, lowercase names with hyphens:
- ✅ `test-case-template.xlsx`
- ✅ `bug-report-template.pdf`
- ❌ `Template 1.xlsx`
- ❌ `testcase.xlsx`

### Current Downloads Setup:
The portfolio is already configured to download from:
- **Path**: `assets/downloads/test-case-template.xlsx`
- **Download name**: `Ruth_Echo_Test_Case_Template.xlsx`

## 🖼️ How to Add Project Images

### Step 1: Prepare Your Images

**Image Requirements:**
- **Format**: JPG, PNG, or WebP
- **Size**: 800x400px to 1200x600px (16:9 ratio recommended)
- **File size**: Under 500KB (compress if needed)
- **Quality**: High-resolution screenshots showing the app/platform

**Tools for Screenshots:**
- For web apps: Use browser DevTools responsive mode
- For mobile apps: Use actual device or emulator screenshots
- Compress images: Use TinyPNG.com or similar

### Step 2: Name Your Images

Use the project name in lowercase with hyphens:
```
vyond.jpg
doogether.jpg
kyzn.jpg
parsel.jpg
hijra-taaruf.jpg
klikbca.jpg
```

### Step 3: Add to Projects Folder

Place all project images here:
```
assets/images/projects/
```

### Step 4: Verify Images Appear

Open your portfolio in a browser. The images will:
- ✅ Display if the file exists
- 🎬 Show emoji placeholder if file is missing (graceful fallback)

## 📸 Where to Get Project Images

### Option 1: Screenshots from Live Apps
- Vyond: Screenshot from vyond.com
- DOOgether, KYZN, etc.: Screenshot from app stores or live apps

### Option 2: Create Mockups
If you can't access the apps, create professional mockups:
- Use Figma or Canva
- Show key features you tested
- Include brand colors

### Option 3: Request from Clients
Reach out to clients for:
- Official app screenshots
- Marketing materials
- Product images

## 🎨 Image Best Practices

### Professional Screenshots Should Show:
1. **Main interface** - Dashboard, home screen, or key feature
2. **Your work impact** - Features you tested
3. **Clean UI** - No debug info, lorem ipsum, or test data
4. **Brand elements** - Logo, colors (if permitted)

### Editing Tips:
1. **Add subtle overlay** to make text readable
2. **Blur sensitive data** (user info, real transactions)
3. **Crop appropriately** to 16:9 ratio
4. **Maintain aspect ratio** (don't stretch)

## 🚀 Quick Setup Checklist

- [ ] Create `assets/downloads/` folder
- [ ] Create `assets/images/projects/` folder
- [ ] Add test case template Excel file
- [ ] Collect 6 project screenshots
- [ ] Name files correctly (lowercase, hyphens)
- [ ] Compress images to <500KB each
- [ ] Test in browser
- [ ] Verify downloads work
- [ ] Check mobile responsiveness

## 💡 Pro Tips

1. **Backup images**: Keep originals in a separate folder
2. **Version control**: Commit assets to Git (if <1MB each)
3. **CDN option**: For faster loading, use Cloudinary or ImgIX
4. **Lazy loading**: Images already optimized with proper HTML
5. **Alt text**: Already included for accessibility

## 🔧 Troubleshooting

**Images not showing?**
- Check file path matches exactly
- Verify file extension (`.jpg` not `.JPG`)
- Ensure file is in correct folder
- Check browser console for 404 errors

**Download not working?**
- Verify file exists in `assets/downloads/`
- Check file name matches link in HTML
- Test in different browsers

**Images too large?**
- Use TinyPNG.com to compress
- Target 200-500KB per image
- Consider WebP format for smaller sizes

## 📞 Need Help?

Check browser console (F12) for any errors loading assets.
