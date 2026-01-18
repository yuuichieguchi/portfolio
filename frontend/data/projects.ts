export type ProjectData = {
  id: string;
  title: string;
  description: string;
  features: string[];
  tags: string[];
  stats: Array<{ value: string; label: string }>;
  links: Array<{ label: string; href: string }>;
};

export const projects: ProjectData[] = [
  {
    id: 'capsule-rsc',
    title: 'capsule-rsc',
    description:
      'Safe Server/Client Boundary Enforcement for React Server Components. A 3-layer defense system that ensures data passed from Server to Client Components is always serializable.',
    features: [
      'Type-level safety with TypeScript Serializable type',
      'Build-time validation with ESLint plugin',
      'Runtime assertion with assertSerializable',
      'Safe payload rendering and hydration',
      'Zero runtime overhead in production',
      'Full TypeScript support',
    ],
    tags: ['TypeScript', 'React 19', 'RSC', 'ESLint', 'Next.js'],
    stats: [
      { value: '3', label: 'Defense Layers' },
      { value: '4', label: 'ESLint Rules' },
      { value: '100%', label: 'Type Coverage' },
      { value: 'MIT', label: 'License' },
    ],
    links: [
      {
        label: 'View on GitHub',
        href: 'https://github.com/yuuichieguchi/capsule-rsc',
      },
      {
        label: 'Live Demo',
        href: '/capsule-rsc',
      },
    ],
  },
  {
    id: 'fastapi-websocket-stabilizer',
    title: 'FastAPI WebSocket Stabilizer',
    description:
      'A production-ready Python library that provides a robust WebSocket stabilization layer for FastAPI applications. It handles connection lifecycle management, automatic heartbeat detection, graceful shutdown, and session recovery with reconnection tokens.',
    features: [
      'Automatic ping-pong heartbeat detection',
      'Thread-safe connection management',
      'HMAC-based reconnection tokens',
      'Graceful shutdown with proper cleanup',
      'Structured cloud-friendly logging',
      'Full type hints and comprehensive tests',
    ],
    tags: ['Python 3.10+', 'FastAPI', 'asyncio', 'pytest', 'Type Hints'],
    stats: [
      { value: '1,600+', label: 'Lines of Code' },
      { value: '37', label: 'Test Cases' },
      { value: '100%', label: 'Type Coverage' },
      { value: 'MIT', label: 'License' },
    ],
    links: [
      {
        label: 'View on GitHub',
        href: 'https://github.com/yuuichieguchi/fastapi-websocket-stabilizer',
      },
      {
        label: 'Documentation',
        href: 'https://github.com/yuuichieguchi/fastapi-websocket-stabilizer#readme',
      },
    ],
  },
  {
    id: 'codesensei',
    title: 'CodeSensei',
    description:
      'A learning platform for the AI era, focusing on skills that cannot be delegated to AI. Master system design and code review abilities through hands-on practice problems with instant feedback.',
    features: [
      'System design problems (URL shortener, chat, payment systems)',
      'Code review problems (bug and vulnerability detection in Python/TypeScript)',
      'Instant scoring and detailed feedback after submission',
      'Weakness analysis with personalized problem recommendations',
      'Progressive skill-building across 5 difficulty levels',
    ],
    tags: ['Next.js 16', 'React 19', 'TypeScript', 'Prisma', 'Tailwind CSS'],
    stats: [
      { value: '300+', label: 'Problems' },
      { value: '2', label: 'Categories' },
      { value: '5', label: 'Difficulty Levels' },
    ],
    links: [
      {
        label: 'Official Site',
        href: 'https://codesensei-study.vercel.app/',
      },
    ],
  },
  {
    id: 'constela',
    title: 'Constela',
    description:
      'A compiler-first UI language for vibecoding. Define UI as structured JSON, validated by the compiler at build time, and rendered with a minimal reactive runtime optimized for AI-generated UI.',
    features: [
      'AI-friendly DSL: JSON structure that AI models can easily generate and validate',
      'Schema validation at compile-time prevents invalid definitions',
      'Deterministic typed action steps with predictable behavior',
      'Minimal runtime with fine-grained reactivity (no virtual DOM)',
      'Structured errors with JSON Pointer paths for precise debugging',
      'CVA-like variant presets with Tailwind support',
      'TypeScript Builder API for programmatic AST construction',
    ],
    tags: ['TypeScript', 'JSON DSL', 'Compiler', 'AI-Optimized', 'Reactive UI'],
    stats: [
      { value: '5.6x', label: 'Faster Build' },
      { value: '2.7x', label: 'Smaller Deps' },
      { value: '5.1x', label: 'Smaller Output' },
      { value: 'MIT', label: 'License' },
    ],
    links: [
      {
        label: 'View on GitHub',
        href: 'https://github.com/yuuichieguchi/constela',
      },
      {
        label: 'Official Site',
        href: 'https://constela.dev/',
      },
    ],
  },
];
