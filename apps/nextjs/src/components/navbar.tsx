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

          <div >
            <div className="ml-10 flex items-center space-x-8">
              <Link
                href="/dashboard"
                className="bg-primary text-white block px-3 py-2 rounded-lg hover:bg-orange-600"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
