import React from "react";


const NewsletterFooter = () => {
  return (
    <div className="w-full bg-white mt-20">
      {/* Newsletter Banner */}
      <div className="bg-blue-600 text-white px-10 py-16 flex flex-col md:flex-row justify-between items-center gap-5">
        <h2 className="text-3xl md:text-4xl font-bold text-center md:text-left">
          Sign up to our newsletter <br /> & get 20% off
        </h2>
        <button className="bg-white text-black px-8 py-4 text-lg font-semibold hover:bg-gray-100 transition">
          SIGN UP FOR FREE
        </button>
      </div>

      {/* Footer Content */}
      <div className="px-10 py-16 grid grid-cols-1 md:grid-cols-4 gap-10 text-black">
        <div>
          <h3 className="text-xl font-bold mb-2">SERRENA</h3>
          <p>Your trusted<br />fashion companion</p>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">NAVIGATION</h3>
          <ul className="space-y-1">
            <li>Home</li>
            <li>Shop</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2">CATEGORIES</h3>
          <ul className="space-y-1">
            <li>Men</li>
            <li>Women</li>
            <li>Kids</li>
          </ul>
        </div>

        <div className="flex items-center justify-start gap-4 text-2xl">
          {/* <FaFacebookF />
          <FaInstagram />
          <FaTwitter />
          <FaEnvelope /> */}
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center pb-10 text-sm text-gray-600">
        All Rights Reserved By @Electromart
      </div>
    </div>
  );
};

export default NewsletterFooter;
