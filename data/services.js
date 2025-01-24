import { 
    BarChart3, Megaphone, Palette, Lightbulb, FileText, Search, Users, CreditCard, 
    Image, FileSpreadsheet, Presentation, Heart, ImagePlus, Activity, ClipboardList, 
    FileSignature, Scale, Mosque, Calculator, Briefcase, DollarSign, Building2, 
    FileCheck, HandCoins, Receipt, PiggyBank, GraduationCap, Pill as PillIcon,
    Users as UsersIcon,
    Utensils as UtensilsIcon,
    Activity as ActivityIcon,
    Dumbbell as DumbbellIcon,
    Moon as MoonIcon,
    Brain as BrainIcon,


    BookOpen, PenTool, Brain, Check, 
   BookMarked, Library, VideoIcon, TestTubes, Music2,
  Table2, ChartBar, Calendar, Bot,

  Layout, Monitor, Droplet, Grid, 
  Shapes, Type, Layers
  } from 'lucide-react';
  
  export const services = {
    'Business': [
      {
        title: "AI Integrated ERP",
        description: "Enterprise resource planning system enhanced with AI capabilities",
        category: "business",
        icon: BarChart3
      },
      {
        title: "Digital Marketing AI",
        description: "AI-powered marketing campaign optimization and analytics",
        category: "business",
        icon: Megaphone
      },
      {
        title: "Logo Generator",
        description: "AI-powered brand logo design and generation",
        category: "business",
        icon: Palette
      },
      {
        title: "Business Idea Generator",
        description: "AI assistant for brainstorming and validating business ideas",
        category: "business",
        icon: Lightbulb
      },
      {
        title: "Business Plan Generator",
        description: "Automated business plan creation with market analysis",
        category: "business",
        icon: FileText
      },
      {
        title: "Business Research Assistant",
        description: "AI-powered market research and competitor analysis",
        category: "business",
        icon: Search
      },
      {
        title: "AI Competitor Analyst",
        description: "Automated competitor tracking and strategic insights",
        category: "business",
        icon: Users
      },
      {
        title: "Business Card Design",
        description: "AI-powered business card template generation",
        category: "business",
        icon: CreditCard
      },
      {
        title: "Poster Generator",
        description: "Create professional marketing materials with AI",
        category: "business",
        icon: Image
      },
      {
        title: "Invoice Generator",
        description: "Automated invoice creation and management",
        category: "business",
        icon: FileSpreadsheet
      },
      {
        title: "Pitch Deck Creator",
        description: "AI-assisted presentation and pitch deck design",
        category: "business",
        icon: Presentation
      },
      {
        title: "Legal Document Analyzer",
        description: "AI-powered legal document analysis and review",
        category: "business",
        icon: FileCheck
      },
      {
        title: "Halal Business AI",
        description: "Shariah-compliant business practice analysis and guidance",
        category: "business",
        icon: Building2
      }
    ],
    'Healthcare': [
      {
        title: "ECG Analysis AI",
        description: "Automated ECG interpretation and anomaly detection",
        category: "healthcare",
        icon: Heart
      },
      {
        title: "Medical Imaging AI",
        description: "AI-powered medical image analysis and diagnosis",
        category: "healthcare",
        icon: ImagePlus
      },
      {
        title: "Patient Risk Assessment",
        description: "Predictive analytics for patient health risks",
        category: "healthcare",
        icon: Activity
      },
      {
        title: "Treatment Planning Assistant",
        description: "AI-powered treatment recommendation system",
        category: "healthcare",
        icon: ClipboardList
      },
      {
        title: "Medical Documentation AI",
        description: "Automated medical record processing and analysis",
        category: "healthcare",
        icon: FileSignature
      }
    ],
    'Muslim': [
      {
        title: "Zakat Calculator",
        description: "Advanced Zakat calculation and tracking system",
        category: "muslim",
        icon: Calculator
      },
      {
        title: "Halal Financial AI",
        description: "Shariah-compliant financial analysis and advisory",
        category: "muslim",
        icon: DollarSign
      },
      {
        title: "Halal Investment Analyzer",
        description: "Shariah-compliant investment screening and analysis",
        category: "muslim",
        icon: PiggyBank
      },
      {
        title: "Islamic Finance Assistant",
        description: "AI-powered Islamic banking and finance guidance",
        category: "muslim",
        icon: HandCoins
      },
      {
        title: "Waqf Management System",
        description: "Digital Waqf asset management and tracking",
        category: "muslim",
        icon: Building2
      },
      {
        title: "Islamic Education AI",
        description: "AI-powered Islamic studies and education assistant",
        category: "muslim",
        icon: GraduationCap
      },
      {
        title: "Halal Business Compliance",
        description: "Business Shariah compliance checking and reporting",
        category: "muslim",
        icon: FileCheck
      },
      {
        title: "Sadaqah Tracker",
        description: "Charitable giving management and tracking system",
        category: "muslim",
        icon: Receipt
      }
    ],
    'Patients': [
      {
        title: "ECG Analyzer",
        description: "Personal ECG analysis and heart health monitoring",
        category: "patients",
        icon: Heart
      },
      {
        title: "Prescription Manager AI",
        description: "Smart medication tracking and interaction checker",
        category: "patients",
        icon: PillIcon
      },
      {
        title: "Lifestyle Coach AI",
        description: "Personalized lifestyle and wellness recommendations",
        category: "patients",
        icon: UsersIcon
      },
      {
        title: "Healthy Recipe Generator",
        description: "AI-powered healthy meal planning and recipes",
        category: "patients",
        icon: UtensilsIcon
      },
      {
        title: "Calorie Advisor",
        description: "Smart calorie tracking and nutritional guidance",
        category: "patients",
        icon: ActivityIcon
      },
      {
        title: "Fitness AI",
        description: "Personalized workout plans and exercise tracking",
        category: "patients",
        icon: DumbbellIcon
      },
      {
        title: "Sleep Analysis AI",
        description: "Sleep pattern analysis and improvement suggestions",
        category: "patients",
        icon: MoonIcon
      },
      {
        title: "Mental Wellness Coach",
        description: "AI-powered mental health support and guidance",
        category: "patients",
        icon: BrainIcon
      }
    ],
    'Teachers': [
  {
    title: "Lesson Plan Generator",
    description: "AI-powered lesson planning and curriculum design",
    category: "teachers",
    icon: BookOpen
  },
  {
    title: "Assignment Creator",
    description: "Generate customized assignments and worksheets",
    category: "teachers",
    icon: PenTool
  },
  {
    title: "Quiz Generator",
    description: "Create personalized quizzes and assessments",
    category: "teachers",
    icon: Check
  },
  {
    title: "Student Progress Analyzer",
    description: "AI analysis of student performance and progress",
    category: "teachers",
    icon: ChartBar
  },
  {
    title: "Resource Creator",
    description: "Generate educational materials and resources",
    category: "teachers",
    icon: FileText
  },
  {
    title: "Class Schedule Optimizer",
    description: "AI-powered class scheduling and planning",
    category: "teachers",
    icon: Calendar
  }
],
'Students': [
  {
    title: "Study Assistant AI",
    description: "Personalized study plans and learning support",
    category: "students",
    icon: GraduationCap
  },
  {
    title: "Homework Helper",
    description: "Step-by-step homework guidance and explanations",
    category: "students",
    icon: BookMarked
  },
  {
    title: "Research Assistant",
    description: "AI-powered research and paper writing support",
    category: "students",
    icon: Library
  },
  {
    title: "Math Solver",
    description: "Advanced mathematics problem-solving assistance",
    category: "students",
    icon: Calculator
  },
  {
    title: "Science Lab Assistant",
    description: "Virtual science experiments and explanations",
    category: "students",
    icon: TestTubes
  },
  {
    title: "Note Taking AI",
    description: "Smart note-taking and organization assistant",
    category: "students",
    icon: ClipboardList
  },
  {
    title: "Language Learning AI",
    description: "Personalized language learning assistance",
    category: "students",
    icon: Bot
  },
  {
    title: "Music Theory Tutor",
    description: "Interactive music theory learning assistant",
    category: "students",
    icon: Music2
  }
],

'Designers': [
      {
        title: "UI/UX Design Assistant",
        description: "AI-powered interface design and user experience optimization",
        category: "designers",
        icon: Layout
      },
      {
        title: "Logo Generator",
        description: "Create unique and customizable brand logos",
        category: "designers",
        icon: Palette
      },
      {
        title: "Mockup Creator",
        description: "Generate realistic mockups for design presentations",
        category: "designers",
        icon: Monitor
      },
      {
        title: "Color Palette Generator",
        description: "Create harmonious color schemes with AI assistance",
        category: "designers",
        icon: Droplet
      },
      {
        title: "Pattern Designer",
        description: "Generate seamless patterns and textures",
        category: "designers",
        icon: Grid
      },
      {
        title: "Icon Generator",
        description: "Create consistent icon sets for applications",
        category: "designers",
        icon: Shapes
      },
      {
        title: "Typography Assistant",
        description: "Font pairing and typography optimization",
        category: "designers",
        icon: Type
      },
      {
        title: "Design System Generator",
        description: "Create comprehensive design systems and guidelines",
        category: "designers",
        icon: Layers
      }
    ]
  };