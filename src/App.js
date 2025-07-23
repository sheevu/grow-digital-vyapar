import React, { useState, useEffect, useRef } from 'react';

const sections = [
  'hero','about','features','ai-marketing-assistant',
  'seo-keyword-suggester','services','initiatives',
  'testimonials','contact'
];

const App = () => {
  const sectionsRef = useRef([]);
  const [activeSection, setActiveSection] = useState('');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Intersection Observer for nav highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );
    sectionsRef.current.forEach(sec => sec && observer.observe(sec));
    return () => {
      sectionsRef.current.forEach(sec => sec && observer.unobserve(sec));
    };
  }, []);

  // Testimonials auto-rotate
  const testimonials = [
    { text: "Sudarshan AI Labs is the best!", rating: 5 },
    { text: "Amazing experience!", rating: 5 },
    { text: "Highly recommend!", rating: 5 }
  ];
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="font-sans text-gray-900 bg-gray-50 antialiased">
      <header className="fixed w-full bg-white shadow z-50">
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-2xl font-bold">Sudarshan AI Labs</div>
          <ul className="hidden md:flex space-x-6">
            {sections.map(id => (
              <li key={id}>
                <button
                  onClick={() => scrollTo(id)}
                  className={activeSection === id ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}
                >
                  {id.replace(/-/g,' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="pt-16">
        {sections.map((id, idx) => (
          <section
            key={id}
            id={id}
            ref={el => (sectionsRef.current[idx] = el)}
            className="min-h-screen flex items-center justify-center"
          >
            <h2 className="text-4xl font-bold">{id.replace(/-/g,' ').toUpperCase()}</h2>
          </section>
        ))}

        <section id="testimonials" className="py-16 bg-gray-100 text-center">
          <h3 className="text-2xl font-bold mb-4">Testimonials</h3>
          <p className="italic mb-2">"{testimonials[currentTestimonial].text}"</p>
          <div>
            {Array(testimonials[currentTestimonial].rating).fill('★').join(' ')}
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-6 text-center">
        &copy; {new Date().getFullYear()} Sudarshan AI Labs. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
