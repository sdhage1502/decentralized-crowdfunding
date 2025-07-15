'use client';

import { Briefcase, Code, Download, Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const AboutDeveloper = () => {
  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screenbg-[linear-gradient(to_right,#80808022_1px,transparent_1px),linear-gradient(to_bottom,#80808022_1px,transparent_1px)] bg-[size:70px_70px] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
          Meet the Developer
        </h2>
        <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 border border-gray-100 transition-all duration-300 hover:shadow-2xl">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
          <div className="relative">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-full shadow-md">
              <Code size={32} className="text-white" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full opacity-20 blur-md"></div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Shreyash Dhage</h3>
            <p className="text-lg sm:text-xl text-blue-600 font-semibold mb-3">Full Stack Developer</p>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto sm:mx-0">
              Full-stack developer with expertise in web and blockchain technologies. Led innovative projects at Hexadecimal Software, delivering scalable, high-performance solutions.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center sm:justify-start gap-4 mb-8">
          <a
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg"
            href="/Shreyash_Dhage_Resume.pdf"
            download
          >
            <Download size={18} />
            Resume
          </a>
          <a
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg"
            href="https://shreyash-portfoilo-website.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Code size={18} />
            Portfolio
          </a>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50 rounded-xl p-5 mb-8">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getColorClasses('blue')}`}>
              <MapPin size={18} />
            </div>
            <span className="text-sm text-gray-700">Pune, India</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getColorClasses('green')}`}>
              <Phone size={18} />
            </div>
            <span className="text-sm text-gray-700">+91 8999760729</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getColorClasses('purple')}`}>
              <Mail size={18} />
            </div>
            <span className="text-sm text-gray-700 break-all">sdhage1502@gmail.com</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/shreyashdhage"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={18} />
              <span className="text-sm">LinkedIn</span>
            </a>
            <a
              href="https://github.com/sdhage1502"
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={18} />
              <span className="text-sm">GitHub</span>
            </a>
          </div>
        </div>

        {/* Experience */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${getColorClasses('blue')}`}>
              <Briefcase size={18} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Recent Experience</h3>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <p className="font-semibold text-sm text-gray-800">Software Developer Intern</p>
            <p className="text-blue-600 font-medium text-sm">Hexadecimal Software Pvt. Ltd.</p>
            <p className="text-xs text-gray-600 mb-2">Oct 2024 – Apr 2025 | Remote</p>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutDeveloper;