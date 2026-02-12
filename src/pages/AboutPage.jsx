import { Navbar, Footer } from '../components/LandingPage';
import { Users, Target, Heart, Trophy, Star, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui';

import kirstenImg from '../assets/images/kirs.jpg';
import aaronImg from '../assets/images/aaronImg.jpg';
import crisImg from '../assets/images/crisImg.jpg';
import rbeeImg from '../assets/images/rbeeImg.jpg';






export const AboutPage = () => {
    const teamMembers = [
        {
            name: 'Aaron',
            role: 'Co-Founder & CEO',
            image: aaronImg,
            bio: ''
        },
        {
            name: 'Cris',
            role: 'Head of Operations',
            image: crisImg, // Using specific seeds for consistent avatars
            bio: ''
        },
        {
            name: 'Kirsten',
            role: 'Community Directior',
            image: kirstenImg,
            bio: ''
        },
        {
            name: 'Rbee',
            role: 'Technical Lead',
            image: rbeeImg,
            bio: ''
        }
    ];

    return (
        <>
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[rgba(0,255,136,0.05)] -z-10"></div>
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                    <div className="absolute top-20 right-10 w-96 h-96 hero-orb-green rounded-full blur-[120px] opacity-50"></div>
                    <div className="absolute bottom-20 left-10 w-72 h-72 hero-orb-blue rounded-full blur-[120px] opacity-50"></div>
                </div>

                <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        About <span className="text-gradient-green">SportsPlex</span>
                    </h1>
                    <p className="text-xl text-[var(--text-secondary)] leading-relaxed">
                        We are more than just a sports facility. We are a community dedicated to the pursuit of excellence, health, and the joy of the game.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Mission */}
                    <div className="bg-[var(--bg-secondary)] p-8 rounded-2xl border border-[var(--border-subtle)] hover:border-[var(--accent-green)] transition-all duration-300 group">
                        <div className="w-12 h-12 bg-[var(--bg-tertiary)] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Target className="w-6 h-6 text-[var(--accent-green)]" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                        <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                            To provide a state-of-the-art facility for athletes of all levels, fostering a supportive environment where passion meets performance. We strive to make premium sports accessible to everyone.
                        </p>
                    </div>

                    {/* Vision */}
                    <div className="bg-[var(--bg-secondary)] p-8 rounded-2xl border border-[var(--border-subtle)] hover:border-[var(--accent-green)] transition-all duration-300 group">
                        <div className="w-12 h-12 bg-[var(--bg-tertiary)] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Star className="w-6 h-6 text-[var(--accent-green)]" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
                        <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
                            To be the premier sports destination that inspires a healthier, more connected community through the power of sports and recreation.
                        </p>
                    </div>
                </div>
            </section>

            {/* Meet the Team */}
            <section className="py-24 px-6 bg-[var(--bg-secondary)] relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--border-emphasis)] to-transparent"></div>

                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">Meet the <span className="text-gradient-green">Team</span></h2>
                        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
                            The passionate individuals working behind the scenes to bring you the best sports experience.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, index) => (
                            <Card key={index} variant="glass" hover="lift" className="text-center p-6 border-[var(--border-subtle)]">
                                <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-2 border-[var(--accent-green)] p-1">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full rounded-full bg-[var(--bg-tertiary)]"
                                    />
                                </div>
                                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                                <p className="text-[var(--accent-green)] text-sm font-medium mb-4">{member.role}</p>
                                <p className="text-[var(--text-muted)] text-sm">{member.bio}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold">Core <span className="text-gradient-green">Values</span></h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="p-6">
                            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] rounded-2xl flex items-center justify-center mb-6 text-[var(--accent-green)]">
                                <Heart className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Passion</h3>
                            <p className="text-[var(--text-muted)]">We pour our hearts into everything we do, ensuring every detail is perfect for our members.</p>
                        </div>
                        <div className="p-6">
                            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] rounded-2xl flex items-center justify-center mb-6 text-[var(--accent-green)]">
                                <Trophy className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Excellence</h3>
                            <p className="text-[var(--text-muted)]">We strive for the highest standards in our facilities, service, and operations.</p>
                        </div>
                        <div className="p-6">
                            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-tertiary)] rounded-2xl flex items-center justify-center mb-6 text-[var(--accent-green)]">
                                <Users className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Community</h3>
                            <p className="text-[var(--text-muted)]">We believe in building a strong, inclusive community through the shared love of sports.</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
};
