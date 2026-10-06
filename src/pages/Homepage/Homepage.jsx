import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { checkSchoolExists } from '../../api/school.api';
import Button from '../../components/common/Button';
import { 
  Search, 
  BookOpen, 
  TrendingUp, 
  Users, 
  FileText, 
  Award, 
  ChevronRight,
  Play,
  ArrowRight,
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import Reveal from './Reveal';

export default function Homepage() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(false);
  const schooDetail = JSON.parse(localStorage.getItem('setupSchoolApi'));

  // --- YOUR ORIGINAL REDIRECT LOGIC (UNTOUCHED) ---
  useEffect(() => {
    if (!schooDetail?.name) {
      navigate('/school-setup/info');
    }
  }, [schooDetail?.name]);

  // --- YOUR ORIGINAL GET STARTED LOGIC (UNTOUCHED) ---
  const handleGetStarted = async () => {
    setChecking(true);
    try {
      const { data } = await checkSchoolExists();
      navigate(data.exists ? '/login' : '/login');
    } catch {
      navigate('/login');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-white  text-gray-900 overflow-x-hidden">
      
      {/* Section 1 */}
      <Navbar handlegetstart={handleGetStarted} checkingva={checking} />

      {/* ========================================================= */}
      {/* 2. HERO BANNER */}
      {/* ========================================================= */}
      <section className="relative bg-blue-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            
            {/* Left: Headline — LEFT column → fade-in-left */}
            <div className="lg:col-span-2">
              <Reveal animation="fade-in" delay={0}>
                <h1 className="text-3xl lg:text-5xl font-bold text-white leading-tight mb-4">
                  {schooDetail?.HeadLine || 'Manage your school\'s examinations in one place.'}
                </h1>
              </Reveal>
              <Reveal animation="fade-in-left" delay={100}>
                <p className="text-base lg:text-lg text-blue-100 leading-relaxed mb-8 max-w-2xl">
                  {schooDetail?.description || 'Set up your school, manage students, create OBJ and theory exams, record and release results, and keep years of past results organized.'}
                </p>
              </Reveal>
              <Reveal animation="fade-in-left" delay={200}>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleGetStarted}
                    disabled={checking}
                    className="inline-flex items-center gap-2 bg-white text-blue-900 text-sm font-semibold px-6 py-3 rounded-md transition-all duration-300 hover:bg-blue-50 hover:shadow-lg hover:shadow-white/20 hover:-translate-y-0.5 active:translate-y-0 group"
                  >
                    {checking ? 'Checking...' : 'Get Started'}
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                  <a 
                    href="#how-it-works"
                    className="inline-flex items-center gap-2 text-white text-sm font-semibold px-6 py-3 rounded-md border border-white/30 transition-all duration-300 hover:bg-white/10 hover:border-white/60 hover:-translate-y-0.5"
                  >
                    How It Works
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Right: Featured Card — RIGHT column → fade-in-right */}
            <div className="hidden lg:block">
              <Reveal animation="fade-in-right" delay={300}>
                <div className="bg-white/10 border border-white/20 rounded-lg p-6 backdrop-blur-sm transition-all duration-500 hover:bg-white/15 hover:border-white/40 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1">
                  <span className="text-[10px] font-semibold tracking-wider text-blue-200 uppercase">
                    Featured
                  </span>
                  <h3 className="text-white font-semibold text-lg mt-2 mb-2">
                    Complete School Management
                  </h3>
                  <p className="text-blue-100 text-sm leading-relaxed">
                    From student registration to result release, everything you need to run a modern school.
                  </p>
                  <button
                    onClick={() => navigate('/login')}
                    className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-white uppercase tracking-wider transition-all duration-300 hover:text-blue-200 hover:gap-2 group"
                  >
                    Login to Dashboard <ChevronRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. MAIN CONTENT GRID */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT column → fade-in-left */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Main Featured */}
              <Reveal animation="fade-in-left" delay={0} className="md:col-span-2">
                <Link
                  to="/help#1-system-overview"
                  className="group cursor-pointer block"
                >
                  <div className="aspect-[16/9] overflow-hidden rounded-lg bg-gray-100 mb-4">
                    <img 
                      src="https://uonbi.ac.ke/sites/default/files/61st_Graduation_Ceremony_September_2019_8640.jpg" 
                      alt="School Management"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                  <span className="text-[10px] font-semibold tracking-wider text-blue-600 uppercase">
                    Platform Overview
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 mt-2 leading-tight transition-colors duration-300 group-hover:text-blue-600">
                    How Our CBT Platform Transforms School Examinations
                  </h2>
                  <p className="text-sm text-gray-500 mt-2">
                    A comprehensive guide to managing students, exams, results, and academic history.
                  </p>
                  <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-blue-600 transition-all duration-300 group-hover:gap-2">
                    Read more <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            </div>

            {/* Related Links */}
            <Reveal animation="fade-in-left" delay={100} className="mb-8">
              <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-4 pb-2 border-b border-gray-200">
                Related Features
              </h3>
              <ul className="space-y-3">
                {[
                  { title: 'How Students Are Automatically Assigned IDs by Class and Arm', helpId: '8-student-management' },
                  { title: 'Creating OBJ and Theory Exams with Full Configuration Control', helpId: '9-examination-configuration' },
                  { title: 'Tracking 6 Years of Academic Performance Per Student', helpId: '22-past-results' },
                  { title: 'Releasing Results and Automatically Advancing to the Next Term', helpId: '16-result-processing' },
                ].map((link, idx) => (
                  <li key={idx}>
                    <Link 
                      to={`/help#${link.helpId}`} 
                      className="flex items-start gap-2 group cursor-pointer transition-all duration-300 hover:translate-x-1"
                    >
                      <ChevronRight className="w-4 h-4 text-blue-600 shrink-0 mt-0.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                      <span className="text-sm text-gray-700 transition-colors duration-300 group-hover:text-blue-600">
                        {link.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>

            {/* Other Top Stories */}
            <Reveal animation="fade-in-left" delay={200}>
              <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-4 pb-2 border-b border-gray-200">
                Other Platform Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Bulk Student Import and Class/Arm Filtering', helpId: '8-student-management' },
                  { title: 'Real-Time Performance Analytics Dashboard', helpId: '7-overview-page' },
                  { title: 'Cognitive and Behavioral Student Reviews', helpId: '20-behavioral-assessment' },
                  { title: 'Danger Zone: Release Results and Session Advancement', helpId: '17-term-results' },
                ].map((item, idx) => (
                  <Link 
                    key={idx} 
                    to={`/help#${item.helpId}`} 
                    className="group cursor-pointer p-3 -m-3 rounded-lg transition-all duration-300 hover:bg-gray-50 hover:translate-x-1"
                  >
                    <p className="text-sm font-medium text-gray-900 transition-colors duration-300 group-hover:text-blue-600 leading-snug">
                      {item.title}
                    </p>
                  </Link>
                ))}
              </div>
            </Reveal>
          </div>

          {/* RIGHT column → fade-in-right */}
          <aside className="space-y-6">
            
            {/* Find Features Card */}
            <Reveal animation="fade-in-right" delay={100}>
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200 transition-all duration-300 hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5">
                <h3 className="text-sm font-bold text-gray-900 mb-4">
                  Find the Best Features
                </h3>
                <div className="space-y-4">
                  {[
                    { stat: '100%', label: 'Automated Student ID Generation' },
                    { stat: '6 Years', label: 'Academic Result History' },
                    { stat: '3 Terms', label: 'Per Academic Session' },
                    { stat: '2 Exam Types', label: 'OBJ and Theory Support' },
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      className="border-b border-gray-200 pb-3 last:border-0 last:pb-0 transition-all duration-300 hover:pl-1 group cursor-default"
                    >
                      <div className="text-lg font-bold text-blue-600 transition-transform duration-300 group-hover:scale-105 origin-left">
                        {item.stat}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Our Top Picks Card */}
            <Reveal animation="fade-in-right" delay={200}>
              <div className="bg-white rounded-lg p-5 border border-gray-200 transition-all duration-300 hover:border-blue-200 hover:shadow-md hover:-translate-y-0.5">
                <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-4">
                  Top Picks for Schools
                </h3>
                <ul className="space-y-2">
                  {[
                    'Bulk Student Registration',
                    'Automated Result Calculation',
                    'Performance Analytics Charts',
                    'Past 6-Year Result Viewer',
                  ].map((item, idx) => (
                    <li 
                      key={idx} 
                      className="flex items-start gap-2 transition-all duration-300 hover:translate-x-1 cursor-default"
                    >
                      <ChevronRight className="w-3 h-3 text-blue-600 shrink-0 mt-1" />
                      <span className="text-sm text-gray-700 transition-colors duration-300 hover:text-blue-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>    
          </aside>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. LATEST FEATURES GRID */}
      {/* ========================================================= */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 lg:px-6 py-16 border-t border-gray-200">
        <Reveal animation="fade-in-up" delay={0}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              tag: 'Step 01',
              title: 'Set Up Your School',
              desc: 'Configure your school name, classes, arms, and subjects in minutes.',
              helpId: '3-initial-school-setup',
              img: 'https://unsplash.com/photos/person-typing-on-a-laptop-at-a-wooden-desk-y4h0lH6QxhY',
            },
            {
              tag: 'Step 02',
              title: 'Add Students & Teachers',
              desc: 'Register students with auto-generated IDs. Assign them to classes and arms.',
              helpId: '8-student-management',
              img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            },
            {
              tag: 'Step 03',
              title: 'Create & Configure Exams',
              desc: 'Set up OBJ and theory exams. Define total questions, marks, and duration.',
              helpId: '9-examination-configuration',
              img: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            },
            {
              tag: 'Step 04',
              title: 'Record & Release Results',
              desc: 'Enter results, add remarks, and release them. The system advances to the next term automatically.',
              helpId: '16-result-processing',
              img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
            },
          ].map((item, idx) => (
            <Reveal key={idx} animation="fade-in-up" delay={idx * 100}>
              <Link 
                to={`/help#${item.helpId}`} 
                className="group cursor-pointer transition-all duration-300 hover:-translate-y-1 block"
              >
                <div className="aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 mb-4">
                  <img 
                    src={item.img} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                </div>
                <span className="text-[10px] font-semibold tracking-wider text-blue-600 uppercase">
                  {item.tag}
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-1 mb-2 transition-colors duration-300 group-hover:text-blue-600">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
                <span className="inline-flex items-center gap-1 mt-3 text-xs font-medium text-blue-600 transition-all duration-300 group-hover:gap-2">
                  Read more <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. FEATURED CONTENT + SIDEBAR */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-12 border-t border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* LEFT column → fade-in-left */}
          <div className="lg:col-span-2">
            <Reveal animation="fade-in-left" delay={0}>
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-6 transition-all duration-300 hover:border-blue-200 hover:shadow-md">
                <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-4">
                  Performance Analytics
                </h3>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  Quarterly Student Performance Survey
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Track student performance across terms with visual charts showing averages, 
                  class comparisons, and individual progress. Understand trends at a glance.
                </p>
                <div className="flex items-center gap-4">
                  {[
                    { value: '76.4%', label: 'School Average' },
                    { value: '1,248', label: 'Total Students' },
                    { value: '24', label: 'Active Exams' },
                  ].map((stat, idx) => (
                    <div 
                      key={idx} 
                      className="flex-1 bg-white rounded-lg p-4 border border-gray-200 transition-all duration-300 hover:border-blue-200 hover:shadow-sm hover:-translate-y-0.5"
                    >
                      <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
                      <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal animation="fade-in-left" delay={100}>
              <div className="bg-white rounded-lg p-6 border border-gray-200 transition-all duration-300 hover:border-blue-200 hover:shadow-md">
                <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-4">
                  Platform Highlights
                </h3>
                <div className="space-y-4">
                  {[
                    { title: 'Automated Student ID Generation', duration: 'Instant', desc: 'IDs are generated as SCH/CLASS/ARM/001' },
                    { title: '6-Year Academic History', duration: 'Per Student', desc: 'View results across all sessions and terms' },
                    { title: 'Role-Based Access Control', duration: 'Secure', desc: 'Admins and Super Admins have different permissions' },
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0 transition-all duration-300 hover:bg-gray-50 -mx-2 px-2 rounded-md cursor-default"
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 transition-all duration-300 hover:bg-blue-100 hover:scale-105">
                        <Play className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-900">{item.title}</span>
                          <span className="text-[10px] font-medium text-gray-400">{item.duration}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* RIGHT column → fade-in-right */}
          <aside className=''>
            <Reveal animation="fade-in-right" delay={200} className="h-full">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden h-full transition-all duration-500 hover:border-blue-200 hover:shadow-lg group">
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                    alt="Modern School"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    Built for Modern Schools
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    Whether you manage 50 students or 5,000, our platform scales with your needs. 
                    Role-based access ensures the right people have the right permissions.
                  </p>
                  <button
                    onClick={() => navigate('/login')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 uppercase tracking-wider transition-all duration-300 hover:text-blue-700 hover:gap-2"
                  >
                    Learn More <ChevronRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. PROMO BANNER */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        <Reveal animation="fade-in-up" delay={0}>
          <div className="bg-blue-50 rounded-lg border border-blue-100 p-8 lg:p-12 transition-all duration-300 hover:border-blue-200 hover:shadow-md">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Left content */}
              <Reveal animation="fade-in-left" delay={100}>
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                  {schooDetail?.name || 'CBT System'} Simulator
                </h2>
                <p className="text-sm lg:text-base text-gray-600 leading-relaxed mb-6">
                  Practice managing a school with virtual students, exams, and results. 
                  No sign-up required — explore the platform freely.
                </p>
                <button
                  onClick={handleGetStarted}
                  disabled={checking}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-semibold px-6 py-3 rounded-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 hover:-translate-y-0.5 active:translate-y-0 group"
                >
                  {checking ? 'Checking...' : 'Start Exploring'}
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Reveal>
              {/* Right image */}
              <div className="hidden lg:block">
                <Reveal animation="fade-in-right" delay={200}>
                  <div className="aspect-[16/10] bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
                    <img 
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                      alt="Dashboard Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ========================================================= */}
      {/* 7. "FOR ADVISORS" STYLE - THREE COLUMNS */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-12 border-t border-gray-200">
        <Reveal animation="fade-in-up" delay={0}>
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Built for Every Role in Your School
            </h2>
            <p className="text-sm text-gray-500">
              The tools you need to manage your school efficiently. <Link to="/help#2-who-uses-the-system-roles-at-a-glance" className="text-blue-600 hover:underline transition-colors">Learn more</Link>.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'School Administrators',
              desc: 'Full control over students, classes, arms, subjects, and exam configurations.',
              icon: Users,
              helpId: '2-who-uses-the-system-roles-at-a-glance',
            },
            {
              title: 'Super Admins',
              desc: 'Edit and delete students, manage other admins, and access the Danger Zone.',
              icon: Award,
              helpId: '2-who-uses-the-system-roles-at-a-glance',
            },
            {
              title: 'Teachers',
              desc: 'Add students, create exams, enter results, and provide academic and behavioral remarks.',
              icon: BookOpen,
              helpId: '2-who-uses-the-system-roles-at-a-glance',
            },
          ].map((item, idx) => (
            <Reveal key={idx} animation="fade-in-up" delay={idx * 100}>
              <div 
                className="bg-gray-50 rounded-lg p-6 border border-gray-200 transition-all duration-300 hover:border-blue-200 hover:shadow-md hover:bg-white hover:-translate-y-1 group h-full"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-blue-100 group-hover:scale-110">
                  <item.icon className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2 transition-colors duration-300 group-hover:text-blue-600">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{item.desc}</p>
                <Link 
                  to={`/help#${item.helpId}`} 
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 uppercase tracking-wider transition-all duration-300 hover:text-blue-700 hover:gap-2"
                >
                  Learn More <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 8. "OUR MISSION" SECTION */}
      {/* ========================================================= */}
      <section className="max-w-7xl mx-auto px-4 lg:px-6 py-12 border-t border-gray-200">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT column → fade-in-left */}
          <div className="lg:col-span-2">
            <Reveal animation="fade-in-left" delay={0}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-6">
                {schooDetail?.name || 'CBT System'} was founded with the mission of helping schools improve 
                their examination and result management processes. Our platform serves schools of all sizes — 
                from small private academies to large secondary institutions. Some are moving away from 
                manual record-keeping for the first time, while others are experienced educators looking 
                to modernize their operations. No matter who you are, we are here to help.
              </p>
            </Reveal>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { value: '30+', label: 'Schools Served' },
                { value: '25K+', label: 'Students Managed' },
                { value: '150K+', label: 'Exams Created' },
                { value: '40+', label: 'Active Teachers' },
              ].map((stat, idx) => (
                <Reveal key={idx} animation="fade-in-left" delay={idx * 100}>
                  <div 
                    className="border-l-2 border-blue-600 pl-3 transition-all duration-300 hover:border-blue-500 hover:pl-4 cursor-default group"
                  >
                    <div className="text-xl font-bold text-blue-600 transition-transform duration-300 group-hover:scale-105 origin-left">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal animation="fade-in-left" delay={400}>
              <h3 className="text-base font-bold text-gray-900 mb-2">Inclusive Content</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Our platform is designed to serve a school of all backgrounds. We aspire to support 
                administrators, teachers, and students from diverse backgrounds, particularly those 
                who may be underserved.
              </p>
            </Reveal>
          </div>

          {/* RIGHT column → fade-in-right */}
          <aside>
            <Reveal animation="fade-in-right" delay={100}>
              <h3 className="text-base font-bold text-gray-900 mb-4">
                Advisory Council
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-6">
                Our advisory council brings together independent educators and administrators with 
                decades of real-world experience and advanced degrees, helping ensure our content 
                is practical and grounded in expert advice.
              </p>

              <div className="space-y-4">
                {[
                  { name: 'Carolyn McClanahan', role: 'CFP, MD' },
                  { name: 'Prince Dykes', role: 'MBA, RICP' },
                  { name: 'Marguerita Cheng', role: 'CFP, RICP, CRPC, CSRIC' },
                  { name: 'Douglas Boneparth', role: 'CFP' },
                ].map((person, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0 last:pb-0 transition-all duration-300 hover:pl-1 cursor-default group"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 transition-all duration-300 group-hover:bg-blue-100 group-hover:scale-105">
                      <span className="text-blue-600 text-sm font-bold">
                        {person.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 transition-colors duration-300 group-hover:text-blue-600">
                        {person.name}
                      </p>
                      <p className="text-xs text-gray-500">{person.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </aside>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 9. DARK FOOTER */}
      {/* ========================================================= */}
      <Footer />

    </div>
  );
}