# Court Reservation System 🎾

A modern court reservation system built with **React + Vite + Tailwind CSS + shadcn/ui**.

## 🚀 What's Included

- ⚡ **Vite** - Lightning-fast development server with HMR
- ⚛️ **React 18** - Modern React with hooks
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🧩 **shadcn/ui** - Beautiful, accessible component system
- 📱 **Responsive Design** - Mobile-first approach

## 📦 Getting Started

### 1. Install Dependencies

```bash
npm install
```

This will install all the required packages including:
- React and React DOM
- Vite build tool
- Tailwind CSS with PostCSS and Autoprefixer
- shadcn/ui utilities (clsx, tailwind-merge)

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 3. Install shadcn/ui Components

shadcn/ui is configured and ready to use. Install components as needed:

```bash
# Install a button component
npx shadcn@latest add button

# Install a calendar component (great for court reservations!)
npx shadcn@latest add calendar

# Install a card component
npx shadcn@latest add card

# Install a dialog component (for booking confirmations)
npx shadcn@latest add dialog

# Install a form component
npx shadcn@latest add form
```

View all available components at [ui.shadcn.com](https://ui.shadcn.com/docs/components)

## 🏗️ Project Structure

```
court-reservation/
├── public/              # Static assets
├── src/
│   ├── components/      # React components (shadcn/ui components will go here)
│   ├── lib/
│   │   └── utils.js    # Utility functions
│   ├── App.jsx         # Main app component
│   ├── App.css         # App styles
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles with Tailwind
├── index.html          # HTML template
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
├── postcss.config.js   # PostCSS configuration
└── components.json     # shadcn/ui configuration
```

## 🎨 Using shadcn/ui Components

After installing components with the CLI, they'll be added to `src/components/ui/`. Import and use them like this:

```jsx
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Court Reservation</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Book Now</Button>
      </CardContent>
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

### Recommended shadcn/ui Components

- `calendar` - For date selection
- `card` - For court cards
- `button` - For actions
- `dialog` - For confirmations
- `form` - For booking forms
- `table` - For admin reservation list
- `select` - For court/time selection
- `toast` - For notifications

## 📚 Resources

- [Vite Documentation](https://vite.dev)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)

---

Happy coding! 🚀
