import { Navbar, Footer } from '../components/LandingPage';
import { Mail, Phone, MapPin, Send, Facebook } from 'lucide-react';
import { Card, Button, Input } from '../components/ui';
import kirstenImg from '../assets/images/kirs.jpg';
import rbeeImg from '../assets/images/rbeeImg.jpg';
import aaronImg from '../assets/images/aaronImg.jpg';
import crisImg from '../assets/images/crisImg.jpg';


export const ContactPage = () => {
    const teamContacts = [
        {
            name: 'Aaron Escandor',
            role: 'Co-Founder & CEO',
            email: 'aaron_escandor@dlsu.edu.ph',
            fbLink: 'https://www.facebook.com/aaron.escandor',
            phone: '+63 917 123 4567',
            image: aaronImg
        },
        {
            name: 'Cris Delacruz',
            role: 'Head of Operations',
            email: 'cris_delacruz@dlsu.edu.ph',
            fbLink: 'https://www.facebook.com/cj.delacruz.334491/',
            phone: '+63 917 345 6767',
            image: crisImg
        },
        {
            name: 'Julia Kirsten Palomo',
            role: 'Community Director',
            email: 'julia_palomo@dlsu.edu.ph',
            fbLink: 'https://www.facebook.com/JuliaKirstenPalomo',
            phone: '+63 917 456 7867',
            image: kirstenImg
        },
        {
            name: 'Raphael Maagma',
            role: 'Technical Lead',
            email: 'raphael_maagma@dlsu.edu.ph',
            fbLink: 'https://www.facebook.com/RbeeMaagma13',
            phone: '+63 917 234 5667',
            image: rbeeImg
        }
    ];

    return (
        <>
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6">
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] to-[var(--bg-secondary)] -z-10"></div>
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl font-bold mb-6">
                        Get in <span className="text-gradient-green">Touch</span>
                    </h1>
                    <p className="text-xl text-[var(--text-secondary)]">
                        Have questions or need assistance? Reach out to our team directly.
                    </p>
                </div>
            </section>

            {/* Team Contacts */}
            <section className="py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamContacts.map((member, index) => (
                            <Card key={index} variant="elevated" hover="lift" className="p-6 text-center group">
                                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-[var(--accent-green)] p-1">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full rounded-full bg-[var(--bg-tertiary)]"
                                    />
                                </div>
                                <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                                <p className="text-[var(--text-muted)] text-sm mb-6">{member.role}</p>

                                <div className="space-y-4 text-left">
                                    <a href={member.fbLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[#1877F2] transition-colors p-2 rounded-lg hover:bg-[var(--bg-tertiary)]">
                                        <Facebook className="w-5 h-5 flex-shrink-0" />
                                        <span className="text-sm truncate">Facebook Profile</span>
                                    </a>

                                    <a href={`mailto:${member.email}`} className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--accent-green)] transition-colors p-2 rounded-lg hover:bg-[var(--bg-tertiary)]">
                                        <Mail className="w-5 h-5 flex-shrink-0" />
                                        <span className="text-sm truncate" title={member.email}>{member.email}</span>
                                    </a>

                                    <a href={`tel:${member.phone}`} className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--accent-green)] transition-colors p-2 rounded-lg hover:bg-[var(--bg-tertiary)]">
                                        <Phone className="w-5 h-5 flex-shrink-0" />
                                        <span className="text-sm">{member.phone}</span>
                                    </a>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* General Contact Form & Info */}
            <section className="py-16 px-6 bg-[var(--bg-secondary)]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Contact Form */}
                    <div>
                        <h2 className="text-3xl font-bold mb-8">Send us a Message</h2>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input label="First Name" placeholder="John" />
                                <Input label="Last Name" placeholder="Doe" />
                            </div>
                            <Input type="email" label="Email" placeholder="john@example.com" />
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-medium text-[var(--text-secondary)]">Message</label>
                                <textarea
                                    className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-subtle)] rounded-[var(--radius-md)] px-4 py-3 text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-green)] focus:ring-2 focus:ring-[rgba(0,255,136,0.2)] transition-all min-h-[150px] resize-y"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>
                            <Button variant="primary" size="lg" className="w-full" icon={<Send className="w-5 h-5" />}>
                                Send Message
                            </Button>
                        </form>
                    </div>

                    {/* General Info */}
                    <div className="flex flex-col justify-center">
                        <h2 className="text-3xl font-bold mb-8">Visit Us</h2>
                        <Card variant="glass" className="p-8 space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-[rgba(0,255,136,0.1)] rounded-xl flex items-center justify-center text-[var(--accent-green)] flex-shrink-0">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Location</h3>
                                    <p className="text-[var(--text-secondary)]">
                                        123 Sports Avenue, <br />
                                        University District, Manila
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-[rgba(0,255,136,0.1)] rounded-xl flex items-center justify-center text-[var(--accent-green)] flex-shrink-0">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">General Inquiries</h3>
                                    <p className="text-[var(--text-secondary)]">info@sportsplex.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-[rgba(0,255,136,0.1)] rounded-xl flex items-center justify-center text-[var(--accent-green)] flex-shrink-0">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2">Front Desk</h3>
                                    <p className="text-[var(--text-secondary)]">+63 (02) 8123 4567</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
};
