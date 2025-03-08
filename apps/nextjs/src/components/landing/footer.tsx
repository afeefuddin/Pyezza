import Link from "next/link";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

export default function Footer() {
  return (
    <footer id="footer" className="bg-neutral-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="el-1brjz3kd">
        <div className="flex flex-col gap-8 items-center">
          <h1 className="text-white text-4xl text-center font-bold">
            Are you ready to make your workspace a healthy environment?
          </h1>
          <Link href="/dashboard">
            <Button>Integrate Now!</Button>
          </Link>
        </div>
        <Separator className="my-12" />
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center">
          <p
            className="text-gray-400 text-center md:text-left"
            id="el-w2mh43ff"
          >
            © 2025 Pyezza. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0" id="el-9o1gbnpu">
            <span className="text-gray-400 hover:text-orange-500 transition-colors">
              <Link href="/privacy">Privacy Policy</Link>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
