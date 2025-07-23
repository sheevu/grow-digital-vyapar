import React, { useState, useEffect, useRef } from 'react';

const App = () => {
  const sectionsRef = useRef([]);
  const [activeSection, setActiveSection] = useState('');
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [generatedCopy, setGeneratedCopy] = useState('');
  const [isLoadingMarketing, setIsLoadingMarketing] = useState(false);
  const [marketingError, setMarketingError] = useState('');

  const [businessType, setBusinessType] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [generatedKeywords, setGeneratedKeywords] = useState('');
  const [isLoadingSEO, setIsLoadingSEO] = useState(false);
  const [seoError, setSeoError] = useState('');

  const [websiteURL, setWebsiteURL] = useState('');
  const [analysisOutput, setAnalysisOutput] = useState('');
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState('');

  // New state for Content Idea Generator
  const [contentTopic, setContentTopic] = useState('');
  const [contentFormat, setContentFormat] = useState('blog post ideas');
  const [generatedContentIdeas, setGeneratedContentIdeas] = useState('');
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [contentError, setContentError] = useState('');

  // Smooth scroll to section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Intersection Observer for active section highlighting
  useEffect(() => {
    const currentSections = sectionsRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    currentSections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      currentSections.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  // Marketing AI
  const generateMarketingCopy = async () => {
    setIsLoadingMarketing(true);
    setMarketingError('');
    setGeneratedCopy('');

    if (!productName || !productDescription) {
      setMarketingError("Please provide both a product/service name and a description.");
      setIsLoadingMarketing(false);
      return;
    }

    const prompt = `Generate compelling marketing copy for a product or service.
Product/Service Name: ${productName}
Description: ${productDescription}

Please provide:
1. A catchy headline.
2. A short social media post (for platforms like Instagram/Facebook).
3. A brief ad copy (for platforms like Google Ads/WhatsApp marketing).
4. A concise, benefit-driven description (2-3 sentences).`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] })
        }
      );
      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) setGeneratedCopy(text);
      else setMarketingError("Failed to generate copy. Please try again.");
    } catch (err) {
      setMarketingError("An error occurred while connecting to the AI. Please try again.");
      console.error(err);
    } finally {
      setIsLoadingMarketing(false);
    }
  };

  // SEO AI
  const generateSEOKeywords = async () => {
    setIsLoadingSEO(true);
    setSeoError('');
    setGeneratedKeywords('');

    if (!businessType) {
      setSeoError("Please provide a business type.");
      setIsLoadingSEO(false);
      return;
    }

    let prompt = `Generate a list of highly relevant SEO keywords for a business.
Business Type: ${businessType}`;
    if (targetAudience) prompt += `\nTarget Audience: ${targetAudience}`;
    prompt += `

Please provide:
- 5-7 short-tail keywords (1-2 words)
- 8-10 long-tail keywords (3+ words)
- 3-5 related customer questions
Format as a bulleted list.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] })
        }
      );
      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) setGeneratedKeywords(text);
      else setSeoError("Failed to generate keywords. Please try again.");
    } catch (err) {
      setSeoError("An error occurred while connecting to the AI. Please try again.");
      console.error(err);
    } finally {
      setIsLoadingSEO(false);
    }
  };

  // Site Analysis AI
  const analyzeWebsite = async () => {
    setIsLoadingAnalysis(true);
    setAnalysisError('');
    setAnalysisOutput('');

    if (!websiteURL) {
      setAnalysisError("Please enter a website URL to analyze.");
      setIsLoadingAnalysis(false);
      return;
    }

    try {
      new URL(websiteURL);
    } catch {
      setAnalysisError("Please enter a valid URL (e.g., https://example.com).");
      setIsLoadingAnalysis(false);
      return;
    }

    const prompt = `Analyze the following website URL for its SEO, content quality, and user experience. Provide actionable insights and suggestions.
Website URL: ${websiteURL}

Structure your analysis:
1. Overall Impression
2. SEO Analysis
3. Content Quality
4. User Experience
5. Actionable Recommendations`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] })
        }
      );
      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) setAnalysisOutput(text);
      else setAnalysisError("Failed to analyze website. Please try again.");
    } catch (err) {
      setAnalysisError("An error occurred while connecting to the AI. Please try again.");
      console.error(err);
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  // Content Ideas AI
  const generateContentIdeas = async () => {
    setIsLoadingContent(true);
    setContentError('');
    setGeneratedContentIdeas('');

    if (!contentTopic) {
      setContentError("Please provide a content topic.");
      setIsLoadingContent(false);
      return;
    }

    const prompt = `Generate 5-7 unique and engaging content ideas.
Topic: ${contentTopic}
Format: ${contentFormat}

Provide:
- A catchy title
- 1-2 sentence description
- Relevant keywords/hashtags
Numbered list.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] })
        }
      );
      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) setGeneratedContentIdeas(text);
      else setContentError("Failed to generate content ideas. Please try again.");
    } catch (err) {
      setContentError("An error occurred while connecting to the AI. Please try again.");
      console.error(err);
    } finally {
      setIsLoadingContent(false);
    }
  };

  // Icon components
  const IconGoogle = () => <svg /* ... */ />;
  const IconRupee = () => <svg /* ... */ />;
  const IconStore = () => <svg /* ... */ />;
  const IconUdyam = () => <svg /* ... */ />;
  const IconCRM = () => <svg /* ... */ />;
  const IconOnlinePresence = () => <svg /* ... */ />;
  const IconOrderManagement = () => <svg /* ... */ />;
  const IconInventory = () => <svg /* ... */ />;
  const IconMarketplace = () => <svg /* ... */ />;
  const IconAnalytics = () => <svg /* ... */ />;
  const IconAutomation = () => <svg /* ... */ />;
  const IconCustomerExperience = () => <svg /* ... */ />;
  const IconCostReduction = () => <svg /* ... */ />;
  const IconGrowth = () => <svg /* ... */ />;
  const IconAI = () => <svg /* ... */ />;
  const IconEducation = () => <svg /* ... */ />;
  const IconSafety = () => <svg /* ... */ />;
  const IconCommunication = () => <svg /* ... */ />;
  const IconInnovation = () => <svg /* ... */ />;
  const IconWebsite = () => <svg /* ... */ />;
  const IconLandingPage = () => <svg /* ... */ />;
  const IconSocialMedia = () => <svg /* ... */ />;
  const IconSEO = () => <svg /* ... */ />;
  const IconWhatsApp = () => <svg /* ... */ />;
  const IconWriting = () => <svg /* ... */ />;
  const IconResume = () => <svg /* ... */ />;
  const IconConsultation = () => <svg /* ... */ />;
  const IconSiteAnalysis = () => <svg /* ... */ />;
  const IconContentIdea = () => <svg /* ... */ />;

  const ServiceCard = ({ icon: Icon, title, price, details }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
      <div className="p-3 bg-blue-100 rounded-full text-blue-600 mb-4">
        <Icon size={30} />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-blue-600 font-bold text-lg mb-2">{price}</p>
      <p className="text-gray-600 text-sm">{details}</p>
      <a href="https://www.sudarshan-ai-labs.com/" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
        Learn More
      </a>
    </div>
  );

  const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
      <div className="p-3 bg-green-100 rounded-full text-green-600 mb-4">
        <Icon size={30} />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );

  const InitiativeCard = ({ icon: Icon, title, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 text-center">
      <div className="p-3 bg-purple-100 rounded-full text-purple-600 mb-4">
        <Icon size={30} />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );

  const StatCard = ({ value, label, icon: Icon, colorClass }) => (
    <div className={`flex flex-col items-center p-6 rounded-xl shadow-lg ${colorClass} text-white`}>
      <Icon size={40} className="mb-3" />
      <div className="text-4xl font-bold mb-1">{value}</div>
      <p className="text-sm text-center">{label}</p>
    </div>
  );

  const testimonials = [
    { text: "Sudarshan AI Labs is the best! ...", rating: 5 },
    { text: "Amazing experience! ...", rating: 5 },
    { text: "I’m so happy I chose ...", rating: 5 },
    { text: "If you want to grow ...", rating: 5 },
    { text: "Very satisfied! ...", rating: 5 },
  ];
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="font-sans text-gray-900 bg-gray-50 antialiased">
      <script src="https://cdn.tailwindcss.com"></script>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      <style>{`
        body { font-family: 'Inter', sans-serif; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
      `}</style>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow z-50">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="https://www.sudarshan-ai-labs.com/" className="flex items-center space-x-2">
            <img src="https://placehold.co/40x40/4F46E5/FFFFFF?text=AI" className="rounded-full" alt="Logo" />
            <span className="text-2xl font-bold text-blue-700">Sudarshan AI Labs</span>
          </a>
          <ul className="hidden md:flex space-x-6">
            {['hero','about','features','ai-marketing-assistant','seo-keyword-suggester','services','initiatives','testimonials','contact'].map(id => (
              <li key={id}>
                <a href={`#${id}`} onClick={() => scrollToSection(id)}
                   className={`text-gray-600 hover:text-blue-600 ${activeSection===id?'text-blue-600 font-semibold':''}`}>
                  {id.replace(/-/g,' ').replace(/\b\w/g,m=>m.toUpperCase())}
                </a>
              </li>
            ))}
          </ul>
          <a href="https://www.sudarshan-ai-labs.com/" className="hidden md:inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Launch Your Business
          </a>
        </nav>
      </header>

      <main className="pt-20">
        {/* Hero */}
        <section id="hero" ref={el => sectionsRef.current[0]=el}
                 className="relative h-screen flex items-center justify-center text-center text-white"
                 style={{ background: 'linear-gradient(270deg,#667eea,#764ba2,#667eea)', backgroundSize:'200% 200%', animation:'fadeIn 10s ease infinite' }}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 px-6 animate-fadeIn max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
              Sudarshan AI Portal – India's <span className="text-yellow-300">₹89 Digital Revolution</span>!
            </h1>
            <p className="mb-8">Empowering 600M+ users with accessible, AI-driven tools.</p>
            <a href="https://www.sudarshan-ai-labs.com/" className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-full font-bold hover:bg-yellow-500">
              Launch Your Dukan for ₹89 Now!
            </a>
          </div>
        </section>

        {/* About */}
        <section id="about" ref={el => sectionsRef.current[1]=el} className="py-16 bg-white">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
            <div className="animate-fadeIn">
              <h2 className="text-3xl font-bold mb-4">About Sudarshan AI Labs</h2>
              <p className="mb-4">India’s premier AI innovation hub, empowering MSMEs with no-code AI tools to bridge the digital divide and drive growth.</p>
              <p>Focusing on 50M+ offline businesses, we deliver affordable, intuitive SaaS solutions for a 600M-strong community.</p>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg animate-fadeIn">
              <img src="https://placehold.co/800x600/6B46C1/FFFFFF?text=AI+Innovation" alt="AI Innovation Hub"
                   className="w-full h-full object-cover"/>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" ref={el => sectionsRef.current[2]=el} className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard icon={IconOnlinePresence} title="Online Presence" description="List your shop online quickly."/>
              <FeatureCard icon={IconOrderManagement} title="Order Management" description="Unified dashboard for all orders."/>
              <FeatureCard icon={IconInventory} title="Real-Time Inventory" description="Track stock and avoid stockouts."/>
              <FeatureCard icon={IconAnalytics} title="Smart Analytics" description="Actionable insights in Hindi."/>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" ref={el => sectionsRef.current[5]=el} className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ServiceCard icon={IconStore} title="Online Store" price="₹89" details="Ready in minutes."/>
              <ServiceCard icon={IconLandingPage} title="Landing Pages" price="₹1500" details="Conversion-focused designs."/>
              <ServiceCard icon={IconSEO} title="SEO & Content" price="from ₹1499/mo" details="Boost your rankings."/>
            </div>
          </div>
        </section>

        {/* Initiatives */}
        <section id="initiatives" ref={el => sectionsRef.current[6]=el} className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Flagship AI Initiatives</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <InitiativeCard icon={IconAI} title="Kisaan Sathi AI" description="Voice advisory for farmers in local languages."/>
              <InitiativeCard icon={IconStore} title="Kirana AI" description="OCR-based inventory & WhatsApp CRM."/>
              <InitiativeCard icon={IconEducation} title="Vishnu's Vision GPT" description="Free AI education modules."/>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" ref={el => sectionsRef.current[7]=el} className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">What Our Clients Say</h2>
            <div className="max-w-xl mx-auto animate-fadeIn">
              <p className="italic mb-4">"{testimonials[currentTestimonial].text}"</p>
              <div className="mb-4">
                {[...Array(testimonials[currentTestimonial].rating)].map((_,i)=><span key={i} className="text-yellow-400">★</span>)}
              </div>
            </div>
          </div>
        </section>

        {/* Content AI */}
        <section id="content-idea-generator" ref={el => sectionsRef.current[8]=el} className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 max-w-xl">
            <h2 className="text-3xl font-bold text-center mb-4">✨ Content Idea Generator ✨</h2>
            <p className="text-center mb-6">Get AI-generated content topics for your business.</p>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <input type="text" className="w-full border p-2 mb-4" placeholder="Topic" value={contentTopic} onChange={e=>setContentTopic(e.target.value)}/>
              <select className="w-full border p-2 mb-4" value={contentFormat} onChange={e=>setContentFormat(e.target.value)}>
                <option>blog post ideas</option>
                <option>social media post ideas</option>
                <option>video script ideas</option>
              </select>
              <button onClick={generateContentIdeas} disabled={isLoadingContent}
                      className="w-full bg-blue-600 text-white p-2 rounded mb-4">
                {isLoadingContent?'Loading…':'Generate Ideas'}
              </button>
              {contentError && <p className="text-red-500 mb-2">{contentError}</p>}
              {generatedContentIdeas && <pre className="bg-gray-100 p-2 rounded">{generatedContentIdeas}</pre>}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" ref={el => sectionsRef.current[9]=el} className="py-16 bg-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Grow Online?</h2>
          <a href="https://www.sudarshan-ai-labs.com/" className="bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700">
            Book a Free 15-min Audit
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Sudarshan AI Labs. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
};

export default App;
