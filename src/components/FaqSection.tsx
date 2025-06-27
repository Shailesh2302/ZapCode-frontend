import { Zap, ChevronDown, Bolt } from 'lucide-react';
import { motion } from 'framer-motion';
import { Disclosure } from '@headlessui/react';
import { cn } from '../utils/cn';

export function FaqSection() {
  const faqs = [
    {
      question: 'How does ZapCode turn my prompts into a website?',
      answer:
        'ZapCode uses lightning-fast AI to interpret your natural language description and generate the necessary code in seconds. Our advanced algorithms analyze your requirements and produce optimized HTML, CSS, and JavaScript files that match your vision.',
    },
    {
      question: 'Can I customize the generated website?',
      answer:
        'Absolutely! ZapCode provides a full-featured code editor with electric-fast previews where you can make precise adjustments to any aspect of your website. Changes are reflected instantly with our live-reloading technology.',
    },
    {
      question: 'What kind of websites can I create with ZapCode?',
      answer:
        "ZapCode can help you create a wide range of websites at lightning speed - from simple landing pages to complex web applications. It's perfect for portfolios, blogs, e-commerce sites, dashboards, and more. Our AI handles the heavy lifting so you don't have to.",
    },
    {
      question: 'Do I need coding experience to use ZapCode?',
      answer:
        'No coding experience is required. ZapCode is designed to be accessible to everyone, with our AI doing the complex work. However, developers will appreciate the clean, production-ready code and advanced customization options.',
    },
    {
      question: 'How do I deploy my website?',
      answer:
        'With one click, you can download your generated website as a zip file ready for deployment. Host it anywhere - GitHub Pages, Netlify, Vercel, or your own server. ZapCode websites are optimized for performance right out of the box.',
    },
  ];

  return (
    <section id="faq" className="py-20 md:py-30 relative z-10 bg-gradient-to-b from-gray-950/50 to-transparent">
      {/* Electric pulse background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-500/5 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex flex-col items-center"
          >
            <div className="inline-flex items-center mb-2 px-4 py-2 rounded-full bg-amber-900/20 border border-amber-800/30 text-amber-400 text-sm">
              <Bolt className="w-4 h-4 mr-2" />
              Frequently Asked Questions
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-400 mb-4">
              ZapCode FAQ
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Get instant answers about our lightning-fast website builder
            </p>
          </motion.div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Disclosure>
                {({ open }) => (
                  <div className="rounded-xl overflow-hidden border border-gray-800/50 bg-gradient-to-b from-gray-900/50 to-gray-900/30 backdrop-blur-sm">
                    <Disclosure.Button className="flex justify-between w-full px-6 py-5 text-left text-white hover:bg-gray-800/30 focus:outline-none transition-all duration-200 group">
                      <span className="text-base font-medium text-gray-200 group-hover:text-white">
                        {faq.question}
                      </span>
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${open ? 'bg-amber-500/20' : 'bg-gray-800'}`}>
                          <ChevronDown
                            className={cn(
                              'w-4 h-4 text-amber-400 transition-transform',
                              open ? 'transform rotate-180' : ''
                            )}
                          />
                        </div>
                      </div>
                    </Disclosure.Button>
                    <Disclosure.Panel className="px-6 py-4 text-gray-300 bg-gradient-to-b from-gray-900/30 to-gray-900/10 backdrop-blur-sm">
                      <div className="flex">
                        <Zap className="flex-shrink-0 w-4 h-4 mt-1 mr-3 text-amber-400/60" />
                        <p>{faq.answer}</p>
                      </div>
                    </Disclosure.Panel>
                  </div>
                )}
              </Disclosure>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}