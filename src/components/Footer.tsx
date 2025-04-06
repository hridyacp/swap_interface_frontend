
import React from 'react';
import { HelpCircle, ExternalLink, Twitter, Github } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-auto py-6 px-6 md:px-10 border-t border-gray-800 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-400 hover:text-gray-300 transition-colors">
          © 2025 Interchain Bridge. All rights reserved.
        </div>
        
        <div className="flex items-center gap-6">
          {/* Help Link */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-bridge-purple transition-colors flex items-center gap-1 group"
                >
                  <HelpCircle size={16} className="group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Help</span>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Get help and read our FAQ</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Documentation Link */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-bridge-purple transition-colors flex items-center gap-1 group"
                >
                  <ExternalLink size={16} className="group-hover:scale-110 transition-transform" />
                  <span className="text-sm">Docs</span>
                </a>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Read our documentation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-bridge-purple transition-colors group"
                  >
                    <Twitter size={16} className="group-hover:scale-110 transition-transform" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Follow us on Twitter</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-bridge-purple transition-colors group"
                  >
                    {/* Using a simple Discord SVG icon since lucide-react doesn't have Discord */}
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="group-hover:scale-110 transition-transform"
                    >
                      <circle cx="9" cy="12" r="1" />
                      <circle cx="15" cy="12" r="1" />
                      <path d="M7.5 7.5c3.5-1 5.5-1 9 0" />
                      <path d="M7 16.5c3.5 1 6.5 1 10 0" />
                      <path d="M15.5 17c0 1 1.5 3 2 3 1.5 0 2.833-1.667 3.5-3 .667-1.667.5-5.833-1.5-11.5-1.457-1.015-3-1.34-4.5-1.5l-1 2.5" />
                      <path d="M8.5 17c0 1-1.356 3-1.832 3-1.429 0-2.698-1.667-3.333-3-.635-1.667-.476-5.833 1.428-11.5C6.151 4.485 7.545 4.16 9 4l1 2.5" />
                    </svg>
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Join our Discord community</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-bridge-purple transition-colors group"
                  >
                    <Github size={16} className="group-hover:scale-110 transition-transform" />
                  </a>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Explore our GitHub repository</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
