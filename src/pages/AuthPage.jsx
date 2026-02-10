import { useState, useEffect } from 'react';
import { Navbar, Footer } from '../components/LandingPage';
import { Button, Input, Card } from '../components/ui';
import { Mail, Lock, Eye, EyeOff, Check, User, Shield, ArrowRight, Chrome, Facebook, Smartphone } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const AuthPage = () => {
    const location = useLocation();
    const isRegister = location.pathname === '/signup';
    const [activeTab, setActiveTab] = useState(isRegister ? 'register' : 'login');

    useEffect(() => {
        setActiveTab(isRegister ? 'register' : 'login');
    }, [location.pathname]);
    const [userType, setUserType] = useState('user'); // 'user' or 'admin'
    const [showPassword, setShowPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    const toggleTab = (tab) => {
        setActiveTab(tab);
        setOtpSent(false); // Reset OTP state when switching tabs
    };

    const { login } = useAuth(); // Get login from context
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        // Get values from inputs (or use state if we were using state for inputs)
        const emailInput = document.querySelector('input[placeholder="Enter your email or phone number"]');
        const passwordInput = document.querySelector('input[type="password"]');

        const email = emailInput?.value || '';
        const password = passwordInput?.value || '';

        console.log(`Logging in...`);

        // Use the context login function
        login(email, password);

        // Redirect based on role (this logic might be better placed in a useEffect or inside login if it returned a promise)
        // For now, we'll manually check the email to decide where to go, mirroring the context logic
        if (email.includes('admin')) {
            navigate('/admin/dashboard');
        } else {
            navigate('/dashboard');
        }
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (!otpSent) {
            setOtpSent(true); // Simulate sending OTP
        } else {
            console.log('Verifying OTP and registering...');
            // Mock registration verification here
        }
    };

    return (
        <>
            <Navbar />

            <div className="min-h-screen pt-24 pb-12 flex items-center justify-center relative px-4">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[rgba(0,255,136,0.05)] -z-10"></div>
                <div className="absolute top-20 left-10 w-96 h-96 hero-orb-green rounded-full blur-[120px] opacity-30 -z-10 animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-72 h-72 hero-orb-blue rounded-full blur-[120px] opacity-30 -z-10 animate-pulse"></div>

                <Card variant="glass" className="w-full max-w-md p-8 border-[var(--border-subtle)] relative overflow-hidden">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold mb-2">
                            {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h1>
                        <p className="text-[var(--text-secondary)]">
                            {activeTab === 'login'
                                ? 'Enter your credentials to access your account'
                                : 'Join us and start booking your courts today'}
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex p-1 bg-[var(--bg-tertiary)] rounded-xl mb-8">
                        <button
                            onClick={() => toggleTab('login')}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'login'
                                ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm'
                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => toggleTab('register')}
                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'register'
                                ? 'bg-[var(--bg-primary)] text-[var(--text-primary)] shadow-sm'
                                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                                }`}
                        >
                            Register
                        </button>
                    </div>

                    {/* Login Form */}
                    {activeTab === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-6 animate-fade-in-up">
                            {/* User Type Toggle */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div
                                    className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${userType === 'user'
                                        ? 'border-[var(--accent-green)] bg-[rgba(0,255,136,0.05)]'
                                        : 'border-[var(--border-subtle)] hover:border-[var(--text-secondary)]'
                                        }`}
                                    onClick={() => setUserType('user')}
                                >
                                    <User className={`w-6 h-6 ${userType === 'user' ? 'text-[var(--accent-green)]' : 'text-[var(--text-muted)]'}`} />
                                    <span className={`text-sm font-medium ${userType === 'user' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>User</span>
                                </div>
                                <div
                                    className={`cursor-pointer border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${userType === 'admin'
                                        ? 'border-[var(--accent-green)] bg-[rgba(0,255,136,0.05)]'
                                        : 'border-[var(--border-subtle)] hover:border-[var(--text-secondary)]'
                                        }`}
                                    onClick={() => setUserType('admin')}
                                >
                                    <Shield className={`w-6 h-6 ${userType === 'admin' ? 'text-[var(--accent-green)]' : 'text-[var(--text-muted)]'}`} />
                                    <span className={`text-sm font-medium ${userType === 'admin' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>Admin</span>
                                </div>
                            </div>

                            <Input
                                label="Email or Phone"
                                placeholder="Enter your email or phone number"
                                icon={<Mail className="w-5 h-5" />}
                            />

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-[var(--text-secondary)]">Password</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                                        <Lock className="w-5 h-5" />
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] px-4 py-3 pl-11 pr-10 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-green)] focus:ring-2 focus:ring-[rgba(0,255,136,0.2)] transition-all"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div className="w-4 h-4 border border-[var(--border-subtle)] rounded flex items-center justify-center group-hover:border-[var(--accent-green)] transition-colors">
                                        {/* Checkbox state logic would go here */}
                                    </div>
                                    <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Remember me</span>
                                </label>
                                <a href="#" className="text-sm text-[var(--accent-green)] hover:underline">Forgot password?</a>
                            </div>

                            <Button variant="primary" size="lg" className="w-full" icon={<ArrowRight className="w-5 h-5" />}>
                                Log In
                            </Button>

                            <div className="text-center">
                                <span className="text-sm text-[var(--text-secondary)]">Demo Access: </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        // Mock admin login
                                        const emailInput = document.querySelector('input[placeholder="Enter your email or phone number"]');
                                        const passwordInput = document.querySelector('input[type="password"]');
                                        if (emailInput) emailInput.value = 'admin@sportsplex.com';
                                        if (passwordInput) passwordInput.value = 'password';
                                        handleLogin({ preventDefault: () => { } });
                                        // Since handleLogin is a mock in this component and doesn't explicitly call auth context, 
                                        // and the actual auth context usage is likely wrapped or handled differently in the full implementation,
                                        // we might need to simulate the user typing or direct the user to use the specific credentials.
                                        // For now, let's just pre-fill.
                                    }}
                                    className="text-sm text-[var(--accent-green)] hover:underline font-medium"
                                >
                                    Auto-fill Admin Credentials
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Register Form */}
                    {activeTab === 'register' && (
                        <form onSubmit={handleRegister} className="space-y-6 animate-fade-in-up">
                            {!otpSent ? (
                                <>
                                    <Input
                                        label="Full Name"
                                        placeholder="John Doe"
                                        icon={<User className="w-5 h-5" />}
                                    />
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        placeholder="john@example.com"
                                        icon={<Mail className="w-5 h-5" />}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Password"
                                            type="password"
                                            placeholder="••••••••"
                                            icon={<Lock className="w-5 h-5" />}
                                        />
                                        <Input
                                            label="Confirm"
                                            type="password"
                                            placeholder="••••••••"
                                            icon={<Lock className="w-5 h-5" />}
                                        />
                                    </div>

                                    <Button variant="primary" size="lg" className="w-full">
                                        Verify Email
                                    </Button>

                                    <div className="relative flex items-center gap-4 my-6">
                                        <div className="h-[1px] bg-[var(--border-subtle)] flex-1"></div>
                                        <span className="text-xs text-[var(--text-muted)] uppercase">Or sign up with</span>
                                        <div className="h-[1px] bg-[var(--border-subtle)] flex-1"></div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-[var(--border-subtle)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                            </svg>
                                            <span className="text-sm font-medium">Google</span>
                                        </button>
                                        <button type="button" className="flex items-center justify-center gap-2 py-2.5 border border-[var(--border-subtle)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors">
                                            <Facebook className="w-5 h-5 text-[#1877F2]" />
                                            <span className="text-sm font-medium">Facebook</span>
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-6 text-center animate-fade-in-up">
                                    <div className="mx-auto w-16 h-16 bg-[rgba(0,255,136,0.1)] rounded-full flex items-center justify-center text-[var(--accent-green)] mb-4">
                                        <Smartphone className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Verify your Email</h3>
                                        <p className="text-[var(--text-secondary)] text-sm">
                                            We've sent a 6-digit code to your email. Please enter it below.
                                        </p>
                                    </div>

                                    <div className="flex gap-2 justify-center">
                                        {[1, 2, 3, 4, 5, 6].map((i) => (
                                            <input
                                                key={i}
                                                type="text"
                                                maxLength={1}
                                                className="w-10 h-12 text-center text-xl font-bold bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-lg focus:border-[var(--accent-green)] focus:ring-2 focus:ring-[rgba(0,255,136,0.2)] focus:outline-none transition-all"
                                            />
                                        ))}
                                    </div>

                                    <p className="text-xs text-[var(--text-secondary)]">
                                        Didn't receive the code? <button type="button" className="text-[var(--accent-green)] hover:underline font-medium">Resend</button>
                                    </p>

                                    <Button variant="primary" size="lg" className="w-full">
                                        Complete Registration
                                    </Button>

                                    <button type="button" onClick={() => setOtpSent(false)} className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                                        Back
                                    </button>
                                </div>
                            )}
                        </form>
                    )}
                </Card>
            </div>

            <Footer />
        </>
    );
};
