import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  ChevronRight, 
  ArrowUp,
  Users,
  FileText,
  Award,
  ShieldCheck,
  Settings,
  CheckCircle2,
  Activity,
  Lock,
  GraduationCap,
  ClipboardList,
  Info,
  AlertTriangle
} from 'lucide-react';

// =========================================================
// TABLE OF CONTENTS DATA
// =========================================================
const TOC = [
  { id: '1-system-overview', num: 1, title: 'System Overview' },
  { id: '2-who-uses-the-system-roles-at-a-glance', num: 2, title: 'Who Uses the System: Roles at a Glance' },
  { id: '3-initial-school-setup', num: 3, title: 'Initial School Setup' },
  { id: '4-super-administrator-structure', num: 4, title: 'Super Administrator Structure' },
  { id: '5-login-and-access-structure', num: 5, title: 'Login and Access Structure' },
  { id: '6-the-dashboard', num: 6, title: 'The Dashboard' },
  { id: '7-overview-page', num: 7, title: 'Overview Page' },
  { id: '8-student-management', num: 8, title: 'Student Management' },
  { id: '9-examination-configuration', num: 9, title: 'Examination Configuration' },
  { id: '10-examination-date-time-opening-and-closing', num: 10, title: 'Examination Date, Time, Opening and Closing' },
  { id: '11-objective-obj-examinations', num: 11, title: 'Objective (OBJ) Examinations' },
  { id: '12-theory-examinations', num: 12, title: 'Theory Examinations' },
  { id: '13-the-student-examination-experience', num: 13, title: 'The Student Examination Experience' },
  { id: '14-theory-examination-submission', num: 14, title: 'Theory Examination Submission' },
  { id: '15-obj-examination-marking', num: 15, title: 'OBJ Examination Marking' },
  { id: '16-result-processing', num: 16, title: 'Result Processing' },
  { id: '17-term-results', num: 17, title: 'Term Results' },
  { id: '18-student-result-access', num: 18, title: 'Student Result Access' },
  { id: '19-password-management', num: 19, title: 'Password Management' },
  { id: '20-behavioral-assessment', num: 20, title: 'Behavioral Assessment' },
  { id: '21-current-results', num: 21, title: 'Current Results' },
  { id: '22-past-results', num: 22, title: 'Past Results' },
  { id: '23-quick-reference-permissions-summary', num: 23, title: 'Quick Reference: Permissions Summary' },
  { id: '24-quick-reference-the-complete-examination-workflow', num: 24, title: 'Quick Reference: The Complete Examination Workflow' },
];

// =========================================================
// MAIN COMPONENT
// =========================================================
const UserGuide = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle scroll for back-to-top button
  React.useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


useEffect(() => {
    if (location.hash) {
      const id = location.hash.substring(1);

      const element = document.getElementById(id);

      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  }, [location]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // =========================================================
  // REUSABLE COMPONENTS
  // =========================================================
  const Section = ({ id, num, title, children }) => (
    <section id={id} className="scroll-mt-20">
      <div className="bg-gray-50 border border-blue-200 rounded-lg p-4 lg:p-6 mb-6">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white text-sm font-bold shrink-0">
            {num}
          </span>
          <h2 className="text-lg lg:text-xl font-bold text-gray-900">{title}</h2>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg p-4 lg:p-6 space-y-4">
        {children}
      </div>
    </section>
  );

  const SubHeading = ({ children, level = 3 }) => {
    if (level === 3) {
      return <h3 className="text-base font-semibold text-gray-900 mt-4 mb-2">{children}</h3>;
    }
    return <h4 className="text-sm font-semibold text-gray-800 mt-3 mb-1.5">{children}</h4>;
  };

  const Paragraph = ({ children }) => (
    <p className="text-sm text-gray-600 leading-relaxed">{children}</p>
  );

  const List = ({ items, ordered = false }) => {
    const Tag = ordered ? 'ol' : 'ul';
    return (
      <Tag className={`text-sm text-gray-600 leading-relaxed space-y-1.5 ${ordered ? 'list-decimal' : 'list-disc'} pl-5`}>
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </Tag>
    );
  };

  const Table = ({ headers, rows }) => (
    <div className="overflow-x-auto -mx-4 lg:mx-0">
      <div className="inline-block min-w-full align-middle px-4 lg:px-0">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((h, idx) => (
                <th key={idx} className="px-3 lg:px-4 py-2.5 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="px-3 lg:px-4 py-2.5 text-sm text-gray-600 align-top">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const Callout = ({ type = 'note', children }) => {
    const styles = {
      note: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-900', icon: Info, iconColor: 'text-blue-600' },
      tip: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', icon: CheckCircle2, iconColor: 'text-emerald-600' },
      warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900', icon: AlertTriangle, iconColor: 'text-amber-600' },
    };
    const style = styles[type];
    const Icon = style.icon;
    return (
      <div className={`flex items-start gap-3 p-3 lg:p-4 ${style.bg} border ${style.border} rounded-lg`}>
        <Icon className={`w-4 h-4 lg:w-5 lg:h-5 ${style.iconColor} shrink-0 mt-0.5`} />
        <div className={`text-xs lg:text-sm ${style.text} leading-relaxed`}>{children}</div>
      </div>
    );
  };

  const CodeBlock = ({ children }) => (
    <pre className="bg-gray-50 border border-gray-200 rounded-lg p-3 lg:p-4 overflow-x-auto text-xs lg:text-sm text-gray-700 font-mono leading-relaxed">
      {children}
    </pre>
  );

  return (
    <div className="min-h-screen bg-white">
      
      {/* ========================================================= */}
      {/* HERO HEADER */}
      {/* ========================================================= */}
      <header className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 py-10 lg:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-600 rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs font-semibold tracking-widest text-blue-600 uppercase">
              User Guide
            </span>
          </div>
          <h1 className="text-2xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
            The Complete User Guide to the School CBT Management System
          </h1>
          <p className="text-sm lg:text-base text-gray-600 leading-relaxed max-w-3xl">
            A step-by-step guide to setting up and running a school-based Computer-Based Test (CBT) 
            Management System. It covers school setup, administrator roles, student management, 
            examination configuration, question management, taking examinations, result processing, 
            behavioral assessment, and past results.
          </p>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MAIN CONTENT */}
      {/* ========================================================= */}
      <main className="max-w-4xl mx-auto px-4 lg:px-6 py-8 lg:py-12 space-y-8">

        {/* ========================================================= */}
        {/* TABLE OF CONTENTS */}
        {/* ========================================================= */}
        <div className="bg-gray-50 border border-blue-200 rounded-lg p-4 lg:p-6">
          <h2 className="text-base lg:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-600" />
            Table of Contents
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TOC.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="group flex items-start gap-2 text-left p-2 rounded-md hover:bg-white border border-transparent hover:border-blue-200 transition-all"
              >
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white border border-gray-200 text-[10px] font-bold text-gray-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                  {item.num}
                </span>
                <span className="text-xs lg:text-sm text-gray-700 group-hover:text-blue-600 transition-colors leading-snug">
                  {item.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 1: SYSTEM OVERVIEW */}
        {/* ========================================================= */}
        <Section id="1-system-overview" num={1} title="System Overview">
          <SubHeading>What is the CBT System?</SubHeading>
          <Paragraph>
            The CBT (Computer-Based Test) Management System is a school examination management platform. It lets a school:
          </Paragraph>
          <List items={[
            'Configure its academic structure (classes, arms, and subjects).',
            'Manage its students.',
            'Create and manage examinations.',
            'Set and manage examination questions.',
            'Allow students to take examinations on a computer.',
            'Process examination results.',
            'Let students view their results and academic information.',
          ]} />
          <Paragraph>
            Everything happens in one place, so the school does not need separate tools for registers, 
            question papers, marking, and result sheets.
          </Paragraph>

          <SubHeading>The Dashboard: Your Management Centre</SubHeading>
          <Paragraph>
            After the school has been set up, the <strong>dashboard</strong> is the central management area. 
            Administrators and teachers use it to move between all the major functions of the system. 
            It contains the following sections:
          </Paragraph>
          <Table 
            headers={['Section', 'Purpose']}
            rows={[
              [<strong key="1">Overview</strong>, 'A summary of what is happening in the system: student numbers, examinations, subjects, and class performance.'],
              [<strong key="2">Activities / Recent Activities</strong>, 'A running record of recent actions taken in the system.'],
              [<strong key="3">Students</strong>, 'View, filter, and add students (and, for Super Admins, edit and delete them).'],
              [<strong key="4">Examinations</strong>, 'Create examination configurations and manage questions.'],
              [<strong key="5">Results</strong>, 'Access and manage examination results.'],
              [<strong key="6">Current Results</strong>, 'View the current result information after results have been processed.'],
              [<strong key="7">Past Results</strong>, 'View previous academic results the system has retained.'],
              [<strong key="8">Review</strong>, 'Review examination and result information.'],
              [<strong key="9">Admin</strong>, 'Administrative management, including Super Admin structure.'],
              [<strong key="10">Settings</strong>, 'School and system settings.'],
            ]}
          />

          <SubHeading>How the Sections Work Together</SubHeading>
          <List ordered items={[
            <>The school is <strong>set up</strong> (school information, classes, arms, subjects).</>,
            <><strong>Students</strong> are added and assigned to classes and arms.</>,
            <>Teachers create <strong>examination configurations</strong> and set <strong>questions</strong>.</>,
            <>The Super Admin <strong>opens</strong> the examination, and students take it.</>,
            <>Results are <strong>processed</strong>, and become visible under <strong>Results</strong> and <strong>Current Results</strong>.</>,
            <>Over time, earlier results move into <strong>Past Results</strong>.</>,
          ]} />
          <Paragraph>
            Each step depends on the one before it. For example, you cannot set examination questions 
            until an examination configuration exists, and you cannot create a meaningful configuration 
            until classes, arms, and subjects have been set up.
          </Paragraph>
        </Section>

        {/* ========================================================= */}
        {/* SECTION 2: WHO USES THE SYSTEM */}
        {/* ========================================================= */}
        <Section id="2-who-uses-the-system-roles-at-a-glance" num={2} title="Who Uses the System: Roles at a Glance">
          <Paragraph>The system has three kinds of users, each with different permissions.</Paragraph>
          <Table 
            headers={['Role', 'Main responsibilities']}
            rows={[
              [<strong key="1">Super Admin</strong>, 'Highest level of control. Manages administrators, students (add, edit, delete), opening and closing of examinations, and student password changes/resets.'],
              [<strong key="2">Admin / Teacher</strong>, 'Adds students, creates examination configurations, sets and manages questions, and enters theory results. Cannot edit or delete students.'],
              [<strong key="3">Student</strong>, 'Takes examinations using their Student ID, and views their results and academic information.'],
            ]}
          />
          <Callout type="note">
            <strong>Note:</strong> Each section of this guide states clearly which role can perform an action. 
            A full summary table is provided in Section 23.
          </Callout>
        </Section>

        {/* ========================================================= */}
        {/* SECTION 3: INITIAL SCHOOL SETUP */}
        {/* ========================================================= */}
        <Section id="3-initial-school-setup" num={3} title="Initial School Setup">
          <Paragraph>
            Before the school can properly use the CBT system, it must complete the <strong>initial setup</strong>. 
            Setup happens in four stages, and <strong>each stage depends on the one before it</strong>:
          </Paragraph>
          <CodeBlock>{`Step 1: School Basic Information
        ↓
Step 2: Classes
        ↓
Step 3: Class Arms
        ↓
Step 4: Subject Configuration`}</CodeBlock>
          <Paragraph>
            Completing these steps creates the <strong>foundational academic structure</strong> that the rest of the system relies on.
          </Paragraph>

          <SubHeading>Step 1: School Basic Information</SubHeading>
          <Paragraph>
            The first stage is for the school administrator to provide the school's basic information. 
            This establishes the <strong>school's identity</strong> throughout the platform.
          </Paragraph>
          <SubHeading level={4}>Information to provide:</SubHeading>
          <Table 
            headers={['Field', 'What to enter', 'Why it is useful']}
            rows={[
              [<strong key="1">School name</strong>, 'The official name of the school.', 'Identifies the school across the platform.'],
              [<strong key="2">School headline</strong>, 'A short line that introduces or summarises the school.', 'Gives a quick introduction to the school.'],
              [<strong key="3">School description</strong>, 'A longer description of the school.', 'Gives further information about the school\'s identity and purpose.'],
              [<strong key="4">School email address</strong>, 'The school\'s official email address.', 'Provides an official contact point.'],
              [<strong key="5">School phone number</strong>, 'The school\'s official phone number.', 'Provides an official contact point.'],
              [<strong key="6">School logo</strong>, 'The school\'s logo image.', 'Gives the platform the school\'s visual identity.'],
              [<strong key="7">School motto</strong>, 'The school\'s motto.', 'Reflects the school\'s values and identity.'],
            ]}
          />

          <SubHeading>Step 2: Classes</SubHeading>
          <Paragraph>
            After the basic school information has been provided, the administrator creates the <strong>classes</strong> 
            that exist in the school. The number of classes is <strong>not fixed</strong>. The administrator enters 
            the classes that actually exist in their school.
          </Paragraph>
          <Callout type="note">
            <strong>Example:</strong> A school with six classes: JS1, JS2, JS3, SS1, SS2, SS3. 
            A different school may use an entirely different structure. Enter whatever matches your school.
          </Callout>
          <Paragraph>
            <strong>Why classes matter:</strong> The classes you create here are used throughout the system, 
            including student management, subject assignment, examination configuration, filtering, 
            performance analysis, and results.
          </Paragraph>

          <SubHeading>Step 3: Class Arms</SubHeading>
          <Paragraph>
            After the classes have been created, the administrator configures the <strong>arms</strong> belonging to those classes.
          </Paragraph>
          <SubHeading level={4}>The Automatic Arm Feature (Saves Time)</SubHeading>
          <Paragraph>
            To reduce repetitive data entry, the system can apply an arm to <strong>all previously created classes automatically</strong>.
          </Paragraph>
          <List ordered items={[
            <>Enter an arm name, for example <strong>Arm A</strong>.</>,
            'The system applies that arm to every class created earlier.',
          ]} />
          <Paragraph>
            The administrator does <strong>not</strong> have to enter Arm A separately for each class.
          </Paragraph>
          <SubHeading level={4}>Editing Individual Class-Arm Combinations</SubHeading>
          <Paragraph>
            After the arms have been generated automatically, the administrator can <strong>edit individual 
            class-arm combinations</strong> where necessary.
          </Paragraph>
          <SubHeading level={4}>Arm Names Are Flexible</SubHeading>
          <Paragraph>
            Arm names are <strong>not restricted</strong> to A, B, C, and so on. The school can use whatever 
            naming structure suits it, such as Arm A, Arm B, Blue, Gold, Science, Commercial, or any other 
            appropriate naming convention.
          </Paragraph>

          <SubHeading>Step 4: Subject Configuration</SubHeading>
          <Paragraph>
            After classes and arms have been configured, the administrator configures <strong>subjects</strong>. 
            Subjects are <strong>not automatically assigned to every class</strong>. The administrator decides 
            which subjects belong to which class.
          </Paragraph>
          <List ordered items={[
            'Select a class (or a class and arm combination).',
            'Configure the appropriate subjects for that class.',
          ]} />
          <Callout type="note">
            <strong>Important:</strong> Complete all four setup steps before moving on to students and examinations. 
            Everything else in the system builds on this structure.
          </Callout>
        </Section>

        {/* ========================================================= */}
        {/* SECTION 4: SUPER ADMINISTRATOR STRUCTURE */}
        {/* ========================================================= */}
        <Section id="4-super-administrator-structure" num={4} title="Super Administrator Structure">
          <SubHeading>Why a Super Admin Exists</SubHeading>
          <Paragraph>
            The system does <strong>not</strong> use a public sign-up page. Instead, a <strong>Super Admin</strong> is 
            established as the primary high-level administrator. The Super Admin holds the highest level of control 
            in the system, and the school must always keep Super Admin control in place.
          </Paragraph>

          <SubHeading>Rules of the Super Admin Structure</SubHeading>
          <Table 
            headers={['Rule', 'Explanation']}
            rows={[
              ['A Super Admin can add another Super Admin.', 'An existing Super Admin can create additional Super Admins.'],
              ['A Super Admin can remove/delete their own Super Admin account.', 'A Super Admin may remove their own account where the system permits it.'],
              [<span key="3">A Super Admin <strong>cannot</strong> delete another Super Admin account.</span>, 'One Super Admin cannot remove another.'],
              ['The system protects against losing administrative control.', 'Administrative control must not be accidentally removed in a way that leaves the school without the required Super Admin control.'],
              ['Removing school data or school activities does not remove the Super Admin.', 'Super Admin existence is independent of ordinary school activity data.'],
            ]}
          />

          <SubHeading>Example</SubHeading>
          <List ordered items={[
            <><strong>Super Admin A</strong> creates <strong>Super Admin B</strong>.</>,
            <><strong>Super Admin B cannot delete Super Admin A.</strong></>,
            <><strong>Super Admin A cannot delete Super Admin B.</strong></>,
            <>A Super Admin <strong>may remove their own account</strong> where the system permits it.</>,
          ]} />

          <Callout type="warning">
            <strong>Warning:</strong> Always make sure the school retains Super Admin control. Without it, 
            key actions such as editing or deleting students, opening and closing examinations, and managing 
            student passwords cannot be performed.
          </Callout>
        </Section>

        {/* ========================================================= */}
        {/* SECTION 5: LOGIN AND ACCESS STRUCTURE */}
        {/* ========================================================= */}
        <Section id="5-login-and-access-structure" num={5} title="Login and Access Structure">
          <SubHeading>No Public Registration</SubHeading>
          <Paragraph>
            The CBT system does <strong>not</strong> have a public user registration page. Nobody can simply 
            visit the system and create an account for themselves.
          </Paragraph>

          <SubHeading>Administrative Access vs Student Access</SubHeading>
          <Table 
            headers={['Type of access', 'Who', 'How it works']}
            rows={[
              [<strong key="1">Administrative access</strong>, 'Super Admins and Admins/Teachers', 'Accounts are established within the system\'s administrative structure, beginning with the Super Admin.'],
              [<strong key="2">Student access</strong>, 'Students', 'Students are added to the system by an Admin or Super Admin. Students later access their results using their student credentials (Student ID and password).'],
            ]}
          />
        </Section>

        {/* ========================================================= */}
        {/* SECTION 6: THE DASHBOARD */}
        {/* ========================================================= */}
        <Section id="6-the-dashboard" num={6} title="The Dashboard">
          <Paragraph>
            Once setup is complete, the <strong>dashboard</strong> is where the school manages the CBT system. 
            From it you can reach:
          </Paragraph>
          <List items={[
            <><strong>Overview</strong>: a summary of the system</>,
            <><strong>Activities / Recent Activities</strong>: what has recently happened</>,
            <><strong>Students</strong>: student records</>,
            <><strong>Examinations</strong>: examination configuration and questions</>,
            <><strong>Results</strong>: result management</>,
            <><strong>Current Results</strong>: currently available processed results</>,
            <><strong>Past Results</strong>: previously retained results</>,
            <><strong>Review</strong>: reviewing information</>,
            <><strong>Admin</strong>: administrative management</>,
            <><strong>Settings</strong>: configuration</>,
          ]} />
        </Section>

        {/* ========================================================= */}
        {/* SECTION 7: OVERVIEW PAGE */}
        {/* ========================================================= */}
        <Section id="7-overview-page" num={7} title="Overview Page">
          <Paragraph>
            The <strong>Overview</strong> page gives the administrator a summary of what is happening in the CBT system.
          </Paragraph>

          <SubHeading>Information Shown</SubHeading>
          <List items={[
            'Total number of students',
            'Overall student performance',
            'Examinations created',
            'Total subjects created',
            'Examination-related statistics',
            'Class performance',
            'Recent activities',
          ]} />

          <SubHeading>Examination Graph</SubHeading>
          <Paragraph>
            The system includes an <strong>examination graph</strong>, shown as a <strong>pie chart</strong>. 
            It gives a visual summary of examination information, so the administrator can understand examination 
            data at a glance instead of reading through lists.
          </Paragraph>

          <SubHeading>Class Performance Graph</SubHeading>
          <Paragraph>
            The <strong>performance section</strong> shows performance information for different classes. 
            The administrator can see how each class is performing and use that to understand class performance 
            at a glance.
          </Paragraph>

          <SubHeading>Recent Activities</SubHeading>
          <Paragraph>
            As administrators and teachers perform actions in the system, the platform records the relevant 
            <strong> recent activity</strong>. The <strong>Recent Activities</strong> section helps users see 
            what has recently happened.
          </Paragraph>
          <Callout type="note">
            <strong>Note:</strong> These examples only illustrate the idea of Recent Activities. The actual 
            activities listed depend on what users do in the system.
          </Callout>
        </Section>

        {/* ========================================================= */}
        {/* SECTION 8: STUDENT MANAGEMENT */}
        {/* ========================================================= */}
        <Section id="8-student-management" num={8} title="Student Management">
          <SubHeading>Viewing Students</SubHeading>
          <Paragraph>
            From the dashboard, select <strong>Students</strong>. The page displays the students registered 
            within the school.
          </Paragraph>

          <SubHeading>Filtering Students</SubHeading>
          <Paragraph>You can filter the student list by:</Paragraph>
          <Table 
            headers={['Filter', 'Use']}
            rows={[
              [<strong key="1">Class</strong>, 'Show only students in a selected class (for example, SS1).'],
              [<strong key="2">Arm</strong>, 'Show only students in a selected arm (for example, Arm A).'],
              [<strong key="3">Student ID</strong>, 'Find a specific student by their ID.'],
            ]}
          />

          <SubHeading>Adding a Student</SubHeading>
          <Paragraph>
            Both <strong>Admin</strong> and <strong>Super Admin</strong> users can add students.
          </Paragraph>
          <List ordered items={[
            <>From the dashboard, select <strong>Students</strong>.</>,
            <>Select <strong>Add Student</strong>.</>,
            'Provide the student\'s required information.',
            'Save the student.',
          ]} />

          <SubHeading>Student Permissions</SubHeading>
          <Table 
            headers={['Action', 'Super Admin', 'Admin / Teacher']}
            rows={[
              ['Add students', 'Yes', 'Yes'],
              ['Edit students', 'Yes', <strong key="e" className="text-red-600">No</strong>],
              ['Delete students', 'Yes', <strong key="d" className="text-red-600">No</strong>],
            ]}
          />
          <Callout type="tip">
            <strong>Tip:</strong> If an Admin or Teacher notices an error in a student's record, they should 
            ask the Super Admin to correct it.
          </Callout>
        </Section>

        {/* ========================================================= */}
        {/* SECTION 9: EXAMINATION CONFIGURATION */}
        {/* ========================================================= */}
        <Section id="9-examination-configuration" num={9} title="Examination Configuration">
          <SubHeading>Why Configuration Comes First</SubHeading>
          <Paragraph>
            A teacher cannot go straight to setting questions. An <strong>examination configuration</strong> must 
            exist first. The workflow is:
          </Paragraph>
          <CodeBlock>{`Create Exam Configuration
        ↓
Configure examination details
        ↓
Set / manage questions
        ↓
Review / update questions
        ↓
Open examination
        ↓
Students take examination
        ↓
Results are processed`}</CodeBlock>

          <SubHeading>What an Examination Configuration Contains</SubHeading>
          <List items={[
            'Examination date',
            'Time',
            'Duration',
            'Class',
            'Arm',
            'Subject',
            'Examination type',
            'Other applicable configuration information',
          ]} />

          <SubHeading>Starting Your Work</SubHeading>
          <Paragraph>From the dashboard, select <strong>Examinations</strong>. Then:</Paragraph>
          <List items={[
            <><strong>If an appropriate configuration already exists:</strong> select it and continue setting or managing its questions.</>,
            <><strong>If no appropriate configuration exists:</strong> select <strong>Create Exam Configuration</strong> and complete the configuration before continuing.</>,
          ]} />
        </Section>

        {/* ========================================================= */}
        {/* SECTION 10: EXAMINATION DATE, TIME, OPENING AND CLOSING */}
        {/* ========================================================= */}
        <Section id="10-examination-date-time-opening-and-closing" num={10} title="Examination Date, Time, Opening and Closing">
          <Paragraph>Two separate ideas are often confused. Please read this section carefully.</Paragraph>
          <Table 
            headers={['Concept', 'What it controls', 'Who handles it']}
            rows={[
              [<strong key="1">Exam scheduling (date, time, duration)</strong>, 'The configured examination timing.', 'Set in the examination configuration.'],
              [<strong key="2">Open / Close</strong>, 'Whether students can currently access the examination.', <span key="o">Controlled by the <strong>Super Admin</strong>.</span>],
            ]}
          />

          <SubHeading>Exam Scheduling</SubHeading>
          <Paragraph>
            The <strong>scheduled date, time, and duration</strong> are part of the examination configuration. 
            <strong> The Super Admin does not edit the scheduled date and time after the examination has been configured.</strong>
          </Paragraph>

          <SubHeading>Open and Close</SubHeading>
          <Paragraph>The Super Admin controls whether an examination is currently:</Paragraph>
          <List items={[
            <><strong>Open:</strong> students are allowed to take the examination during the configured examination period/duration.</>,
            <><strong>Closed:</strong> students can no longer take that examination.</>,
          ]} />

          <Callout type="note">
            <strong>"Exam scheduling" decides the configured timing. "Open/Close" decides whether students can 
            currently access the examination.</strong>
          </Callout>
        </Section>

        {/* ========================================================= */}
        {/* SECTION 11: OBJECTIVE (OBJ) EXAMINATIONS */}
        {/* ========================================================= */}
        <Section id="11-objective-obj-examinations" num={11} title="Objective (OBJ) Examinations">
          <SubHeading>Overview</SubHeading>
          <Paragraph>
            An OBJ examination consists of objective questions. The teacher first creates or selects the 
            examination configuration, and then manages the OBJ questions.
          </Paragraph>

          <SubHeading>What the Teacher Can Do</SubHeading>
          <List items={[
            <><strong>Import</strong> questions.</>,
            <><strong>Add or update</strong> questions individually.</>,
            <><strong>View</strong> the questions that have been added.</>,
            <><strong>Continue modifying</strong> questions.</>,
            <><strong>Leave the page and return later.</strong></>,
            <><strong>Continue working</strong> on previously saved questions.</>,
          ]} />

          <SubHeading>Saved Work Is Kept</SubHeading>
          <Paragraph>
            If a teacher has already imported or updated questions and leaves the page, the questions are 
            still there when the teacher returns. The teacher sees the previously saved questions and continues 
            working instead of starting over.
          </Paragraph>

          <SubHeading>Step-by-Step Procedure</SubHeading>
          <List ordered items={[
            <>From the dashboard, select <strong>Examinations</strong>.</>,
            <>Select an existing examination configuration, or select <strong>Create Exam Configuration</strong> if none is suitable.</>,
            <>Open the <strong>OBJ question management</strong> area for that configuration.</>,
            <><strong>Import</strong> questions, or <strong>add</strong> questions individually.</>,
            <><strong>Review</strong> the questions that appear.</>,
            <><strong>Update</strong> any question that needs correction.</>,
            <><strong>Save</strong> your work.</>,
            'You may leave and return later. Your saved questions will still be there.',
          ]} />
        </Section>

        {/* ========================================================= */}
        {/* SECTION 12: THEORY EXAMINATIONS */}
        {/* ========================================================= */}
        <Section id="12-theory-examinations" num={12} title="Theory Examinations">
          <SubHeading>Overview</SubHeading>
          <Paragraph>
            Theory examinations follow a <strong>similar configuration and question-management process</strong> 
            to OBJ examinations. The teacher must have an <strong>examination configuration</strong> before 
            setting the theory examination.
          </Paragraph>

          <SubHeading>What the Teacher Can Do</SubHeading>
          <List items={[
            <><strong>Set</strong> theory questions.</>,
            <><strong>Import</strong> questions where supported.</>,
            <><strong>Update</strong> questions individually.</>,
            <><strong>View</strong> previously added questions.</>,
            <><strong>Leave and return later.</strong></>,
            <><strong>Continue working</strong> on the examination.</>,
          ]} />

          <SubHeading>How Theory Differs from OBJ</SubHeading>
          <List items={[
            <><strong>OBJ</strong> is marked automatically by the system.</>,
            <><strong>Theory</strong> needs the teacher to provide the result.</>,
          ]} />
        </Section>

        {/* ========================================================= */}
        {/* SECTION 13: THE STUDENT EXAMINATION EXPERIENCE */}
        {/* ========================================================= */}
        <Section id="13-the-student-examination-experience" num={13} title="The Student Examination Experience">
          <Paragraph>
            When an examination has been <strong>opened</strong> by the Super Admin, students can begin. 
            Students do not enter the examination immediately.
          </Paragraph>

          <SubHeading>What the Student Sees</SubHeading>
          <List ordered items={[
            <>The student sees an <strong>examination introduction/instruction stage</strong> with the examination instructions.</>,
            <>The student <strong>enters their Student ID.</strong></>,
            <>The Student ID <strong>identifies the student</strong> and lets them proceed to their examination.</>,
            <>The student <strong>enters the examination.</strong></>,
            <>The student <strong>completes the examination.</strong></>,
            <>The student <strong>submits.</strong></>,
          ]} />

          <Callout type="tip">
            <strong>Tip for students:</strong> Keep your Student ID ready before the examination begins, 
            since you will need it to proceed after reading the instructions.
          </Callout>
        </Section>

        {/* ========================================================= */}
        {/* SECTION 14: THEORY EXAMINATION SUBMISSION */}
        {/* ========================================================= */}
        <Section id="14-theory-examination-submission" num={14} title="Theory Examination Submission">
          <SubHeading>What the Student Does</SubHeading>
          <Paragraph>
            For a Theory examination, the student <strong>answers the questions and submits the examination.</strong>
          </Paragraph>

          <SubHeading>What the System Does</SubHeading>
          <Paragraph>
            The system <strong>records that the examination has been completed/submitted.</strong>
          </Paragraph>

          <SubHeading>What the Teacher Does</SubHeading>
          <Paragraph>
            Theory answers need assessment. The teacher later <strong>updates/enters the student's theory result.</strong>
          </Paragraph>

          <SubHeading>Final Result</SubHeading>
          <Paragraph>
            The final result is calculated <strong>after the theory result information has been provided.</strong>
          </Paragraph>
        </Section>

        {/* ========================================================= */}
        {/* SECTION 15: OBJ EXAMINATION MARKING */}
        {/* ========================================================= */}
        <Section id="15-obj-examination-marking" num={15} title="OBJ Examination Marking">
          <Paragraph>OBJ examinations are <strong>marked automatically.</strong></Paragraph>
          <Paragraph>When a student completes and submits an OBJ examination:</Paragraph>
          <List ordered items={[
            <>The system <strong>marks</strong> the examination.</>,
            <>The student's <strong>OBJ score is calculated.</strong></>,
            <>The <strong>result becomes available</strong> within the system/dashboard.</>,
          ]} />

          <SubHeading>Difference from Theory</SubHeading>
          <Table 
            headers={['', 'OBJ', 'Theory']}
            rows={[
              ['Marking', 'Automatic', 'The teacher provides/updates the result'],
              ['Teacher action needed after submission', 'None for marking', 'Enter/update the theory result'],
            ]}
          />
        </Section>

        {/* ========================================================= */}
        {/* SECTION 16: RESULT PROCESSING */}
        {/* ========================================================= */}
        <Section id="16-result-processing" num={16} title="Result Processing">
          <SubHeading>The Two Flows</SubHeading>
          <SubHeading level={4}>Theory:</SubHeading>
          <CodeBlock>{`Student takes examination
        ↓
Student submits
        ↓
Teacher assesses / updates Theory result
        ↓
System calculates the applicable total result`}</CodeBlock>

          <SubHeading level={4}>OBJ:</SubHeading>
          <CodeBlock>{`Student takes examination
        ↓
Student submits
        ↓
System automatically marks OBJ
        ↓
Result becomes available`}</CodeBlock>

          <SubHeading>Combining Results</SubHeading>
          <Paragraph>
            When the relevant components are available, the system <strong>calculates the student's overall result.</strong>
          </Paragraph>
          <Callout type="note">
            <strong>Why a Theory result may seem "pending":</strong> If a student has submitted a Theory 
            examination but the teacher has not yet entered the theory result, the final total cannot be 
            calculated. It is calculated once the theory result information has been provided.
          </Callout>
        </Section>

        {/* ========================================================= */}
        {/* SECTION 17: TERM RESULTS */}
        {/* ========================================================= */}
        <Section id="17-term-results" num={17} title="Term Results">
          <Paragraph>Results are organised by <strong>academic term.</strong> The system handles:</Paragraph>
          <List items={['First Term', 'Second Term', 'Third Term']} />

          <SubHeading>How Result History Builds</SubHeading>
          <Paragraph>A student's result history builds as the terms progress:</Paragraph>
          <Table 
            headers={['Term', 'Information available']}
            rows={[
              [<strong key="1">First Term</strong>, 'First Term result'],
              [<strong key="2">Second Term</strong>, 'First Term + Second Term information'],
              [<strong key="3">Third Term</strong>, 'First Term + Second Term + Third Term information'],
            ]}
          />
        </Section>

        {/* ========================================================= */}
        {/* SECTION 18: STUDENT RESULT ACCESS */}
        {/* ========================================================= */}
        <Section id="18-student-result-access" num={18} title="Student Result Access">
          <SubHeading>How Students View Results</SubHeading>
          <Paragraph>
            Students access their results using their <strong>unique Student ID</strong> and their password.
          </Paragraph>

          <SubHeading>Initial (Default) Password Arrangement</SubHeading>
          <Table 
            headers={['Credential', 'Initial value']}
            rows={[
              [<strong key="1">Student ID</strong>, 'The student\'s unique identification.'],
              [<strong key="2">Password</strong>, <span key="p">The student's <strong>last name</strong>, used initially.</span>],
            ]}
          />
          <Paragraph>
            This is the <strong>initial/default</strong> password arrangement. Students can <strong>later change</strong> their password.
          </Paragraph>
          <Callout type="tip">
            <strong>Tip for students:</strong> Change your password after your first sign-in so that your 
            result information stays private. See Section 19.
          </Callout>
        </Section>

        {/* ========================================================= */}
        {/* SECTION 19: PASSWORD MANAGEMENT */}
        {/* ========================================================= */}
        <Section id="19-password-management" num={19} title="Password Management">
          <SubHeading>Two Different Situations</SubHeading>
          <Table 
            headers={['Situation', 'Who acts', 'What happens']}
            rows={[
              [<strong key="1">Student changes their own password</strong>, 'The student', 'Where the student-facing feature allows it, the student can change their password after signing in with the initial password.'],
              [<strong key="2">Password changed/reset through administration</strong>, <span key="s">The <strong>Super Admin</strong></span>, 'If a student needs their password changed or reset through administration, the Super Admin handles it.'],
            ]}
          />

          <SubHeading>Authority Over Password Management</SubHeading>
          <Paragraph>
            <strong>Student password changes/reset administration is controlled by the Super Admin.</strong>
          </Paragraph>
          <List items={[
            <>If a student needs their password changed/reset through administration, they should <strong>contact the Super Admin.</strong></>,
            <>Ordinary Admin/Teacher users are <strong>not</strong> described as being able to reset student passwords.</>,
          ]} />
        </Section>

        {/* ========================================================= */}
        {/* SECTION 20: BEHAVIORAL ASSESSMENT */}
        {/* ========================================================= */}
        <Section id="20-behavioral-assessment" num={20} title="Behavioral Assessment">
          <SubHeading>Overview</SubHeading>
          <Paragraph>
            The behavioral assessment section is <strong>compulsory.</strong> The school can configure and 
            record behavioral information for students.
          </Paragraph>

          <SubHeading>What It Includes</SubHeading>
          <List items={[
            <><strong>Behavioral questions / behavioral assessment</strong></>,
            <><strong>Academic remark</strong></>,
            <><strong>Behavioral remark</strong></>,
          ]} />

          <SubHeading>How It Is Used</SubHeading>
          <Paragraph>
            These records become part of the student's academic information and can be displayed to the 
            student <strong>alongside their result information.</strong>
          </Paragraph>

          <Callout type="note">
            <strong>Important:</strong> These are only examples of the kinds of categories a school might use. 
            They are <strong>not confirmed system fields.</strong> Use the behavioral questions and categories 
            your school configures.
          </Callout>
        </Section>

        {/* ========================================================= */}
        {/* SECTION 21: CURRENT RESULTS */}
        {/* ========================================================= */}
        <Section id="21-current-results" num={21} title="Current Results">
          <SubHeading>Purpose</SubHeading>
          <Paragraph>
            The <strong>Current Results</strong> section is used to view a student's <strong>current/available 
            result information</strong> after examination results have been processed.
          </Paragraph>

          <SubHeading>How Current Results Relate to Other Information</SubHeading>
          <Paragraph>Current results connect to the student's:</Paragraph>
          <List items={['Class', 'Term', 'Examination', 'Subjects', 'Overall academic result']} />

          <SubHeading>What to Expect</SubHeading>
          <List items={[
            'OBJ results appear once the student has submitted and the system has marked the examination.',
            'Theory results appear once the teacher has provided the theory result and the final result has been calculated.',
          ]} />
        </Section>

        {/* ========================================================= */}
        {/* SECTION 22: PAST RESULTS */}
        {/* ========================================================= */}
        <Section id="22-past-results" num={22} title="Past Results">
          <SubHeading>Purpose</SubHeading>
          <Paragraph>
            Students can view their <strong>previous academic results</strong> under <strong>Past Results.</strong>
          </Paragraph>

          <SubHeading>Retention Rule</SubHeading>
          <Table 
            headers={['Rule', 'Explanation']}
            rows={[
              [<strong key="1">Six years retained</strong>, <span key="a">The system retains <strong>up to six years</strong> of past results.</span>],
              [<strong key="2">Oldest records removed</strong>, 'When older records exceed the six-year retention period, the oldest records are removed according to the system\'s retention policy.'],
              [<strong key="3">Not kept indefinitely</strong>, 'Records beyond the retained six-year period are not kept forever.'],
            ]}
          />
          <Callout type="warning">
            <strong>Warning:</strong> If you need a long-term personal record of results older than six years, 
            keep your own copy before they leave the retention period.
          </Callout>
        </Section>

        {/* ========================================================= */}
        {/* SECTION 23: PERMISSIONS SUMMARY */}
        {/* ========================================================= */}
        <Section id="23-quick-reference-permissions-summary" num={23} title="Quick Reference: Permissions Summary">
          <Table 
            headers={['Action', 'Super Admin', 'Admin / Teacher', 'Student']}
            rows={[
              ['Complete initial school setup', 'Administrative setup', '—', '—'],
              ['Add another Super Admin', 'Yes', 'No', 'No'],
              ['Remove their own Super Admin account', 'Yes (where permitted)', '—', '—'],
              [<span key="x">Delete another Super Admin</span>, <strong key="y" className="text-red-600">No</strong>, '—', '—'],
              ['Add students', 'Yes', 'Yes', 'No'],
              ['Edit students', 'Yes', <strong key="e" className="text-red-600">No</strong>, 'No'],
              ['Delete students', 'Yes', <strong key="d" className="text-red-600">No</strong>, 'No'],
              ['Create exam configuration', 'Per school setup', 'Yes', 'No'],
              ['Set and manage OBJ and Theory questions', 'Per school setup', 'Yes', 'No'],
              ['Open / close an examination', <strong key="o" className="text-blue-700">Yes</strong>, 'No', 'No'],
              ['Edit scheduled date and time after configuration', <strong key="ed" className="text-red-600">No</strong>, 'No', 'No'],
              ['Enter/update Theory results', 'Per school setup', 'Yes', 'No'],
              ['Take an examination', 'No', 'No', 'Yes (when open)'],
              ['View own results', '—', '—', 'Yes'],
              ['Change own password (where the feature allows)', '—', '—', 'Yes'],
              ['Reset/change a student\'s password via administration', <strong key="r" className="text-blue-700">Yes</strong>, <strong key="rn" className="text-red-600">No</strong>, 'No'],
            ]}
          />
        </Section>

        {/* ========================================================= */}
        {/* SECTION 24: COMPLETE EXAMINATION WORKFLOW */}
        {/* ========================================================= */}
        <Section id="24-quick-reference-the-complete-examination-workflow" num={24} title="Quick Reference: The Complete Examination Workflow">
          <CodeBlock>{`SCHOOL SETUP
School information → Classes → Class arms → Subjects
        ↓
STUDENTS
Add students (Admin or Super Admin)
        ↓
EXAMINATION CONFIGURATION
Create / select configuration (date, time, duration, class, arm, subject, type)
        ↓
QUESTION MANAGEMENT
OBJ or Theory: import / add → review → update → save → return later
        ↓
OPEN EXAMINATION
Super Admin opens the examination
        ↓
STUDENT EXAMINATION
Instructions → enter Student ID → take examination → submit
        ↓
RESULT PROCESSING
OBJ: automatic marking
Theory: teacher enters theory result → total calculated
        ↓
CLOSE EXAMINATION
Super Admin closes the examination
        ↓
RESULTS
Current Results → term results build → Past Results (six years retained)`}</CodeBlock>
        </Section>

        {/* ========================================================= */}
        {/* GETTING HELP */}
        {/* ========================================================= */}
        <div id="getting-help" className="bg-gray-50 border border-blue-200 rounded-lg p-4 lg:p-6 scroll-mt-20">
          <h2 className="text-base lg:text-lg font-bold text-gray-900 mb-4">Getting Help</h2>
          <Paragraph>
            For questions not covered in this guide, including policy information, contact the Super Admin.
          </Paragraph>
          <List items={[
            <><strong>Forgotten or locked password:</strong> contact the <strong>Super Admin.</strong></>,
            <><strong>Mistake in a student's record:</strong> ask the <strong>Super Admin</strong> to edit it.</>,
            <><strong>Examination not available to students:</strong> check with the <strong>Super Admin</strong> whether the examination has been <strong>opened.</strong></>,
            <><strong>Missing examination configuration:</strong> select <strong>Create Exam Configuration</strong> under <strong>Examinations</strong> before setting questions.</>,
          ]} />
        </div>

      </main>

      {/* ========================================================= */}
      {/* BACK TO TOP BUTTON */}
      {/* ========================================================= */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

    </div>
  );
};

export default UserGuide;