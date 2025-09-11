import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  User,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// Fallback GlassCard component in case import fails
const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  return (
    <div
      className={`backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl ${className}`}
    >
      {children}
    </div>
  );
};

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Contact Component Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#091D23] to-[#774C3E] flex items-center justify-center p-4">
          <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-8 max-w-md">
            <h2 className="text-white text-xl font-bold mb-4">
              Something went wrong
            </h2>
            <p className="text-white/70 mb-4">
              Error: {this.state.error?.message || "Unknown error"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const ContactContent: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [initError, setInitError] = useState("");

  // EmailJS Configuration with debug logging
  const EMAILJS_SERVICE_ID = "service_p0w0f6n"; // Hardcoded for testing
  const EMAILJS_PUBLIC_KEY = "HQJF20MVyocoC0AVx"; // Hardcoded for testing

  console.log("EmailJS Config:", {
    serviceId: EMAILJS_SERVICE_ID,
    publicKey: EMAILJS_PUBLIC_KEY ? "Set" : "Not Set",
  });

  // Template IDs
  const TEMPLATE_IDS = {
    general: "template_dqwkghg",
    support: "template_dqwkghg",
    partnership: "template_dqwkghg",
    feedback: "template_dqwkghg",
    school: "template_dqwkghg",
  };

  const INTERNAL_TEMPLATE_ID = "template_dqwkghg";

  // Initialize EmailJS on component mount
  useEffect(() => {
    try {
      if (!EMAILJS_PUBLIC_KEY) {
        setInitError("EmailJS public key is missing");
        console.error("EmailJS public key is missing");
        return;
      }

      emailjs.init(EMAILJS_PUBLIC_KEY);
      console.log(
        "EmailJS initialized successfully with key:",
        EMAILJS_PUBLIC_KEY
      );
    } catch (error) {
      console.error("EmailJS initialization error:", error);
      setInitError(`Failed to initialize email service: ${error}`);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submission started");

    if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID) {
      const errorMsg = "Email service configuration is missing";
      console.error(errorMsg);
      setSubmitError(errorMsg);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const ticketId = Date.now().toString().slice(-6);
      const submissionTime = new Date().toLocaleString();

      const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        inquiry_type:
          formData.type.charAt(0).toUpperCase() + formData.type.slice(1),
        submission_time: submissionTime,
        ticket_id: ticketId,
        priority: formData.type === "support" ? "High" : "Normal",
        to_email: formData.email,
        reply_to: formData.email,
      };

      console.log("Sending email with params:", templateParams);

      // Send email
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        TEMPLATE_IDS[formData.type as keyof typeof TEMPLATE_IDS] ||
          TEMPLATE_IDS.general,
        templateParams
      );

      console.log("Email sent successfully:", response);
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Reset after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
          type: "general",
        });
      }, 5000);
    } catch (error) {
      console.error("EmailJS Error Details:", error);
      setIsSubmitting(false);

      let errorMessage = "Failed to send message. ";
      if (error instanceof Error) {
        errorMessage += error.message;
      } else {
        errorMessage += "Unknown error occurred";
      }
      errorMessage +=
        ". Please try again or contact us directly at support@neuralgo.com";

      setSubmitError(errorMessage);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (submitError) {
      setSubmitError("");
    }
  };

  // Success screen
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#091D23] to-[#774C3E] flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <GlassCard className="p-8 max-w-md">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Message Sent Successfully!
              </h2>
              <p className="text-white/70 mb-4">
                Thank you for reaching out. We'll get back to you within 24
                hours.
              </p>
              <p className="text-white/50 text-sm">
                Check your email for a confirmation message with ticket ID.
              </p>
            </GlassCard>
          </motion.div>
        </div>
        <footer className="relative mt-auto">
          <div className="absolute top-4 right-4 text-white/20 text-xs font-light z-10">
            Created by Tamaterkun & EmitB0i
          </div>
          <div className="bg-black/20 backdrop-blur-sm border-t border-white/10 py-4">
            <div className="container mx-auto px-4 text-center">
              <p className="text-white/60 text-sm">
                © 2025 PrismWorlds. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Main form
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#091D23] to-[#774C3E] flex flex-col">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-12">
          {/* Debug info (remove in production) */}
          {(initError || submitError) && (
            <div className="max-w-6xl mx-auto mb-4">
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4">
                <p className="text-yellow-200 text-sm">
                  Debug Info: {initError || submitError}
                </p>
              </div>
            </div>
          )}

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Get in{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F8D991] to-[#F6B080]">
                Touch
              </span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Have questions about PrismWorlds? Need support? Want to
              collaborate? We'd love to hear from you!
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
                <h3 className="text-xl font-bold text-white mb-6">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#F8D991]/20 rounded-full flex items-center justify-center">
                      <Mail className="h-6 w-6 text-[#F8D991]" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Email</p>
                      <p className="text-white/70">support@neuralgo.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#F6B080]/20 rounded-full flex items-center justify-center">
                      <Phone className="h-6 w-6 text-[#F6B080]" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Phone</p>
                      <p className="text-white/70">+91 8900034211</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#E1664C]/20 rounded-full flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-[#E1664C]" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Location</p>
                      <p className="text-white/70">
                        Bhubaneswar, Odisha, India
                      </p>
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
                <h3 className="text-lg font-bold text-white mb-4">
                  Why Contact Us?
                </h3>
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
                <h3 className="text-2xl font-bold text-white mb-6">
                  Send us a Message
                </h3>

                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-6 flex items-start space-x-3"
                  >
                    <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-200 text-sm font-medium">
                        Message Failed to Send
                      </p>
                      <p className="text-red-300 text-xs mt-1">{submitError}</p>
                    </div>
                  </motion.div>
                )}

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
                      <option
                        value="general"
                        className="bg-[#091D23] text-white"
                      >
                        General Inquiry
                      </option>
                      <option
                        value="support"
                        className="bg-[#091D23] text-white"
                      >
                        Technical Support
                      </option>
                      <option
                        value="partnership"
                        className="bg-[#091D23] text-white"
                      >
                        Partnership
                      </option>
                      <option
                        value="feedback"
                        className="bg-[#091D23] text-white"
                      >
                        Feedback
                      </option>
                      <option
                        value="school"
                        className="bg-[#091D23] text-white"
                      >
                        School Integration
                      </option>
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
                        ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#F8D991] to-[#F6B080] text-[#091D23] hover:shadow-2xl hover:shadow-[#F8D991]/25"
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

      <footer className="relative mt-12">
        <div className="absolute top-4 right-4 text-white/20 text-xs font-light z-10">
          Created by Tamaterkun & EmitB0i
        </div>
        <div className="bg-black/20 backdrop-blur-sm border-t border-white/10 py-6">
          <div className="container mx-auto px-4 text-center">
            <p className="text-white/60 text-sm">
              © 2025 PrismWorlds. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Main Contact component with error boundary
const Contact: React.FC = () => {
  return (
    <ErrorBoundary>
      <ContactContent />
    </ErrorBoundary>
  );
};

export default Contact;
