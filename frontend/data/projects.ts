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
    id: 'pydantic-llm-io',
    title: 'pydantic-llm-io',
    description:
      'Type-safe, validated input/output handling for LLM calls. Combines Pydantic models for strict schema validation with smart retry logic using automatic LLM self-correction prompts. Supports multiple LLM providers with a clean, provider-agnostic interface.',
    features: [
      'Type-safe input/output schemas with Pydantic',
      'Automatic JSON parsing and validation',
      'Smart retry logic with exponential backoff',
      'Multi-provider support (OpenAI, Anthropic, custom)',
      'Full async/await support',
      'Detailed error handling with context',
      'Configurable logging with sensitive data control',
    ],
    tags: ['Python 3.10+', 'Pydantic', 'LLM', 'OpenAI', 'Anthropic', 'Type Hints'],
    stats: [
      { value: '6', label: 'Commits' },
      { value: '3', label: 'Examples' },
      { value: '100%', label: 'Type Coverage' },
      { value: 'MIT', label: 'License' },
    ],
    links: [
      {
        label: 'View on GitHub',
        href: 'https://github.com/yuuichieguchi/pydantic-llm-io',
      },
      {
        label: 'Documentation',
        href: 'https://github.com/yuuichieguchi/pydantic-llm-io#readme',
      },
    ],
  },
  {
    id: 'autoclean-dataframe',
    title: 'autoclean-dataframe',
    description:
      'Automatic, configurable data cleansing for pandas DataFrames with detailed reporting. Enables quick cleaning of messy tabular data through declarative configuration via Python dicts, Pydantic models, or YAML/JSON files.',
    features: [
      'Declarative configuration (Python, Pydantic, YAML, JSON)',
      'Missing value imputation (mean, median, mode, forward/backward fill)',
      'Type conversion with intelligent error handling',
      'Text normalization and whitespace management',
      'PII masking (emails, phone numbers, custom patterns)',
      'Outlier detection (IQR, z-score methods)',
      'Duplicate removal and empty row/column handling',
      'Detailed reporting with JSON output',
    ],
    tags: ['Python 3.8+', 'pandas', 'Pydantic', 'YAML', 'Data Processing'],
    stats: [
      { value: '3', label: 'Commits' },
      { value: '6+', label: 'Features' },
      { value: '100%', label: 'Type Coverage' },
      { value: 'MIT', label: 'License' },
    ],
    links: [
      {
        label: 'View on GitHub',
        href: 'https://github.com/yuuichieguchi/autoclean-dataframe',
      },
      {
        label: 'Documentation',
        href: 'https://github.com/yuuichieguchi/autoclean-dataframe#readme',
      },
    ],
  },
];
