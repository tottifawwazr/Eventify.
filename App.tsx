
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, MapPin, Calendar, X, CheckCircle2, Ticket as TicketIcon, Zap, Sun, Moon, ArrowRight, Share2, Menu, Github, Linkedin } from 'lucide-react';
import { Event, EventCategory, Ticket } from './types';
import { EVENTS } from './constants';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>(EventCategory.ALL);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [bookingStep, setBookingStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const savedTheme = localStorage.getItem('eventify_theme');
    if (savedTheme) {
      const isDark = savedTheme === 'dark';
      setIsDarkMode(isDark);
      document.documentElement.classList.toggle('dark', isDark);
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDarkMode;
    setIsDarkMode(newDark);
    document.documentElement.classList.toggle('dark', newDark);
    localStorage.setItem('eventify_theme', newDark ? 'dark' : 'light');
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 90;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      window.history.pushState(null, '', `#${id}`);
    }
  };

  useEffect(() => {
    const target = new Date();
    target.setDate(target.getDate() + 15);
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target.getTime() - now;
      
      if (distance < 0) {
        clearInterval(interval);
        return;
      }
      
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    const savedTickets = localStorage.getItem('eventify_tickets');
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets));
    }

    return () => clearInterval(interval);
  }, []);

  const filteredEvents = useMemo(() => {
    return EVENTS.filter(event => {
      const matchesCategory = selectedCategory === EventCategory.ALL || event.category === selectedCategory;
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            event.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  const handleOpenModal = (event: Event) => {
    setSelectedEvent(event);
    setBookingStep('form');
    setIsModalOpen(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;

    const encodedData = encodeURIComponent(`Name:${formData.name}|Email:${formData.email}|Event:${selectedEvent.title}`);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodedData}`;
    
    const newTicket: Ticket = {
      id: `TICK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      eventId: selectedEvent.id,
      eventTitle: selectedEvent.title,
      userName: formData.name,
      userEmail: formData.email,
      purchaseDate: new Date().toLocaleDateString(),
      qrUrl: qrUrl
    };

    const updatedTickets = [newTicket, ...tickets];
    setTickets(updatedTickets);
    localStorage.setItem('eventify_tickets', JSON.stringify(updatedTickets));
    
    setBookingStep('success');
  };

  const clearTickets = () => {
    if (window.confirm("Hapus semua riwayat tiket?")) {
      setTickets([]);
      localStorage.removeItem('eventify_tickets');
    }
  };

  const NavLinks = ({ className }: { className?: string }) => (
    <div className={className}>
      <a 
        href="#explore" 
        onClick={(e) => scrollToSection(e, 'explore')} 
        className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer font-bold uppercase tracking-widest text-[11px]"
      >
        Explore
      </a>
      <a 
        href="#my-tickets" 
        onClick={(e) => scrollToSection(e, 'my-tickets')} 
        className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer font-bold uppercase tracking-widest text-[11px]"
      >
        My Tickets
      </a>
    </div>
  );

  return (
    <div className="min-h-screen transition-colors duration-500 bg-[#F8FAFC] dark:bg-slate-950 selection:bg-indigo-100 dark:selection:bg-indigo-500/30">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass px-4 md:px-8 lg:px-12 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-indigo-600 p-2 md:p-2.5 rounded-xl shadow-lg shadow-indigo-600/30">
            <Zap className="text-white w-5 h-5 fill-white" />
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tighter dark:text-white text-slate-900 font-display text-nowrap">
            Eventify<span className="text-indigo-600">.</span>
          </span>
        </div>
        
        <NavLinks className="hidden lg:flex items-center gap-12 text-slate-500 dark:text-slate-400" />

        <div className="flex items-center gap-3 md:gap-4">
          <div className="relative hidden sm:block">
            <input 
              type="text" 
              placeholder="Search moments..."
              className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-40 md:w-64 lg:w-80 transition-all dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
          
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:scale-110 active:scale-95 transition-all shadow-sm"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-800"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsMenuOpen(false)}></div>
          
          {/* Sidebar Drawer */}
          <div className="absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white dark:bg-slate-900 p-8 shadow-2xl animate__animated animate__slideInRight animate__faster flex flex-col">
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <Zap className="text-white w-5 h-5 fill-white" />
                </div>
                <span className="text-xl font-black tracking-tighter dark:text-white text-slate-900 font-display">
                  Eventify<span className="text-indigo-600">.</span>
                </span>
              </div>
              <button onClick={() => setIsMenuOpen(false)} className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-colors">
                <X className="w-5 h-5 dark:text-white" />
              </button>
            </div>

            <div className="flex flex-col gap-8">
              <a href="#explore" onClick={(e) => scrollToSection(e, 'explore')} className="text-4xl font-black text-slate-900 dark:text-white hover:text-indigo-600 transition-colors">Explore</a>
              <a href="#my-tickets" onClick={(e) => scrollToSection(e, 'my-tickets')} className="text-4xl font-black text-slate-900 dark:text-white hover:text-indigo-600 transition-colors">My Tickets</a>
            </div>

            <div className="mt-auto pt-10 border-t border-slate-100 dark:border-slate-800">
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Quick Search</p>
               <div className="relative">
                <input 
                  type="text" 
                  placeholder="Find something magic..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl py-5 px-6 pl-14 text-base dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
              </div>
              
              <div className="mt-10 flex gap-4">
                 <a href="https://github.com/tottifawwazr" target="_blank" className="flex-1 bg-slate-100 dark:bg-slate-800 py-4 rounded-2xl flex items-center justify-center">
                    <Github className="w-5 h-5 dark:text-white" />
                 </a>
                 <a href="https://www.linkedin.com/in/totti-fawwaz-reda-46a42a28a" target="_blank" className="flex-1 bg-slate-100 dark:bg-slate-800 py-4 rounded-2xl flex items-center justify-center">
                    <Linkedin className="w-5 h-5 dark:text-white" />
                 </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <header className="relative pt-40 md:pt-56 pb-20 md:pb-32 px-6 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute top-0 -left-20 w-[400px] md:w-[800px] h-[400px] md:h-[800px] bg-indigo-600/5 dark:bg-indigo-600/10 blur-[120px] md:blur-[160px] rounded-full"></div>
        <div className="absolute bottom-0 -right-20 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-purple-600/5 dark:bg-purple-600/10 blur-[120px] md:blur-[160px] rounded-full"></div>

        <div className="max-w-6xl relative z-10">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-indigo-50 dark:bg-slate-800/50 border border-indigo-100 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 text-[11px] font-black uppercase tracking-[0.2em] mb-12 shadow-inner-soft animate__animated animate__fadeInDown">
            <Zap className="w-4 h-4 fill-current" /> Premium Event Discovery
          </div>
          
          <h1 className="text-5xl md:text-8xl lg:text-[9.5rem] font-black mb-10 leading-[0.95] text-slate-900 dark:text-white tracking-tighter animate__animated animate__fadeInUp font-display">
            The Hub of <br/>
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent italic">
              Magic Moments.
            </span>
          </h1>
          
          <p className="text-slate-500 dark:text-slate-400 text-lg md:text-2xl lg:text-3xl max-w-4xl mx-auto mb-16 leading-relaxed font-medium animate__animated animate__fadeInUp">
            The global portal for premium experiences. <br className="hidden md:block"/>
            Every ticket is a gateway to a new world.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 animate__animated animate__fadeInUp">
            <a 
              href="#explore" 
              onClick={(e) => scrollToSection(e, 'explore')}
              className="w-full sm:w-auto group bg-indigo-600 hover:bg-indigo-700 text-white px-12 py-6 rounded-3xl font-black text-xl transition-all transform hover:scale-105 hover:rotate-1 flex justify-center items-center gap-4 shadow-2xl shadow-indigo-600/40 cursor-pointer"
            >
              Explore Now <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </a>
            
            <div className="flex items-center gap-8 bg-white dark:bg-slate-800/40 backdrop-blur-md px-10 py-6 rounded-3xl border border-slate-200/60 dark:border-white/10 shadow-premium dark:shadow-2xl">
              {[
                { val: timeLeft.days, label: 'Days' },
                { val: timeLeft.hours, label: 'Hrs' },
                { val: timeLeft.minutes, label: 'Min' }
              ].map((time, idx) => (
                <React.Fragment key={time.label}>
                  <div className="flex flex-col items-center">
                    <span className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-none font-display">{time.val}</span>
                    <span className="text-[11px] text-slate-400 uppercase font-black tracking-[0.15em] mt-2.5">{time.label}</span>
                  </div>
                  {idx < 2 && <div className="h-12 md:h-14 w-[1px] bg-slate-200 dark:bg-white/10"></div>}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid Wrapper */}
      <div className="bg-slate-50/80 dark:bg-transparent transition-colors duration-500">
        <main className="max-w-7xl mx-auto px-6 space-y-32 md:space-y-48 pb-40 pt-10">
          
          {/* Events Section */}
          <section id="explore" className="scroll-mt-32">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20 md:mb-24">
              <div className="max-w-3xl">
                <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight font-display">Featured Highlights</h2>
                <p className="text-slate-500 dark:text-slate-400 text-xl md:text-2xl font-medium leading-relaxed">Curated experiences hand-picked for the global community.</p>
              </div>
              
              <div className="flex flex-wrap gap-3 p-2.5 bg-white dark:bg-slate-900/50 rounded-[28px] border border-slate-200 dark:border-slate-800 shadow-sm">
                {Object.values(EventCategory).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-8 py-3.5 rounded-2xl text-[13px] font-black transition-all tracking-wide ${
                      selectedCategory === cat 
                      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 scale-105' 
                      : 'text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14">
              {filteredEvents.map((event, idx) => (
                <div 
                  key={event.id} 
                  className="glass-card rounded-[48px] overflow-hidden hover-lift group animate__animated animate__fadeInUp"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="relative h-64 md:h-80 overflow-hidden p-5">
                    <img 
                      src={event.image} 
                      alt={event.title} 
                      className="w-full h-full object-cover rounded-[36px] transition-transform duration-1000 group-hover:scale-110 bg-slate-200 dark:bg-slate-800 shadow-inner"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                    <div className="absolute top-10 left-10 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md text-slate-950 dark:text-white px-5 py-3 rounded-2xl font-black flex flex-col items-center shadow-2xl border border-white/20">
                      <span className="text-3xl md:text-4xl leading-none font-display">{event.date}</span>
                      <span className="text-[11px] uppercase font-black text-indigo-600 mt-1.5 tracking-widest">{event.month}</span>
                    </div>
                    <div className="absolute bottom-10 right-10 bg-indigo-600/90 backdrop-blur-sm text-white px-6 py-2.5 rounded-2xl text-[12px] font-black uppercase tracking-[0.15em] shadow-xl">
                      {event.category}
                    </div>
                  </div>
                  
                  <div className="p-10 pt-6">
                    <h3 className="text-3xl md:text-4xl font-black mb-6 dark:text-white text-slate-900 leading-tight min-h-[5rem] tracking-tight font-display">{event.title}</h3>
                    <div className="space-y-5 mb-10">
                      <div className="flex items-center gap-5 text-slate-500 dark:text-slate-400 font-bold text-base md:text-lg">
                        <div className="bg-slate-100 dark:bg-indigo-500/10 p-3 rounded-xl shrink-0">
                          <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/10 pt-10">
                      <div>
                        <span className="block text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Price</span>
                        <span className="text-2xl md:text-3xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight font-display">{event.price}</span>
                      </div>
                      <button 
                        onClick={() => handleOpenModal(event)}
                        className="bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-indigo-600 dark:hover:bg-indigo-400 hover:text-white px-10 md:px-12 py-4 md:py-5 rounded-2xl font-black text-sm md:text-base transition-all shadow-xl hover:scale-105 active:scale-95 tracking-wide"
                      >
                        Book Ticket
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* My Tickets Section */}
          <section id="my-tickets" className="py-20 scroll-mt-32">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-20">
              <div>
                <h2 className="text-5xl md:text-7xl font-black dark:text-white text-slate-900 flex items-center gap-6 font-display">
                  <div className="bg-indigo-600 p-4 rounded-3xl shadow-xl shadow-indigo-600/30">
                    <TicketIcon className="w-10 h-10 text-white" />
                  </div>
                  My Tickets
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-xl font-medium mt-4">Your digital access to unforgettable moments.</p>
              </div>
              {tickets.length > 0 && (
                <button onClick={clearTickets} className="px-10 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-500 hover:border-red-500/30 transition-all text-[11px] font-black uppercase tracking-[0.2em] shadow-sm">
                  Purge History
                </button>
              )}
            </div>

            {tickets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14">
                {tickets.map((ticket, idx) => (
                  <div key={ticket.id} className="glass-card rounded-[48px] p-10 md:p-12 border-t-[12px] border-t-indigo-600 animate__animated animate__fadeInUp">
                    <div className="flex justify-between items-start gap-8 mb-12">
                      <div className="flex-1">
                        <h4 className="font-black text-slate-900 dark:text-white text-2xl md:text-3xl line-clamp-2 leading-tight mb-4 tracking-tight font-display">{ticket.eventTitle}</h4>
                        <span className="text-[11px] font-black font-mono text-slate-400 dark:text-slate-500 tracking-[0.3em]">{ticket.id}</span>
                      </div>
                      <div className="bg-white p-4 rounded-[32px] shadow-2xl shadow-indigo-500/10 shrink-0 border border-slate-100/50">
                        <img src={ticket.qrUrl} alt="QR Code" className="w-24 h-24 md:w-32 md:h-32 rounded-xl" />
                      </div>
                    </div>
                    <div className="pt-10 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
                      <div>
                        <span className="block text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Attendee</span>
                        <span className="text-base md:text-lg font-black text-slate-900 dark:text-white">{ticket.userName}</span>
                      </div>
                      <div className="text-right">
                        <span className="block text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] mb-2">Booked On</span>
                        <span className="text-base md:text-lg font-black text-slate-900 dark:text-white">{ticket.purchaseDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 md:py-48 bg-white/50 dark:bg-slate-900/20 rounded-[64px] border-2 border-dashed border-slate-200 dark:border-slate-800 shadow-inner-soft">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl">
                  <TicketIcon className="w-10 h-10 md:w-14 md:h-14 text-slate-300 dark:text-slate-600" />
                </div>
                <p className="text-slate-400 text-2xl md:text-3xl font-black mb-8">No tickets found.</p>
                <a 
                  href="#explore" 
                  onClick={(e) => scrollToSection(e, 'explore')}
                  className="bg-indigo-600 text-white px-10 py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] hover:scale-105 transition-all inline-block shadow-2xl shadow-indigo-600/30"
                >
                  Start Discovery
                </a>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-white/10 py-20 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-16">
          <div className="flex flex-col items-center md:items-start gap-8">
            <div className="flex items-center gap-4">
              <div className="bg-indigo-600 p-3 rounded-2xl shadow-xl shadow-indigo-600/30">
                <Zap className="text-white w-7 h-7 fill-white" />
              </div>
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter font-display uppercase italic">
                Eventify<span className="text-indigo-600">.</span>
              </span>
            </div>
            <p className="text-slate-400 dark:text-slate-500 text-lg font-medium text-center md:text-left max-w-sm leading-relaxed">
              Curating unforgettable experiences globally. One ticket, a thousand stories.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-8">
            <p className="text-slate-500 dark:text-slate-400 font-bold tracking-tight text-xl">
              Crafted by <span className="text-slate-900 dark:text-white font-black underline decoration-indigo-600/30 decoration-[6px] underline-offset-8">Totti Fawwaz Reda</span>
            </p>
            <div className="flex gap-6">
              <a 
                href="https://github.com/tottifawwazr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110 transition-all shadow-premium dark:shadow-sm border border-slate-200/60 dark:border-slate-700"
              >
                <Github className="w-6 h-6" />
              </a>
              <a 
                href="https://www.linkedin.com/in/totti-fawwaz-reda-46a42a28a" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110 transition-all shadow-premium dark:shadow-sm border border-slate-200/60 dark:border-slate-700"
              >
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-2xl animate-fade-in" onClick={closeModal}></div>
          
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[90vh] rounded-[48px] md:rounded-[64px] overflow-y-auto shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/20 animate__animated animate__zoomIn animate__faster">
            <button 
              onClick={closeModal}
              className="sticky top-6 float-right mr-6 md:top-8 md:mr-8 p-3 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 z-50"
            >
              <X className="w-6 h-6 md:w-7 md:h-7" />
            </button>

            {bookingStep === 'form' ? (
              <div className="p-8 md:p-16 lg:p-20 clear-both">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-10 mb-10 md:mb-14">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-[32px] md:rounded-[48px] overflow-hidden flex-shrink-0 shadow-2xl border-4 border-white dark:border-slate-800">
                    <img src={selectedEvent?.image} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] mb-4 font-display tracking-tight">{selectedEvent?.title}</h3>
                    <div className="flex items-center justify-center md:justify-start gap-3 md:gap-4">
                      <span className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] md:text-[12px] font-black uppercase rounded-xl md:rounded-2xl tracking-[0.15em]">{selectedEvent?.category}</span>
                      <span className="text-xl md:text-2xl font-black text-indigo-600 font-display">{selectedEvent?.price}</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleBooking} className="space-y-6 md:space-y-10">
                  <div className="space-y-6 md:space-y-8">
                    <div className="relative">
                      <label className="block text-[10px] md:text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] mb-3 md:mb-4">Full Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Type your name..."
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 rounded-[24px] md:rounded-[28px] px-6 md:px-8 py-5 md:py-6 dark:text-white text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-base md:text-xl font-bold placeholder:text-slate-300"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-[10px] md:text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] mb-3 md:mb-4">Email Address</label>
                      <input 
                        required
                        type="email" 
                        placeholder="hello@world.com"
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 rounded-[24px] md:rounded-[28px] px-6 md:px-8 py-5 md:py-6 dark:text-white text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-base md:text-xl font-bold placeholder:text-slate-300"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="pt-4 md:pt-8">
                    <button 
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 md:py-6 rounded-[28px] md:rounded-[32px] font-black text-lg md:text-xl transition-all shadow-2xl shadow-indigo-600/40 active:scale-95"
                    >
                      Confirm Booking
                    </button>
                    <p className="text-center text-[10px] md:text-[12px] text-slate-400 mt-6 md:mt-10 leading-relaxed font-black uppercase tracking-[0.2em]">
                      Ecological E-Ticket • Secured System
                    </p>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-8 md:p-16 lg:p-24 flex flex-col items-center text-center animate__animated animate__fadeIn clear-both">
                <div className="bg-emerald-500/20 p-6 md:p-8 rounded-full mb-8 md:mb-12 border-8 border-emerald-500/10 scale-110 md:scale-125">
                  <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16 text-emerald-500" />
                </div>
                <h3 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 md:mb-6 font-display tracking-tight">Confirmed!</h3>
                <p className="text-slate-500 dark:text-slate-400 text-lg md:text-2xl font-medium mb-10 md:mb-16 max-w-md">Your invitation to the future is here. See you there!</p>
                
                <div className="bg-white p-8 md:p-12 rounded-[48px] md:rounded-[64px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] mb-10 md:mb-16 relative group border border-slate-100 shrink-0">
                  <img 
                    src={tickets[0]?.qrUrl} 
                    alt="E-Ticket QR" 
                    className="w-48 h-48 md:w-72 md:h-72 relative z-10"
                  />
                  <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[48px] md:rounded-[64px]"></div>
                </div>

                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 mb-10 md:mb-16">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-slate-200/50 dark:border-slate-700/50 text-left">
                    <span className="block text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 md:mb-3">System Ref</span>
                    <span className="text-xs md:text-base font-black text-slate-900 dark:text-white font-mono break-all leading-tight tracking-tighter">{tickets[0]?.id}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-slate-200/50 dark:border-slate-700/50 text-left">
                    <span className="block text-[10px] md:text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 md:mb-3">Level</span>
                    <span className="text-xs md:text-base font-black text-emerald-600 uppercase tracking-widest">Active Access</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 md:gap-6 w-full">
                  <button 
                    onClick={closeModal}
                    className="flex-1 bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-5 md:py-6 rounded-[24px] md:rounded-[32px] font-black text-lg md:text-xl transition-all shadow-2xl active:scale-95"
                  >
                    Done
                  </button>
                  <button className="flex justify-center items-center p-5 md:p-6 rounded-[24px] md:rounded-[32px] bg-indigo-600 text-white hover:bg-indigo-700 transition-all shadow-xl">
                    <Share2 className="w-6 h-6 md:w-7 md:h-7" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
