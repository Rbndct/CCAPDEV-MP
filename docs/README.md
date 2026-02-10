# Court Reservation System 🎾

A modern court reservation system built with **React + Vite + Tailwind CSS**.

## 🚀 What's Included

- ⚡ **Vite** - Lightning-fast development server with HMR
- ⚛️ **React 18** - Modern React with hooks
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🧩 **Custom UI Components** - Hand-crafted, accessible component system
- 🎭 **Lucide React** - Beautiful icon library
- 📱 **Responsive Design** - Mobile-first approach

## 🔧 Installing Vite (For New Projects)

```bash
# Create a new Vite + React project
npm create vite@latest my-project-name -- --template react
cd my-project-name
npm install
npm run dev
```

**Templates:** `react` (JavaScript) | `react-ts` (TypeScript) | `react-swc` (faster)

## 📦 Getting Started (This Project)

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### 3. Custom UI Components

Custom components in `src/components/ui.jsx`:
- **Button** - Variants: primary, secondary, outline, ghost
- **Card** - Hover effects: lift, scale, glow
- **Input** - With label and icon support
- **Badge** - Status indicators


## 🏗️ Project Structure

```
court-reservation/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── ui.jsx      # Custom UI components (Button, Card, Input, Badge)
│   │   ├── LandingPage.jsx
│   │   ├── FacilitiesPage.jsx
│   │   ├── AvailabilityCalendar.jsx
│   │   └── ThemeToggle.jsx
│   ├── pages/          # Page components
│   │   ├── HomePage.jsx
│   │   └── FacilitiesPage.jsx
│   ├── lib/
│   │   └── utils.js    # Utility functions (cn helper)
│   ├── App.jsx         # Main app component
│   ├── App.css         # App styles
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles with Tailwind
├── index.html          # HTML template
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
└── postcss.config.js   # PostCSS configuration
```

## 🎨 Using Custom UI Components

```jsx
import { Button, Card, Input, Badge } from "@/components/ui"

function MyComponent() {
  return (
    <Card variant="glass" hover="lift" className="p-6">
      <h3 className="text-xl font-bold mb-4">Court Reservation</h3>
      <Input label="Your Name" placeholder="Enter your name" />
      <Button variant="primary" className="mt-4">Book Now</Button>
      <Badge variant="success">Available</Badge>
    </Card>
  )
}
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 💡 Next Steps for Court Reservation System

Here are some features you might want to build:

1. **Court Listing** - Display available courts with images and details
2. **Calendar/Date Picker** - Let users select reservation dates and times
3. **Booking Form** - Collect user information and reservation details
4. **Time Slot Selection** - Show available time slots for each court
5. **Confirmation Dialog** - Confirm bookings with users
6. **Admin Dashboard** - Manage reservations and courts

### Component Ideas

You can extend the custom UI components or create new ones:
- **Calendar** - For date selection
- **Dialog/Modal** - For confirmations
- **Form** - For booking forms with validation
- **Table** - For admin reservation list
- **Select/Dropdown** - For court/time selection
- **Toast/Notification** - For user feedback

## 📚 Resources

- [Vite Documentation](https://vite.dev)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide React Icons](https://lucide.dev/guide/packages/lucide-react)

---

Happy coding! 🚀
