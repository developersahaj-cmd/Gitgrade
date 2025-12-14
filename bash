# Install Tailwind
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install GitHub Pages deploy tool
npm install --save-dev gh-pages

# Create a new React app
npx create-react-app gitgrade-ai

# Navigate to project
cd gitgrade-ai

# Install required dependencies
npm install lucide-react
# Create production build
npm run build

# Deploy to GitHub Pages
npm run deploy
npm test
# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/gitgrade-ai.git

# Push to GitHub
git branch -M main
git push -u origin main
# Build the project
npm run build

# Deploy to GitHub Pages
npm run deploy
