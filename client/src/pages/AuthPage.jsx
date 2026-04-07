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

    const [userType, setUserType] = useState('user');
    const [showPassword, setShowPassword] = useState(false);
    const [otpSent, setOtpSent] = useState(false);

    // Controlled form state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const toggleTab = (tab) => {
        setActiveTab(tab);
        setOtpSent(false);
        setLoginError('');
        setRegError('');
        setRegSuccess('');
    };

    const { login, register } = useAuth();
    const navigate = useNavigate();

    // Registration state
    const [regName, setRegName] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');
    const [regConfirmPassword, setRegConfirmPassword] = useState('');
    const [regError, setRegError] = useState('');
    const [regSuccess, setRegSuccess] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoginError('');
        setIsSubmitting(true);

        const result = await login(email, password);

        setIsSubmitting(false);

        if (!result || !result.success) {
            setLoginError(result?.message || 'Login failed. Please check your credentials.');
            return;
        }

        // Redirect based on the actual role returned from the server
        const role = result.role;
        if (role === 'admin' || role === 'staff') {
            navigate('/admin/dashboard');
        } else {
            navigate('/dashboard');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setRegError('');
        setRegSuccess('');

        if (regPassword !== regConfirmPassword) {
            setRegError('Passwords do not match');
            return;
        }

        setIsRegistering(true);
        const result = await register(regName, regEmail, regPassword, '');
        setIsRegistering(false);

        if (!result.success) {
            setRegError(result.message);
        } else {
            setRegSuccess('Registration successful! You can now log in.');
            // Switch to login tab after brief delay
            setTimeout(() => {
                toggleTab('login');
                setEmail(regEmail);
                setPassword('');
            }, 2000);
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
                                label="Email"
                                type="email"
                                placeholder="Enter your email (e.g. you@gmail.com)"
                                icon={<Mail className="w-5 h-5" />}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
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
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
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

                            {loginError && (
                                <p className="text-red-500 text-sm text-center">{loginError}</p>
                            )}

                            <Button variant="primary" size="lg" className="w-full" icon={<ArrowRight className="w-5 h-5" />} disabled={isSubmitting}>
                                {isSubmitting ? 'Logging in...' : 'Log In'}
                            </Button>

                            <div className="text-center">
                                <span className="text-sm text-[var(--text-secondary)]">Demo Access: </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEmail('raphael@sportsplex.com');
                                        setPassword('password123');
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
                                        value={regName}
                                        onChange={(e) => setRegName(e.target.value)}
                                        required
                                    />
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        placeholder="john@example.com"
                                        icon={<Mail className="w-5 h-5" />}
                                        value={regEmail}
                                        onChange={(e) => setRegEmail(e.target.value)}
                                        required
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            label="Password"
                                            type="password"
                                            placeholder="••••••••"
                                            icon={<Lock className="w-5 h-5" />}
                                            value={regPassword}
                                            onChange={(e) => setRegPassword(e.target.value)}
                                            required
                                            minLength={6}
                                        />
                                        <Input
                                            label="Confirm"
                                            type="password"
                                            placeholder="••••••••"
                                            icon={<Lock className="w-5 h-5" />}
                                            value={regConfirmPassword}
                                            onChange={(e) => setRegConfirmPassword(e.target.value)}
                                            required
                                            minLength={6}
                                        />
                                    </div>

                                    {regError && <p className="text-red-500 text-sm text-center">{regError}</p>}
                                    {regSuccess && <p className="text-[#00ff88] text-sm text-center">{regSuccess}</p>}

                                    <Button variant="primary" size="lg" className="w-full" disabled={isRegistering}>
                                        {isRegistering ? 'Creating Account...' : 'Create Account'}
                                    </Button>


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
