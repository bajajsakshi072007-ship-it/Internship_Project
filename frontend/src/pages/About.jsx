import React from 'react'

const About = () => {
  return (
    <div className="container-app py-12 space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="page-title mb-3">About Our Marketplace</h1>
        <p className="text-gray-500 text-base leading-relaxed">
          Bridging the gap between talented rural artisans and art collectors across the globe.
        </p>
      </div>

      {/* Story Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="section-title">Empowering Local Craftsmanship</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            In rural India, millions of traditional artisans possess incredible skills passed down through generations. However, lack of direct access to modern markets, logistics, and fair pricing often leaves them undercompensated.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Our mission is to empower these artisans by providing them with a digital store to list their unique crafts, set their own prices, and connect directly with conscious buyers. Every purchase directly improves their livelihood and preserves cultural heritage.
          </p>
        </div>
        <div className="aspect-video bg-gradient-to-br from-primary-200 to-accent-200 rounded-2xl flex items-center justify-center text-gray-500 font-medium">
          Handicraft Image Showcase
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 rounded-2xl p-8 space-y-8">
        <h2 className="section-title text-center">Our Core Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="text-center space-y-2">
            <h3 className="font-bold text-gray-900 text-sm">Direct Trade</h3>
            <p className="text-xs text-gray-500 leading-relaxed">Artisans set their own prices and interact directly with buyers, securing fair wages without middlemen.</p>
          </div>
          <div className="text-center space-y-2">
            <h3 className="font-bold text-gray-900 text-sm">Cultural Preservation</h3>
            <p className="text-xs text-gray-500 leading-relaxed">We provide a platform that supports traditional techniques, keeping heritage crafts alive in the modern world.</p>
          </div>
          <div className="text-center space-y-2">
            <h3 className="font-bold text-gray-900 text-sm">Sustainable Commerce</h3>
            <p className="text-xs text-gray-500 leading-relaxed">We promote eco-friendly production methods, organic raw materials, and long-lasting craftsmanship.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About
