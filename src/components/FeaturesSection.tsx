import { Code, Zap, Bolt, Rocket, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function FeaturesSection() {
  const features = [
    {
      icon: <Bolt className="w-5 h-5 text-amber-400" />,
      title: "Lightning-Fast AI Generation",
      description: "Describe your website and watch ZapCode generate all code instantly with our high-speed AI engine.",
      color: "from-amber-500/10 to-amber-600/10"
    },
    {
      icon: <Code className="w-5 h-5 text-blue-400" />,
      title: "Turbocharged Editor",
      description: "Real-time editing with our performance-optimized code editor featuring electric-fast previews.",
      color: "from-blue-500/10 to-blue-600/10"
    },
    {
      icon: <Zap className="w-5 h-5 text-yellow-400" />,
      title: "Instant Reprompting",
      description: "Redesign your site in seconds with our one-click reprompt technology.",
      color: "from-yellow-500/10 to-yellow-600/10"
    },
    {
      icon: <Rocket className="w-5 h-5 text-purple-400" />,
      title: "Hypercharged WebContainers",
      description: "Blazing-fast browser execution with our next-gen WebContainer implementation.",
      color: "from-purple-500/10 to-purple-600/10"
    },
    {
      icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
      title: "Guided Creation Flow",
      description: "Our intuitive step-by-step process supercharges your development workflow.",
      color: "from-cyan-500/10 to-cyan-600/10"
    },
    {
      icon: <Zap className="w-5 h-5 text-green-400" />,
      title: "One-Click Deployment",
      description: "Export and deploy your optimized website anywhere with a single click.",
      color: "from-green-500/10 to-green-600/10"
    },
  ];

  return (
    <section id="features" className="relative py-20 z-10 bg-gradient-to-b from-gray-950/50 to-gray-900/30">
      {/* Electric background elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-yellow-500/5 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center mb-4 px-4 py-2 rounded-full bg-amber-900/20 border border-amber-800/30 text-amber-400 text-sm">
            <Zap className="w-4 h-4 mr-2" />
            Why Choose ZapCode
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-yellow-400 mb-4">
            Lightning-Speed Web Creation
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            ZapCode supercharges your workflow with our suite of high-performance features
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              className="group"
            >
              <div className={`h-full p-6 rounded-xl border border-gray-800/50 bg-gradient-to-br ${feature.color} backdrop-blur-sm hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10`}>
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800/50 group-hover:border-amber-500/30 transition-colors">
                      {feature.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-amber-900/30 to-yellow-900/30 border border-amber-800/30 text-amber-300 text-sm">
            <Bolt className="w-4 h-4 mr-2" />
            Performance Optimized
          </div>
        </motion.div>
      </div>
    </section>
  );
}