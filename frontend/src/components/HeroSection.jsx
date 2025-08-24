import React from 'react';

const HeroSection = () => {
  return (
    <section className="bg-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Welcome to Electromart</h2>
        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          A better way to manage your business
        </p>
        <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
          Simple, efficient, yet affordable business management software for small and medium enterprises.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;