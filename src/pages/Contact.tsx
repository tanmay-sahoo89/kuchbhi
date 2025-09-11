import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, User, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#091D23] to-[#774C3E] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <GlassCard className="p-8 max-w-md">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Message Sent!</h2>
            <p className="text-white/70">
              Thank you for reaching out. We'll get back to you within 24 hours.
            </p>
          </GlassCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#091D23] to-[#774C3E]">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F8D991] to-[#F6B080]">Touch</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Have questions about PrismWorlds? Need support? Want to collaborate? We'd love to hear from you!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold text-white mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#F8D991]/20 rounded-full flex items-center justify-center">
                    <Mail className="h-6 w-6 text-[#F8D991]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Email</p>
                    <p className="text-white/70">support@prismworlds.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#F6B080]/20 rounded-full flex items-center justify-center">
                    <Phone className="h-6 w-6 text-[#F6B080]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Phone</p>
                    <p className="text-white/70">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#E1664C]/20 rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-[#E1664C]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Location</p>
                    <p className="text-white/70">Mumbai, Maharashtra, India</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#F58B60]/20 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-[#F58B60]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">Response Time</p>
                    <p className="text-white/70">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Why Contact Us?</h3>
              <ul className="space-y-2 text-white/70">
                <li>• Technical support and troubleshooting</li>
                <li>• Partnership and collaboration opportunities</li>
                <li>• Feedback and feature requests</li>
                <li>• Educational content suggestions</li>
                <li>• School integration assistance</li>
              </ul>
            </GlassCard>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <GlassCard className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Send us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:border-transparent backdrop-blur-sm"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:border-transparent backdrop-blur-sm"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Inquiry Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:border-transparent backdrop-blur-sm"
                  >
                    <option value="general" className="bg-[#091D23] text-white">General Inquiry</option>
                    <option value="support" className="bg-[#091D23] text-white">Technical Support</option>
                    <option value="partnership" className="bg-[#091D23] text-white">Partnership</option>
                    <option value="feedback" className="bg-[#091D23] text-white">Feedback</option>
                    <option value="school" className="bg-[#091D23] text-white">School Integration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:border-transparent backdrop-blur-sm"
                    placeholder="Brief subject of your message"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Message *
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-white/50" />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:border-transparent backdrop-blur-sm resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center space-x-2 py-4 rounded-xl font-bold text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#E1664C] focus:ring-offset-2 focus:ring-offset-transparent ${
                    isSubmitting
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#F8D991] to-[#F6B080] text-[#091D23] hover:shadow-2xl hover:shadow-[#F8D991]/25'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#091D23]"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;