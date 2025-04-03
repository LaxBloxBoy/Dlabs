import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-white font-serif font-bold text-2xl">
              D-Code Labs
            </Link>
            <p className="mt-2 text-sm text-slate-400">
              Empowering careers through expert-led online education and cutting-edge learning technology.
            </p>
            <div className="mt-4 flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-slate-300">
                <span className="sr-only">Facebook</span>
                <Facebook size={18} />
              </a>
              <a href="#" className="text-slate-400 hover:text-slate-300">
                <span className="sr-only">Instagram</span>
                <Instagram size={18} />
              </a>
              <a href="#" className="text-slate-400 hover:text-slate-300">
                <span className="sr-only">Twitter</span>
                <Twitter size={18} />
              </a>
              <a href="#" className="text-slate-400 hover:text-slate-300">
                <span className="sr-only">LinkedIn</span>
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">Company</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/about" className="text-base text-slate-400 hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <a href="#" className="text-base text-slate-400 hover:text-white">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-slate-400 hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-slate-400 hover:text-white">
                  Partners
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">Resources</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-slate-400 hover:text-white">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-slate-400 hover:text-white">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-slate-400 hover:text-white">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-slate-400 hover:text-white">
                  Webinars
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">Legal</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-slate-400 hover:text-white">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-slate-400 hover:text-white">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-slate-400 hover:text-white">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-700 pt-8">
          <p className="text-base text-slate-400 text-center">
            &copy; {new Date().getFullYear()} D-Code Labs, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
