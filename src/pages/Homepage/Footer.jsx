import React from 'react'
import { Link } from 'react-router-dom';

const Footer = () => {
     const schooDetail = JSON.parse(localStorage.getItem('setupSchoolApi'));
  return (
    <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
          
          {/* Top: Logo + Newsletter */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8 border-b border-gray-800">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {schooDetail?.name?.charAt(0) || 'C'}
                  </span>
                </div>
                <span className="font-bold text-lg text-white">
                  {schooDetail?.name || 'CBT System'}
                </span>
              </div>
            </div>

            <div className="lg:col-span-2">
              {/* <h4 className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-4">
                Follow Us
              </h4> */}
              {/* <div className="flex items-center gap-4">
                {[Facebook, Instagram, Linkedin, Twitter, Youtube].map((Icon, idx) => (
                  <a key={idx} href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div> */}
            </div>
          </div>

          {/* Middle: Link Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-b border-gray-800">
            {[
              {
                title: 'Platform',
                links: [
                  { label: 'Overview', helpId: '1-system-overview' },
                  { label: 'Students', helpId: '8-student-management' },
                  { label: 'Exams', helpId: '9-examination-configuration' },
                  { label: 'Results', helpId: '16-result-processing' },
                  { label: 'Analytics', helpId: '7-overview-page' },
                ],
              },
              {
                title: 'Features',
                links: [
                  { label: 'OBJ Exams', helpId: '11-objective-obj-examinations' },
                  { label: 'Theory Exams', helpId: '12-theory-examinations' },
                  { label: 'Past Results', helpId: '22-past-results' },
                  { label: 'Reviews', helpId: '20-behavioral-assessment' },
                  { label: 'Settings', helpId: '3-initial-school-setup' },
                ],
              },
              {
                title: 'About',
                links: [
                  { label: 'Our Mission', helpId: '1-system-overview' },
                  { label: 'Advisory Council', helpId: '2-who-uses-the-system-roles-at-a-glance' },
                  { label: 'Careers', helpId: '2-who-uses-the-system-roles-at-a-glance' },
                  { label: 'Contact Us', helpId: 'getting-help' },
                ],
              },
              {
                title: 'Legal',
                links: [
                  { label: 'Privacy Policy', helpId: 'getting-help' },
                  { label: 'Terms of Service', helpId: 'getting-help' },
                  { label: 'Cookie Policy', helpId: 'getting-help' },
                  { label: 'Disclaimer', helpId: 'getting-help' },
                ],
              },
            ].map((col, idx) => (
              <div key={idx}>
                <h4 className="text-xs font-semibold tracking-wider text-gray-400 uppercase mb-4">
                  {col.title}
                </h4>
                <ul className="space-y-2">
                  {col.links.map(({ label, helpId }) => (
                    <li key={label}>
                      <Link to={`/help#${helpId}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom: Help Guide Link */}
          <div className="py-6 border-b border-gray-800">
            <Link to="/help#1-system-overview" className="text-sm text-gray-400 hover:text-white transition-colors">
              Browse the Help Guide
            </Link>
          </div>

          {/* Final Copyright */}
          <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-500">
              © 2026 {schooDetail?.name || 'CBT System'}. All Rights Reserved.
            </p>
            <p className="text-xs text-gray-500 text-center md:text-right">
              {schooDetail?.name || 'CBT System'} was developed by nisha
            </p>
          </div>

        </div>
      </footer>
  )
}

export default Footer
