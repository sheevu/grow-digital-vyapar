import React, { useState, useEffect, useRef, useCallback } from 'react';

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


  // Smooth scroll to section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Intersection Observer for active section highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  // Function to call Gemini API for marketing copy generation
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

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const payload = { contents: chatHistory };
    const apiKey = ""; // If you want to use models other than gemini-2.0-flash or imagen-3.0-generate-002, provide an API key here. Otherwise, leave this as-is.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setGeneratedCopy(text);
      } else {
        setMarketingError("Failed to generate copy. Please try again.");
        console.error("Gemini API response was unexpected:", result);
      }
    } catch (err) {
      setMarketingError("An error occurred while connecting to the AI. Please check your network and try again.");
      console.error("Error calling Gemini API:", err);
    } finally {
      setIsLoadingMarketing(false);
    }
  };

  // Function to call Gemini API for SEO keyword generation
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
    if (targetAudience) {
      prompt += `\nTarget Audience: ${targetAudience}`;
    }
    prompt += `\n\nPlease provide:
    - 5-7 short-tail keywords (1-2 words)
    - 8-10 long-tail keywords (3+ words)
    - 3-5 related questions customers might ask
    Format as a bulleted list.`;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const payload = { contents: chatHistory };
    const apiKey = ""; // If you want to use models other than gemini-2.0-flash or imagen-3.0-generate-002, provide an API key here. Otherwise, leave this as-is.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setGeneratedKeywords(text);
      } else {
        setSeoError("Failed to generate keywords. Please try again.");
        console.error("Gemini API response was unexpected:", result);
      }
    } catch (err) {
      setSeoError("An error occurred while connecting to the AI. Please check your network and try again.");
      console.error("Error calling Gemini API:", err);
    } finally {
      setIsLoadingSEO(false);
    }
  };


  // Icon components (using inline SVG for simplicity and control)
  const IconGoogle = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  );
  const IconRupee = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-indian-rupee"><path d="M6 3h12"/><path d="M6 8h12"/><path d="m6 13 8.5 8"/><path d="M14 13H4a4 4 0 0 0 4 4h2a4 4 0 0 1 4 4v-8a4 4 0 0 0-4-4H6"/></svg>
  );
  const IconStore = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shop"><path d="M2 7h20"/><path d="M6 2h12"/><path d="M12 22v-4"/><path d="M8 6v14a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6"/><path d="M12 22v-4"/><path d="M16 6v14a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V6"/></svg>
  );
  const IconUdyam = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-award"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17.76 2.54l1.714 1.715L22 8l-2.81 2.81a5.999 5.999 0 0 1-6.717 0L2 8l2.54-1.76 1.715-1.714L8 2l2.81 2.81a5.999 5.999 0 0 1 6.717 0L22 8l-2.81 2.81a5.999 5.999 0 0 1-6.717 0L2 8l2.54-1.76 1.715-1.714L8 2l2.81 2.81a5.999 5.999 0 0 1 6.717 0Z"/></svg>
  );
  const IconCRM = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-users"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  );
  const IconOnlinePresence = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-monitor-dot"><circle cx="12" cy="12" r="1"/><path d="M19 3H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4l2 3h2l2-3h4a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"/></svg>
  );
  const IconOrderManagement = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-clipboard-list"><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
  );
  const IconInventory = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-boxes"><path d="M2.97 12.93A2 2 0 0 0 2 14v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-.97-1.07l-7.24-3.62A2 2 0 0 0 12 9a2 2 0 0 0-1.79.93Z"/><path d="m2.97 7.93 7.24 3.62A2 2 0 0 0 12 12a2 2 0 0 0 1.79-.93l7.24-3.62A2 2 0 0 0 22 6V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v4a2 2 0 0 0 .97 1.93Z"/><path d="M2.97 17.93 10.21 21.58A2 2 0 0 0 12 22a2 2 0 0 0 1.79-.93l7.24-3.62A2 2 0 0 0 22 16v-4a2 2 0 0 0-.97-1.07L13.79 7.38A2 2 0 0 0 12 7a2 2 0 0 0-1.79.93L2.97 12.93A2 2 0 0 0 2 14v4a2 2 0 0 0 .97 1.93Z"/></svg>
  );
  const IconMarketplace = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-cart"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
  );
  const IconAnalytics = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bar-chart-2"><path d="M18 20V10"/><path d="M12 20V4"/><path d="M6 20v-6"/></svg>
  );
  const IconAutomation = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-robot"><path d="M10 2H6a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4"/><path d="M14 2h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4"/><path d="M2 12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M12 15v4"/><path d="M12 19H8"/><path d="M16 19h-4"/><path d="M18 19h2a2 2 0 0 1 2 2v1H2v-1a2 2 0 0 1 2-2h2"/></svg>
  );
  const IconCustomerExperience = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
  );
  const IconCostReduction = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-piggy-bank"><path d="M19 5c-1.5 0-2.8.6-3.8 1.6L2 17v3h20v-3.5l-1.29-1.29A4 4 0 0 0 19 5Z"/><path d="M2 17l10-10"/><path d="M19 5h1"/><path d="M19 5v1"/></svg>
  );
  const IconGrowth = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
  );
  const IconAI = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain"><path d="M9.5 22c-1.8 0-3.5-.6-5-1.7L2 19"/><path d="M14.3 22c1.8 0 3.5-.6 5-1.7L22 19"/><path d="M8.5 2c-1.8 0-3.5.6-5 1.7L2 5"/><path d="M15.3 2c1.8 0 3.5-.6 5-1.7L22 5"/><path d="M12 7c-3.3 0-6 2.7-6 6v3c0 1.3.8 2.5 2 3h8c1.2 0 2-.7 2-3v-3c0-3.3-2.7-6-6-6Z"/></svg>
  );
  const IconEducation = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap"><path d="M21.43 14.79v1.86a2 2 0 0 1-2 2H4.57a2 2 0 0 1-2-2v-1.86"/><path d="M12 19.5V12"/><path d="M22 17V6l-10-4L2 6v11"/><path d="M12 12v7.5"/><path d="M12 12H2L12 6l10 6h-10"/></svg>
  );
  const IconSafety = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
  );
  const IconCommunication = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
  );
  const IconInnovation = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lightbulb"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1.3.5 2.6 1.5 3.5.8.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 18v4"/></svg>
  );
  const IconWebsite = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20A14.5 14.5 0 0 0 12 2"/><path d="M2 12h20"/></svg>
  );
  const IconLandingPage = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-template"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
  );
  const IconSocialMedia = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-share-2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
  );
  const IconSEO = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
  );
  const IconWhatsApp = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square-text"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M12 8h6"/><path d="M12 12h4"/></svg>
  );
  const IconWriting = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pen-line"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/><path d="M15 5 18 8"/></svg>
  );
  const IconResume = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>
  );
  const IconConsultation = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square-more"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/></svg>
  );

  const ServiceCard = ({ icon: Icon, title, price, details }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center border border-gray-100">
      <div className="p-3 bg-blue-100 rounded-full text-blue-600 mb-4">
        <Icon size={30} />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-blue-600 font-bold text-lg mb-2">{price}</p>
      <p className="text-gray-600 text-sm">{details}</p>
      <a
        href="https://www.sudarshan-ai-labs.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md"
      >
        Learn More
      </a>
    </div>
  );

  const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center text-center">
      <div className="p-3 bg-green-100 rounded-full text-green-600 mb-4">
        <Icon size={30} />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );

  const InitiativeCard = ({ icon: Icon, title, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center text-center">
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

  // Testimonials Carousel
  const testimonials = [
    {
      text: "Sudarshan AI Labs is the best! They made my business digital in no time and at a price I could easily afford. The team is friendly, honest, and always ready to help. I feel confident and supported.",
      rating: 5,
    },
    {
      text: "Amazing experience! Sudarshan AI Labs truly understands small businesses. Their AI tools are easy to use and really work. I saw growth within weeks. Totally worth it!",
      rating: 5,
    },
    {
      text: "I’m so happy I chose Sudarshan AI Labs. They helped me get online quickly, and my sales started increasing. Great support and affordable prices. Highly recommend!",
      rating: 5,
    },
    {
      text: "If you want to grow your business online without stress, go for Sudarshan AI Labs. Their service is smooth, simple, and very effective. Best decision I made!",
      rating: 5,
    },
    {
      text: "Very satisfied! The team at Sudarshan AI Labs is professional and kind. Their AI tools made my work easier, and now my business is visible everywhere. Love it!",
      rating: 5,
    },
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change testimonial every 5 seconds
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="font-sans text-gray-900 bg-gray-50 antialiased">
      {/* Tailwind CSS CDN */}
      <script src="https://cdn.tailwindcss.com"></script>
      {/* Inter font from Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* Custom styles for animations */}
      <style>
        {`
        body { font-family: 'Inter', sans-serif; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.6s ease-out forwards;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        .animate-pulse-subtle {
          animation: pulse 2s infinite ease-in-out;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gradient-bg-animate {
          background: linear-gradient(270deg, #667eea, #764ba2, #667eea);
          background-size: 200% 200%;
          animation: gradientShift 10s ease infinite;
        }

        .testimonial-enter {
          opacity: 0;
          transform: translateY(20px);
        }
        .testimonial-enter-active {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }
        .testimonial-exit {
          opacity: 1;
        }
        .testimonial-exit-active {
          opacity: 0;
          transform: translateY(-20px);
          transition: opacity 0.5s ease-out, transform 0.5s ease-out;
        }
        `}
      </style>

      {/* Header/Navigation */}
      <header className="fixed top-0 left-0 right-0 bg-white bg-opacity-95 shadow-sm z-50">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="https://www.sudarshan-ai-labs.com/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
            <img src="https://placehold.co/40x40/4F46E5/FFFFFF?text=AI" alt="Sudarshan AI Labs Logo" className="rounded-full" />
            <span className="text-2xl font-bold text-blue-700">Sudarshan AI Labs</span>
          </a>
          <ul className="hidden md:flex space-x-6">
            <li><a href="#hero" onClick={() => scrollToSection('hero')} className={`text-gray-600 hover:text-blue-600 transition-colors ${activeSection === 'hero' ? 'text-blue-600 font-semibold' : ''}`}>Home</a></li>
            <li><a href="#about" onClick={() => scrollToSection('about')} className={`text-gray-600 hover:text-blue-600 transition-colors ${activeSection === 'about' ? 'text-blue-600 font-semibold' : ''}`}>About Us</a></li>
            <li><a href="#features" onClick={() => scrollToSection('features')} className={`text-gray-600 hover:text-blue-600 transition-colors ${activeSection === 'features' ? 'text-blue-600 font-semibold' : ''}`}>Features</a></li>
            <li><a href="#ai-marketing-assistant" onClick={() => scrollToSection('ai-marketing-assistant')} className={`text-gray-600 hover:text-blue-600 transition-colors ${activeSection === 'ai-marketing-assistant' ? 'text-blue-600 font-semibold' : ''}`}>Marketing AI</a></li>
            <li><a href="#seo-keyword-suggester" onClick={() => scrollToSection('seo-keyword-suggester')} className={`text-gray-600 hover:text-blue-600 transition-colors ${activeSection === 'seo-keyword-suggester' ? 'text-blue-600 font-semibold' : ''}`}>SEO AI</a></li>
            <li><a href="#services" onClick={() => scrollToSection('services')} className={`text-gray-600 hover:text-blue-600 transition-colors ${activeSection === 'services' ? 'text-blue-600 font-semibold' : ''}`}>Services</a></li>
            <li><a href="#initiatives" onClick={() => scrollToSection('initiatives')} className={`text-gray-600 hover:text-blue-600 transition-colors ${activeSection === 'initiatives' ? 'text-blue-600 font-semibold' : ''}`}>AI Initiatives</a></li>
            <li><a href="#testimonials" onClick={() => scrollToSection('testimonials')} className={`text-gray-600 hover:text-blue-600 transition-colors ${activeSection === 'testimonials' ? 'text-blue-600 font-semibold' : ''}`}>Reviews</a></li>
            <li><a href="#contact" onClick={() => scrollToSection('contact')} className={`text-gray-600 hover:text-blue-600 transition-colors ${activeSection === 'contact' ? 'text-blue-600 font-semibold' : ''}`}>Contact</a></li>
          </ul>
          <a
            href="https://www.sudarshan-ai-labs.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md"
          >
            Launch Your Business
          </a>
          {/* Mobile menu button (if needed) */}
        </nav>
      </header>

      <main className="pt-20"> {/* Padding to account for fixed header */}

        {/* Hero Section */}
        <section
          id="hero"
          ref={(el) => (sectionsRef.current[0] = el)}
          className="relative h-screen flex items-center justify-center text-center text-white overflow-hidden gradient-bg-animate"
        >
          <div className="absolute inset-0 bg-black opacity-50 z-10"></div>
          {/* Animated background elements (simple shapes/particles) */}
          <div className="absolute inset-0 z-0">
            <div className="absolute w-40 h-40 bg-purple-400 rounded-full opacity-20 animate-pulse-subtle -top-10 -left-10"></div>
            <div className="absolute w-60 h-60 bg-blue-400 rounded-full opacity-15 animate-pulse-subtle bottom-0 right-0"></div>
            <div className="absolute w-30 h-30 bg-green-400 rounded-full opacity-25 animate-pulse-subtle top-1/4 left-1/3"></div>
          </div>

          <div className="relative z-20 p-6 max-w-4xl mx-auto animate-fadeIn">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 drop-shadow-lg">
              Sudarshan AI Portal – India's <span className="text-yellow-300">₹89 Digital Revolution</span> for MSMEs & Small Businesses!
            </h1>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Empowering over 600 million users, including FMCG retailers, small businesses, farmers, students, and skilled professionals, with accessible, affordable, and intuitive AI tools and SaaS solutions.
            </p>
            <a
              href="https://www.sudarshan-ai-labs.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-yellow-400 text-blue-900 px-10 py-4 rounded-full text-xl font-bold hover:bg-yellow-500 transition-all duration-300 shadow-xl transform hover:scale-105 animate-pulse-subtle"
            >
              Launch Your Dukan for ₹89 Now!
            </a>
          </div>
        </section>

        {/* About Us / Mission & Vision */}
        <section id="about" ref={(el) => (sectionsRef.current[1] = el)} className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12 animate-fadeIn">About Sudarshan AI Labs</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  Sudarshan AI Labs is India’s premier AI innovation hub, dedicated to empowering over 600 million users—including FMCG retailers, small businesses, farmers, students, and skilled professionals—with accessible, affordable, and intuitive AI tools and SaaS solutions. We are fostering a new era of AI-driven growth, productivity, and inclusivity across the nation.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Our mission lies in our focus on over 50 million small and offline MSME business owners, empowering them to thrive and compete in India’s fast-moving digital economy through easy, no-code and low-code AI tools. From this core, Sudarshan AI Labs drives a wider movement to uplift 600 million underserved Indians — kirana stores, women, youth, and rural communities included — bridging the digital divide and turning local challenges into models of global innovation.
                </p>
              </div>
              <div className="relative h-64 md:h-96 rounded-xl overflow-hidden shadow-xl animate-scaleIn" style={{ animationDelay: '0.4s' }}>
                <img
                  src="https://placehold.co/800x600/6B46C1/FFFFFF?text=AI+Innovation"
                  alt="AI Innovation Hub"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x600/6B46C1/FFFFFF?text=AI+Innovation"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                <div className="absolute bottom-4 left-4 text-white text-2xl font-bold">Democratizing AI for Bharat</div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Sudarshan Portal is #1 */}
        <section id="why-us" ref={(el) => (sectionsRef.current[2] = el)} className="py-16 md:py-24 bg-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12 animate-fadeIn">Why Sudarshan Portal is #1 for Lucknow’s MSMEs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={IconGoogle}
                title="Get Found on Google Instantly"
                description="Appear in local search results when customers are searching for products/services like yours. Be visible, get more footfall, and build trust."
              />
              <FeatureCard
                icon={IconRupee}
                title="Launch Online for ₹89"
                description="Start now with India’s most pocket-friendly digital solution. Unbeatable price, incredible value."
              />
              <FeatureCard
                icon={IconStore}
                title="Dedicated for MSMEs & Small Businesses"
                description="Tailored specifically for kirana stores, salons, gyms, retailers, street vendors, restaurants, and ALL offline businesses in Lucknow & UP."
              />
              <FeatureCard
                icon={IconRupee}
                title="Most Affordable Digital Marketing"
                description="Compare our plans – no hidden fees, no tech headache. ₹89 mein crore ka sapna!"
              />
              <FeatureCard
                icon={IconUdyam}
                title="Get Free Udyam Registration"
                description="Automatically get Udyam MSME Certificate (govt. certified) at no extra cost! Secure your business."
              />
              <FeatureCard
                icon={IconCRM}
                title="FREE Hindi CRM & Insights"
                description="Access a free Hindi business CRM for simple sales tracking, order follow-up, and business analytics. Sab kuch Hindi mein!"
              />
            </div>
          </div>
        </section>

        {/* Powerful Features */}
        <section id="features" ref={(el) => (sectionsRef.current[3] = el)} className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12 animate-fadeIn">Powerful Features That Transform Your Business</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={IconOnlinePresence}
                title="Instant Online Presence"
                description="List your shop online in minutes—show up to all customers near you on Google and other platforms. Launch now!"
              />
              <FeatureCard
                icon={IconOrderManagement}
                title="Unified Order Management"
                description="Manage all orders (online, WhatsApp, walk-ins) from a single dashboard – reduce errors and save time."
              />
              <FeatureCard
                icon={IconInventory}
                title="Real-Time Inventory"
                description="Track stock live, avoid out-of-stock, and never miss a sale again."
              />
              <FeatureCard
                icon={IconMarketplace}
                title="Marketplace Integration"
                description="Connect with Amazon, Flipkart, etc. and manage all your listings from one place."
              />
              <FeatureCard
                icon={IconAnalytics}
                title="Smart Analytics & Reporting"
                description="See your sales trends, customer data, and get actionable insights for growth—all in Hindi!"
              />
              <FeatureCard
                icon={IconAutomation}
                title="Automated Workflow & Logistics"
                description="Save on manpower with auto-invoicing, notifications, and delivery management."
              />
              <FeatureCard
                icon={IconCustomerExperience}
                title="Personalized Customer Experience"
                description="Targeted offers, WhatsApp marketing, and repeat customer retention tools."
              />
              <FeatureCard
                icon={IconCostReduction}
                title="Cost Reduction"
                description="Automation slashes your expenses. Every rupee saved is a rupee earned!"
              />
            </div>
          </div>
        </section>

        {/* AI Marketing Assistant Section */}
        <section id="ai-marketing-assistant" ref={(el) => (sectionsRef.current[4] = el)} className="py-16 md:py-24 bg-purple-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12 animate-fadeIn">✨ AI Marketing Assistant ✨</h2>
            <p className="text-lg text-gray-700 text-center mb-8 max-w-2xl mx-auto">
              Leverage the power of AI to generate compelling marketing copy for your products or services instantly!
            </p>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 max-w-3xl mx-auto animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <div className="mb-6">
                <label htmlFor="productName" className="block text-gray-700 text-sm font-bold mb-2">
                  Product/Service Name:
                </label>
                <input
                  type="text"
                  id="productName"
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Organic Honey, Yoga Classes"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="productDescription" className="block text-gray-700 text-sm font-bold mb-2">
                  Brief Description:
                </label>
                <textarea
                  id="productDescription"
                  rows="4"
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Pure, locally sourced, boosts immunity. Or, Beginner-friendly, stress relief, flexible timings."
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                ></textarea>
              </div>
              <button
                onClick={generateMarketingCopy}
                disabled={isLoadingMarketing}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition-colors duration-300 shadow-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingMarketing ? (
                  <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Generate Copy ✨'
                )}
              </button>

              {marketingError && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {marketingError}
                </div>
              )}

              {generatedCopy && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Generated Marketing Copy:</h3>
                  <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 leading-relaxed">
                    {generatedCopy}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* SEO Keyword Suggester Section */}
        <section id="seo-keyword-suggester" ref={(el) => (sectionsRef.current[5] = el)} className="py-16 md:py-24 bg-green-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12 animate-fadeIn">✨ SEO Keyword Suggester ✨</h2>
            <p className="text-lg text-gray-700 text-center mb-8 max-w-2xl mx-auto">
              Boost your online visibility! Get instant SEO keyword suggestions for your business.
            </p>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 max-w-3xl mx-auto animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              <div className="mb-6">
                <label htmlFor="businessType" className="block text-gray-700 text-sm font-bold mb-2">
                  Business Type:
                </label>
                <input
                  type="text"
                  id="businessType"
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Bakery, Digital Marketing Agency, Organic Food Store"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                />
              </div>
              <div className="mb-6">
                <label htmlFor="targetAudience" className="block text-gray-700 text-sm font-bold mb-2">
                  Target Audience (Optional):
                </label>
                <input
                  type="text"
                  id="targetAudience"
                  className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Small businesses in Lucknow, Health-conscious individuals"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                />
              </div>
              <button
                onClick={generateSEOKeywords}
                disabled={isLoadingSEO}
                className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-colors duration-300 shadow-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingSEO ? (
                  <svg className="animate-spin h-5 w-5 text-white mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Generate Keywords ✨'
                )}
              </button>

              {seoError && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {seoError}
                </div>
              )}

              {generatedKeywords && (
                <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Generated SEO Keywords:</h3>
                  <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 leading-relaxed">
                    {generatedKeywords}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* How Businesses are Growing (Success Stories & Infographics) */}
        <section id="growth" ref={(el) => (sectionsRef.current[6] = el)} className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fadeIn">How Lucknow Businesses Are Growing with Sudarshan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <StatCard value="40%" label="Sales Growth for Rajiv's Bookstore" icon={IconGrowth} colorClass="bg-blue-700" />
              <StatCard value="60%" label="More Repeat Visits for Vivek's Cafe" icon={IconCustomerExperience} colorClass="bg-purple-700" />
              <StatCard value="Zero" label="Stock-Outs for Sanjay's Electronics" icon={IconInventory} colorClass="bg-green-700" />
              <StatCard value="PAN India" label="Reach for Small Brands" icon={IconMarketplace} colorClass="bg-yellow-700" />
            </div>

            <div className="text-center animate-fadeIn" style={{ animationDelay: '0.6s' }}>
              <p className="text-xl mb-8">
                Don’t Get Left Behind! The future is digital—join the ₹89 revolution and become an unstoppable business today.
              </p>
              <a
                href="https://www.sudarshan-ai-labs.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-blue-800 px-10 py-4 rounded-full text-xl font-bold hover:bg-gray-100 transition-all duration-300 shadow-xl transform hover:scale-105"
              >
                Launch Your Dukan for ₹89 Now!
              </a>
            </div>
          </div>
        </section>

        {/* Comprehensive Services */}
        <section id="services" ref={(el) => (sectionsRef.current[7] = el)} className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12 animate-fadeIn">Our Comprehensive Digital Marketing Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ServiceCard
                icon={IconStore}
                title="Start Your Online Store"
                price="₹89"
                details="Digital storefront ready in 2 minutes. Get found on Google instantly."
              />
              <ServiceCard
                icon={IconWebsite}
                title="Professional Full Website Setup"
                price="₹3500"
                details="Up to 5 pages, custom design, SEO-optimized and mobile-friendly."
              />
              <ServiceCard
                icon={IconLandingPage}
                title="Conversion-Focused Landing Pages"
                price="₹1500–₹1999"
                details="Skyrocket lead generation with expertly designed pages."
              />
              <ServiceCard
                icon={IconSocialMedia}
                title="Social Media Marketing"
                price="from ₹999/month"
                details="8+ posts monthly, professional ad setup, influencer collaborations."
              />
              <ServiceCard
                icon={IconSEO}
                title="SEO & Content Boost"
                price="from ₹1499/month"
                details="Climb Google rankings fast with targeted keywords, blog content, backlinks."
              />
              <ServiceCard
                icon={IconWhatsApp}
                title="WhatsApp Business Bot Setup"
                price="₹129 Basic / ₹599 Pro"
                details="Automate customer interactions, instant replies, payment integrations."
              />
              <ServiceCard
                icon={IconWriting}
                title="Research & Article Writing"
                price="from ₹499"
                details="Compelling content, research-backed articles, authoritative backlinks (DA80+)."
              />
              <ServiceCard
                icon={IconResume}
                title="Resume Writing"
                price="from ₹79"
                details="Professional, high-quality resumes crafted quickly."
              />
              <ServiceCard
                icon={IconAI}
                title="AI Chatbot & Assistant Development"
                price="from ₹499"
                details="Engage customers 24/7 with multilingual chatbots."
              />
              <ServiceCard
                icon={IconAutomation}
                title="Excel & Sheets Automation Solutions"
                price="from ₹1999"
                details="Automate business tracking, financial dashboards, and reporting."
              />
              <ServiceCard
                icon={IconInnovation}
                title="SaaS & AI Tool Development (Lite)"
                price="from ₹2999"
                details="Launch powerful SaaS solutions and AI-driven prototypes quickly."
              />
              <ServiceCard
                icon={IconConsultation}
                title="Business Growth Consultation (+Free SEO)"
                price="from ₹499"
                details="Gain actionable insights with a detailed growth report and complimentary SEO consultation."
              />
            </div>
          </div>
        </section>

        {/* AI-Driven Solutions & Flagship Initiatives */}
        <section id="initiatives" ref={(el) => (sectionsRef.current[8] = el)} className="py-16 md:py-24 bg-blue-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12 animate-fadeIn">Our Flagship AI Initiatives: AI for Bharat</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <InitiativeCard
                icon={IconAI}
                title="Kisaan Sathi AI (AI-Saathi)"
                description="Voice-based advisory in 22 local languages, real-time crop recommendations, market price predictions, and financial literacy for farmers."
              />
              <InitiativeCard
                icon={IconStore}
                title="Kirana AI (Sudarshan Portal)"
                description="OCR-based inventory, instant online store, WhatsApp CRM, AI-driven insights for competitive pricing, and UPI/Aadhaar integration for small retail."
              />
              <InitiativeCard
                icon={IconEducation}
                title="Vishnu's Vision GPT"
                description="Free AI education modules, hands-on project participation with stipends, and mentorship programs for youth empowerment."
              />
              <InitiativeCard
                icon={IconSafety}
                title="Nirbhaya-GPT (Suraksha Ring)"
                description="Multi-modal triggers, encrypted real-time alerts to trusted contacts and authorities, and AI-powered triage for women's safety."
              />
              <InitiativeCard
                icon={IconCommunication}
                title="PRISM"
                description="A secure, all-in-one platform for unified communication, secure UPI payments, task management, and an integrated e-commerce shop."
              />
              <InitiativeCard
                icon={IconInnovation}
                title="Nava Netra Neural - Mahadev’s Algorithm"
                description="An overarching platform for developing and deploying AI SaaS tools, facilitating government collaboration, and AI upskilling programs."
              />
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" ref={(el) => (sectionsRef.current[9] = el)} className="py-16 md:py-24 bg-gradient-to-r from-purple-700 to-blue-600 text-white relative overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 animate-fadeIn">What Our Clients Say</h2>
            <div className="relative max-w-3xl mx-auto">
              <div className="bg-white text-gray-800 p-8 rounded-xl shadow-2xl relative transition-all duration-500 transform testimonial-enter testimonial-enter-active">
                <p className="text-lg md:text-xl italic mb-6">"{testimonials[currentTestimonial].text}"</p>
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-2xl">★</span>
                  ))}
                </div>
                <p className="font-semibold text-blue-600">Happy Customer {currentTestimonial + 1}</p>
              </div>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 mt-4">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    className={`w-3 h-3 rounded-full ${currentTestimonial === idx ? 'bg-white' : 'bg-gray-400'} transition-colors duration-300`}
                  ></button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action / Contact */}
        <section id="contact" ref={(el) => (sectionsRef.current[10] = el)} className="py-16 md:py-24 bg-white text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 animate-fadeIn">Ready to Grow Your Business Online?</h2>
            <p className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto animate-fadeIn" style={{ animationDelay: '0.2s' }}>
              Join hundreds of thriving businesses who’ve accelerated their growth through Sudarshan AI Labs—the best digital marketing agency in Lucknow.
            </p>
            <a
              href="https://www.sudarshan-ai-labs.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 text-white px-10 py-4 rounded-full text-xl font-bold hover:bg-blue-700 transition-all duration-300 shadow-xl transform hover:scale-105 animate-pulse-subtle"
            >
              Book a Free 15-min Audit Now!
            </a>
            <p className="text-md text-gray-600 mt-6">
              Prefer WhatsApp? Message "GROW" to +91-XXXXXXXXXX (Placeholder)
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-lg mb-4">Sudarshan AI Labs — Lucknow’s trusted partner to grow, get found, and lead.</p>
          <div className="flex justify-center space-x-6 mb-6">
            <a href="https://www.sudarshan-ai-labs.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="https://www.sudarshan-ai-labs.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
            <a href="https://www.sudarshan-ai-labs.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Contact Us</a>
          </div>
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Sudarshan AI Labs. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
