import React from 'react';

const SalesContent = () => {
  return (
    <section className="container mx-auto px-4 sm:px-8 py-16 sm:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-primary">
            Transform Your Website Into a Lead Generation Machine
          </h2>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            Stop guessing what content will attract your ideal customers. Our AI-powered lead magnet generator analyzes your business and creates targeted content ideas that will grow your email list.
          </p>
          
          <ul className="space-y-3">
            <li className="flex items-start space-x-3 text-muted-foreground">
              <svg className="h-6 w-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span>Get multiple unique lead magnet ideas tailored to your business</span>
            </li>
            <li className="flex items-start space-x-3 text-muted-foreground">
              <svg className="h-6 w-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span>Understand exactly why each idea will resonate with your audience</span>
            </li>
            <li className="flex items-start space-x-3 text-muted-foreground">
              <svg className="h-6 w-6 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span>Receive a detailed PDF report you can reference anytime</span>
            </li>
          </ul>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            Join hundreds of business owners who have already discovered their perfect lead magnet idea. Get your personalized suggestions in minutes, not hours.
          </p>
        </div>
        
        <div className="relative">
          <div className="absolute -inset-4 bg-primary/5 rounded-xl -z-10" />
          <img
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
            alt="Example lead magnet analysis"
            className="rounded-lg shadow-xl w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default SalesContent;