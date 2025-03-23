import { AnimateIn } from "../animate-in";

export default function HowItWorks() {
  return (
    <section className="px-4 md:px-0 py-16 bg-white overflow-x-hidden">
      <AnimateIn>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Bringing teams closer with effortless social interactions.
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Get started with pie in just three simple steps and transform how
            your team communicates.
          </p>
        </div>
      </AnimateIn>

      <div className="relative">
        <div className="absolute left-1/2 top-0 bottom-0 -ml-px hidden md:block">
          <div className="h-full w-0.5 bg-gradient-to-b from-primary/30 via-primary to-primary/30"></div>
        </div>

        <div className="relative mb-24">
          <div className="flex flex-col md:flex-row items-center">
            <AnimateIn
              from="left"
              className="md:w-1/2 md:pr-12 md:text-right order-2 md:order-1"
            >
              <div className="mb-4">
                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
                  Step 1
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Integrate with your Slack workspace
              </h3>
              <p className="text-muted-foreground mb-6 max-w-xl ml-auto">
                Connect pie to your Slack workspace with just a few clicks. Our
                seamless integration process makes setup quick and easy.
              </p>
            </AnimateIn>
            <AnimateIn
              from="right"
              delay={200}
              className="md:w-1/2 order-1 md:order-2 mb-8 md:mb-0"
            >
              <div className="relative mx-auto md:ml-0 w-full max-w-md">
                <svg viewBox="0 0 400 300" className="w-full h-auto">
                  <defs>
                    <linearGradient
                      id="grad1"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="hsl(25, 95%, 53.1%, 0.1)" />
                      <stop
                        offset="100%"
                        stopColor="hsl(25, 95%, 53.1%, 0.3)"
                      />
                    </linearGradient>
                  </defs>
                  <rect
                    x="50"
                    y="30"
                    width="300"
                    height="240"
                    rx="20"
                    fill="url(#grad1)"
                  />
                  <rect
                    x="70"
                    y="50"
                    width="260"
                    height="200"
                    rx="12"
                    fill="white"
                    className="dark:fill-gray-800"
                  />
                  <circle cx="90" cy="70" r="6" fill="#f44336" />
                  <circle cx="110" cy="70" r="6" fill="#ffc107" />
                  <circle cx="130" cy="70" r="6" fill="#4caf50" />
                  <text
                    x="160"
                    y="75"
                    fontSize="12"
                    fill="#666"
                    className="dark:fill-gray-300"
                  >
                    Slack Integration
                  </text>

                  <rect
                    x="90"
                    y="100"
                    width="220"
                    height="30"
                    rx="6"
                    fill="#f1f1f1"
                    className="dark:fill-gray-700"
                  />
                  <text
                    x="100"
                    y="120"
                    fontSize="10"
                    fill="#999"
                    className="dark:fill-gray-400"
                  >
                    Connect to workspace
                  </text>

                  <rect
                    x="90"
                    y="145"
                    width="40"
                    height="40"
                    rx="8"
                    fill="hsl(25, 95%, 53.1%, 0.2)"
                  />
                  <path
                    d="M100 165 L110 175 L120 155"
                    stroke="hsl(25, 95%, 53.1%)"
                    strokeWidth="3"
                    fill="none"
                  />
                  <rect
                    x="140"
                    y="155"
                    width="80"
                    height="10"
                    rx="5"
                    fill="#f1f1f1"
                    className="dark:fill-gray-700"
                  />

                  <rect
                    x="90"
                    y="195"
                    width="40"
                    height="40"
                    rx="8"
                    fill="hsl(25, 95%, 53.1%, 0.2)"
                  />
                  <path
                    d="M100 215 L110 225 L120 205"
                    stroke="hsl(25, 95%, 53.1%)"
                    strokeWidth="3"
                    fill="none"
                  />
                  <rect
                    x="140"
                    y="205"
                    width="100"
                    height="10"
                    rx="5"
                    fill="#f1f1f1"
                    className="dark:fill-gray-700"
                  />

                  <circle
                    cx="320"
                    cy="250"
                    r="40"
                    fill="hsl(25, 95%, 53.1%, 0.2)"
                    opacity="0.6"
                  />
                </svg>
              </div>
            </AnimateIn>
          </div>
        </div>

        <div className="relative mb-24">
          <div className="flex flex-col md:flex-row items-center">
            <AnimateIn
              from="left"
              delay={300}
              className="md:w-1/2 order-1 mb-8 md:mb-0"
            >
              <div className="relative mx-auto md:mr-0 w-full max-w-md">
                <svg viewBox="0 0 400 300" className="w-full h-auto">
                  <defs>
                    <linearGradient
                      id="grad2"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="hsl(25, 95%, 53.1%, 0.1)" />
                      <stop
                        offset="100%"
                        stopColor="hsl(25, 95%, 53.1%, 0.3)"
                      />
                    </linearGradient>
                  </defs>
                  <rect
                    x="50"
                    y="30"
                    width="300"
                    height="240"
                    rx="20"
                    fill="url(#grad2)"
                  />
                  <rect
                    x="70"
                    y="50"
                    width="260"
                    height="200"
                    rx="12"
                    fill="white"
                    className="dark:fill-gray-800"
                  />
                  <circle cx="90" cy="70" r="6" fill="#f44336" />
                  <circle cx="110" cy="70" r="6" fill="#ffc107" />
                  <circle cx="130" cy="70" r="6" fill="#4caf50" />
                  <text
                    x="160"
                    y="75"
                    fontSize="12"
                    fill="#666"
                    className="dark:fill-gray-300"
                  >
                    Channel Setup
                  </text>

                  <rect
                    x="90"
                    y="100"
                    width="220"
                    height="30"
                    rx="6"
                    fill="#f1f1f1"
                    className="dark:fill-gray-700"
                  />
                  <text
                    x="100"
                    y="120"
                    fontSize="10"
                    fill="#999"
                    className="dark:fill-gray-400"
                  >
                    # pie-assistant
                  </text>

                  <circle
                    cx="110"
                    cy="165"
                    r="20"
                    fill="#f1f1f1"
                    className="dark:fill-gray-700"
                  />
                  <circle cx="110" cy="165" r="10" fill="hsl(25, 95%, 53.1%)" />
                  <rect
                    x="140"
                    y="155"
                    width="80"
                    height="8"
                    rx="4"
                    fill="#f1f1f1"
                    className="dark:fill-gray-700"
                  />
                  <rect
                    x="140"
                    y="168"
                    width="50"
                    height="6"
                    rx="3"
                    fill="#f1f1f1"
                    className="dark:fill-gray-700"
                  />

                  <rect
                    x="90"
                    y="195"
                    width="220"
                    height="40"
                    rx="6"
                    fill="#f1f1f1"
                    className="dark:fill-gray-700"
                  />
                  <rect
                    x="195"
                    y="210"
                    width="10"
                    height="10"
                    fill="none"
                    stroke="#999"
                    strokeWidth="2"
                    rx="1"
                  />
                  <path
                    d="M195 215 L200 220 L205 215"
                    fill="none"
                    stroke="#999"
                    strokeWidth="2"
                  />

                  <circle
                    cx="70"
                    cy="250"
                    r="40"
                    fill="hsl(25, 95%, 53.1%, 0.2)"
                    opacity="0.6"
                  />
                </svg>
              </div>
            </AnimateIn>
            <AnimateIn
              from="right"
              delay={500}
              className="md:w-1/2 md:pl-12 order-2"
            >
              <div className="mb-4">
                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
                  Step 2
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Create a channel of your choice
              </h3>
              <p className="text-muted-foreground mb-6 max-w-xl mr-auto">
                Set up a dedicated channel where pie will live. Customize it to
                fit your team's needs and start collaborating right away.
              </p>
            </AnimateIn>
          </div>
        </div>

        {/* Step 3 */}
        <div className="relative">
          <div className="flex flex-col md:flex-row items-center">
            <AnimateIn
              from="left"
              className="md:w-1/2 md:pr-12 md:text-right order-2 md:order-1"
            >
              <div className="mb-4">
                <span className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
                  Step 3
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Configure channel settings
              </h3>
              <p className="max-w-xl text-muted-foreground mb-6 ml-auto">
                Customize when and how pie sends messages. Set up triggers,
                schedule regular updates, or let pie respond to specific
                keywords.
              </p>
            </AnimateIn>
            <AnimateIn
              from="right"
              delay={700}
              className="md:w-1/2 order-1 md:order-2 mb-8 md:mb-0"
            >
              <div className="relative mx-auto md:ml-0 w-full max-w-md">
                <svg viewBox="0 0 400 300" className="w-full h-auto">
                  <defs>
                    <linearGradient
                      id="grad3"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="100%"
                    >
                      <stop offset="0%" stopColor="hsl(25, 95%, 53.1%, 0.1)" />
                      <stop
                        offset="100%"
                        stopColor="hsl(25, 95%, 53.1%, 0.3)"
                      />
                    </linearGradient>
                  </defs>
                  <rect
                    x="50"
                    y="30"
                    width="300"
                    height="240"
                    rx="20"
                    fill="url(#grad3)"
                  />
                  <rect
                    x="70"
                    y="50"
                    width="260"
                    height="200"
                    rx="12"
                    fill="white"
                    className="dark:fill-gray-800"
                  />
                  <circle cx="90" cy="70" r="6" fill="#f44336" />
                  <circle cx="110" cy="70" r="6" fill="#ffc107" />
                  <circle cx="130" cy="70" r="6" fill="#4caf50" />
                  <text
                    x="160"
                    y="75"
                    fontSize="12"
                    fill="#666"
                    className="dark:fill-gray-300"
                  >
                    Channel Settings
                  </text>

                  <rect
                    x="90"
                    y="100"
                    width="220"
                    height="30"
                    rx="6"
                    fill="#f1f1f1"
                    className="dark:fill-gray-700"
                  />
                  <text
                    x="100"
                    y="120"
                    fontSize="10"
                    fill="#999"
                    className="dark:fill-gray-400"
                  >
                    Message Triggers
                  </text>

                  {/* Toggle switches */}
                  <rect
                    x="90"
                    y="145"
                    width="220"
                    height="20"
                    rx="10"
                    fill="#f1f1f1"
                    className="dark:fill-gray-700"
                  />
                  <circle cx="100" cy="155" r="8" fill="hsl(25, 95%, 53.1%)" />
                  <text
                    x="120"
                    y="160"
                    fontSize="10"
                    fill="#666"
                    className="dark:fill-gray-300"
                  >
                    Daily summaries
                  </text>

                  <rect
                    x="90"
                    y="175"
                    width="220"
                    height="20"
                    rx="10"
                    fill="#f1f1f1"
                    className="dark:fill-gray-700"
                  />
                  <circle cx="290" cy="185" r="8" fill="hsl(25, 95%, 53.1%)" />
                  <text
                    x="120"
                    y="190"
                    fontSize="10"
                    fill="#666"
                    className="dark:fill-gray-300"
                  >
                    Keyword alerts
                  </text>

                  <rect
                    x="90"
                    y="205"
                    width="220"
                    height="20"
                    rx="10"
                    fill="#f1f1f1"
                    className="dark:fill-gray-700"
                  />
                  <circle cx="100" cy="215" r="8" fill="hsl(25, 95%, 53.1%)" />
                  <text
                    x="120"
                    y="220"
                    fontSize="10"
                    fill="#666"
                    className="dark:fill-gray-300"
                  >
                    Team notifications
                  </text>

                  {/* Bell icon */}
                  <circle
                    cx="320"
                    cy="250"
                    r="40"
                    fill="hsl(25, 95%, 53.1%, 0.2)"
                    opacity="0.6"
                  />
                  <circle
                    cx="320"
                    cy="230"
                    r="15"
                    fill="hsl(25, 95%, 53.1%, 0.6)"
                  />
                  <path
                    d="M315 230 L325 230 L325 238 L320 243 L315 238 Z"
                    fill="white"
                  />
                  <path
                    d="M318 228 L322 228 L322 226 C322 224.9 321.1 224 320 224 C318.9 224 318 224.9 318 226 Z"
                    fill="white"
                  />
                </svg>
              </div>
            </AnimateIn>
          </div>
        </div>
      </div>
    </section>
  );
}
