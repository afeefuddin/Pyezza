import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      id="navbar"
      className="fixed w-full z-50 bg-neutral-900/90 backdrop-blur-sm shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="el-xjo6p6n3">
        <div
          className="flex items-center justify-between h-16"
          id="el-gpmcuofj"
        >
          <div className="flex-shrink-0" id="el-sf6a2fbt">
            <Link href="/" className="flex items-center" id="el-n963c0w3">
              <span className="text-primary font-bold text-2xl animate__animated animate__fadeIn">
                Pyezza
              </span>
            </Link>
          </div>

          <div className="hidden md:block" id="el-zo2mfve3">
            <div className="ml-10 flex items-center space-x-8" id="el-cmpyln5q">
              <a
                href="#features"
                className="text-gray-300 hover:text-primary transition-colors duration-300"
                id="el-ve2hjtco"
              >
                Features
              </a>
              <a
                href="#integrations"
                className="text-gray-300 hover:text-primary transition-colors duration-300"
                id="el-izmvovik"
              >
                Integrations
              </a>
              <a
                href="#usecases"
                className="text-gray-300 hover:text-primary transition-colors duration-300"
                id="el-1exnbeoj"
              >
                Use Cases
              </a>
              <a
                href="#pricing"
                className="text-gray-300 hover:text-primary transition-colors duration-300"
                id="el-mafl5k0m"
              >
                Pricing
              </a>
              <Link
                href="/dashboard"
                className="bg-primary text-white block px-3 py-2 rounded-lg hover:bg-orange-600"
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="md:hidden" id="el-36zedrox">
            <button
              id="mobile-menu-button"
              className="text-gray-300 hover:text-white"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                id="el-uf37vshz"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                  id="el-2fu4d975"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div id="mobile-menu" className="hidden md:hidden bg-neutral-900">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3" id="el-vplbbulf">
          <a
            href="#features"
            className="text-gray-300 hover:text-primary block px-3 py-2"
            id="el-f94kzwaw"
          >
            Features
          </a>
          <a
            href="#integrations"
            className="text-gray-300 hover:text-primary block px-3 py-2"
            id="el-2r3mzdmh"
          >
            Integrations
          </a>
          <a
            href="#usecases"
            className="text-gray-300 hover:text-primary block px-3 py-2"
            id="el-bzl8at7c"
          >
            Use Cases
          </a>
          <a
            href="#pricing"
            className="text-gray-300 hover:text-primary block px-3 py-2"
            id="el-0lg176oj"
          >
            Pricing
          </a>
          <Link
            href="/dashboard"
            className="bg-primary text-white block px-3 py-2 rounded-lg hover:bg-orange-600"
            id="el-5zwuwhom"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
