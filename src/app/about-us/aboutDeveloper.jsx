'use client';

import {
  Briefcase,
  CheckCircle,
  Code,
  Cpu,
  Download,
  Github,
  GraduationCap,
  Linkedin,
  MapPin,
  Mail,
  Phone,
  Star,
  Target,
  User,
  Users,
} from 'lucide-react';
import { FaReact ,FaAws} from 'react-icons/fa';
import { DiJava } from 'react-icons/di';
import {
  SiJavascript,
  SiTypescript,
  SiNextdotjs,
  SiNodedotjs,
  SiGraphql,
  SiFirebase,
  SiAmazonaws,
  SiSolidity,
  SiJava,
  SiTailwindcss,
} from 'react-icons/si';

const AboutDeveloper = () => {
  const developerStats = [
    { icon: Briefcase, label: 'Experience', value: '1+ Years', color: 'blue' },
    { icon: Users, label: 'Team Leadership', value: '6 Interns', color: 'green' },
    { icon: Target, label: 'Project Success', value: '95%+', color: 'purple' },
  ];

  const techIcons = [
  { name: 'JavaScript', icon: SiJavascript, color: 'yellow' },
  { name: 'TypeScript', icon: SiTypescript, color: 'blue' },
  { name: 'React', icon: FaReact, color: 'cyan' },
  { name: 'Next.js', icon: SiNextdotjs, color: 'black' },
  { name: 'Node.js', icon: SiNodedotjs, color: 'green' },
  { name: 'Solidity', icon: SiSolidity, color: 'purple' },
  { name: 'Firebase', icon: SiFirebase, color: 'orange' },
  { name: 'AWS', icon: FaAws, color: 'orange' },
  { name: 'GraphQL', icon: SiGraphql, color: 'pink' },
  { name: 'Tailwind', icon: SiTailwindcss, color: 'cyan' },
];

const programmingLanguages = [
  { name: 'Java', icon: DiJava, color: 'red' },
  { name: 'JavaScript', icon: SiJavascript, color: 'yellow' },
  { name: 'TypeScript', icon: SiTypescript, color: 'blue' },
  { name: 'Solidity', icon: SiSolidity, color: 'purple' },
];
 

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      yellow: 'bg-yellow-100 text-yellow-600 border-yellow-200',
      red: 'bg-red-100 text-red-600 border-red-200',
      orange: 'bg-orange-100 text-orange-600 border-orange-200',
      pink: 'bg-pink-100 text-pink-600 border-pink-200',
      cyan: 'bg-cyan-100 text-cyan-600 border-cyan-200',
      black: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[color] || colors.blue;
  };

  const getBgColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200',
      green: 'bg-green-50 border-green-200',
      purple: 'bg-purple-50 border-purple-200',
      yellow: 'bg-yellow-50 border-yellow-200',
      red: 'bg-red-50 border-blue-200',
      orange: 'bg-orange-50 border-blue-200',
      pink: 'bg-pink-50 border-blue-200',
      cyan: 'bg-cyan-50 border-blue-200',
      black: 'bg-gray-50 border-blue-200',
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="border-t border-gray-200 pt-16 px-16 mx-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet the Developer</h2>
        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 bg-white/90 rounded-2xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-start gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl">
              <Code size={32} className="text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Shreyash Dhage</h3>
              <p className="text-lg text-blue-600 font-semibold mb-2">Full Stack Developer</p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Experienced full-stack developer specializing in modern web technologies and blockchain development.
                Recently completed internship at Hexadecimal Software where I led development teams and delivered scalable solutions.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <a
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  href="/Shreyash_Dhage_FullStack_Developer_Resume.pdf"
                  download="Shreyash_Dhage_FullStack_Developer_Resume.pdf"
                >
                  <Download size={16} />
                  Download Resume
                </a>
                <a
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium text-sm"
                  href="" // Replace with actual portfolio URL
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <User size={16} />
                  View Portfolio
                </a>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Star size={16} className="text-blue-600" />
                  Key Achievements
                </h4>
                <div className="space-y-1 text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Built responsive web apps with Next.js, React, TypeScript - improved load times by 20%</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Developed Gatsby blog with GraphQL - boosted organic traffic by 45%</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Led team of 6 interns - reduced content delivery time by 90%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <MapPin size={18} className="text-blue-600" />
              <span className="text-gray-700">Pune, India</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-green-600" />
              <span className="text-gray-700">+91 8999760729</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={18} className="text-purple-600" />
              <span className="text-gray-700">sdhage1502@gmail.com</span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://www.linkedin.com/in/shreyashdhage"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin size={18} />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://github.com/sdhage1502"
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={18} />
                <span>GitHub</span>
              </a>
            </div>
          </div>
          <div className="mb-4">
            <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Cpu size={18} className="text-purple-600" />
              Programming Languages
            </h4>
            <div className="flex flex-wrap gap-2">
              {programmingLanguages.map((lang, idx) => {
                const Icon = lang.icon; // Capitalized for JSX
                return (
                  <div key={idx} className={`flex items-center gap-2 px-3 py-1 text-sm rounded-full border ${getColorClasses(lang.color)}`}>
                    <Icon size={14} />
                    <span>{lang.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Code size={18} className="text-blue-600" />
              Technologies & Tools
            </h4>
            <div className="flex flex-wrap gap-2">
             {techIcons.map((tech, idx) => {
  const Icon = tech.icon;
  return (
    <div
      key={idx}
      className={`flex items-center gap-2 px-3 py-1 text-sm rounded-full border ${getColorClasses(tech.color)}`}
    >
      {Icon && <Icon size={14} />} {/* Safeguard added here */}
      <span>{tech.name}</span>
    </div>
  );
})}

            </div>
          </div>
        </div>
        <div className="space-y-6">
          {developerStats.map((stat, index) => {
            const StatIcon = stat.icon; // Capitalized for JSX
            return (
              <div key={index} className="bg-white/90 rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className={`inline-flex p-3 rounded-xl ${getColorClasses(stat.color)} mb-3`}>
                  <StatIcon size={24} />
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/90 rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg border border-purple-200">
              <GraduationCap size={20} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Education</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-gray-800">Master of Computer Applications</p>
              <p className="text-sm text-gray-600">JSPM's Jayawant Institute, Pune (2023-25)</p>
              <p className="text-sm text-green-600">SGPA: 7.61</p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">Bachelor of Computer Applications</p>
              <p className="text-sm text-gray-600">Vidhya Bharati Mahavidyalaya, Amravati (2020-23)</p>
              <p className="text-sm text-green-600">Percentage: 76.90%</p>
            </div>
          </div>
        </div>
        <div className="bg-white/90 rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg border border-blue-200">
              <Briefcase size={20} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Recent Experience</h3>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Software Developer Intern</p>
            <p className="text-blue-600 font-medium">Hexadecimal Software Pvt. Ltd.</p>
            <p className="text-sm text-gray-600 mb-3">Oct 2024 – Apr 2025 | Remote</p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-500 mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-700">Developed responsive web apps with Next.js, React, TypeScript</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-500 mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-700">Built Gatsby blog with GraphQL - 45% traffic boost</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-500 mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-700">Led 6 interns - 90% faster content delivery</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutDeveloper;