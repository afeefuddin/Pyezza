export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4 animate__animated animate__fadeInUp">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-300 animate__animated animate__fadeInUp animate__delay-1s">
            Choose the perfect plan for your team
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-neutral-800 rounded-2xl p-8 border border-neutral-700 hover:border-orange-500 transition-all duration-300 animate__animated animate__fadeInUp">
            <h3 className="text-2xl font-bold text-white mb-4">Free</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$0</span>
              <span className="text-gray-400">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-orange-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Up to 10 team members
              </li>
              <li className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-orange-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Basic engagement features
              </li>
              <li className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-orange-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Community support
              </li>
            </ul>
            <button className="w-full py-3 px-4 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition-colors duration-300">
              Get Started
            </button>
          </div>

          <div className="bg-neutral-800 rounded-2xl p-8 border-2 border-orange-500 transform scale-105 animate__animated animate__fadeInUp animate__delay-1s relative">
            <div className="absolute top-0 right-0 bg-orange-500 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
              Popular
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Pro</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$49</span>
              <span className="text-gray-400">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-orange-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Up to 50 team members
              </li>
              <li className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-orange-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Advanced engagement tools
              </li>
              <li className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-orange-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Priority support
              </li>
              <li className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-orange-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Analytics dashboard
              </li>
            </ul>
            <button className="w-full py-3 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300">
              Start Free Trial
            </button>
          </div>

          <div className="bg-neutral-800 rounded-2xl p-8 border border-neutral-700 hover:border-orange-500 transition-all duration-300 animate__animated animate__fadeInUp animate__delay-2s">
            <h3 className="text-2xl font-bold text-white mb-4">Enterprise</h3>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">Custom</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-orange-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Unlimited team members
              </li>
              <li className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-orange-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Custom integrations
              </li>
              <li className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-orange-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                24/7 dedicated support
              </li>
              <li className="flex items-center text-gray-300">
                <svg
                  className="w-5 h-5 text-orange-500 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                Custom feature development
              </li>
            </ul>
            <button className="w-full py-3 px-4 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white transition-colors duration-300">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
