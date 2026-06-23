# Contributing to FrameUp

Thank you for your interest in contributing to FrameUp! We welcome contributions from the community.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+
- A Supabase account (for the database)
- A Clerk account (for authentication)

### Local Setup

1. **Fork and clone the repository**

```bash
git clone https://github.com/your-username/frameup.git
cd frameup
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables**

```bash
cp apps/web/.env.example apps/web/.env.local
```

Fill in the required values:
- Create a [Clerk](https://clerk.com) application and copy the keys
- Create a [Supabase](https://supabase.com) project and copy the database URL and keys

4. **Set up the database**

```bash
pnpm db:generate
pnpm db:push
```

5. **Run the development server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Development Workflow

1. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/my-feature
   ```

2. Make your changes and ensure:
   - TypeScript compiles without errors: `pnpm typecheck`
   - Linting passes: `pnpm lint`
   - The app runs correctly: `pnpm dev`

3. Commit your changes with a descriptive message:
   ```bash
   git commit -m "feat: add new block type"
   ```

4. Push to your fork and create a Pull Request.

## Code Style

- We use TypeScript for all code
- Follow the existing patterns in the codebase
- Use Tailwind CSS for styling
- Components should be properly typed with interfaces

## Pull Request Guidelines

- Keep PRs focused on a single feature or fix
- Include a clear description of what your PR does
- Add screenshots for UI changes
- Ensure all checks pass (lint, typecheck)

## Reporting Bugs

Use the GitHub Issues tab with the bug report template. Include:
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Browser/OS information

## Feature Requests

Use the GitHub Issues tab with the feature request template. Describe:
- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered

## License

By contributing to FrameUp, you agree that your contributions will be licensed under the MIT License.
