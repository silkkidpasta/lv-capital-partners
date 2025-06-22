# Contributing to LV Capital Partners

Thank you for your interest in contributing to LV Capital Partners! This document provides guidelines and information for contributors.

## 🤝 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and inclusive in all interactions.

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) or Node.js 18+
- Git
- Basic knowledge of Next.js, TypeScript, and React

### Setting Up Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/lv-capital-partners.git
   cd lv-capital-partners
   ```
3. Install dependencies:
   ```bash
   bun install
   ```
4. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```
5. Start development server:
   ```bash
   bun dev
   ```

## 📋 Development Guidelines

### Branch Naming Convention

- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/urgent-fix` - Urgent production fixes
- `docs/documentation-update` - Documentation changes
- `refactor/component-name` - Code refactoring

### Commit Message Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(dashboard): add portfolio analytics chart
fix(auth): resolve login redirect issue
docs(readme): update installation instructions
```

### Code Style

- Use TypeScript for all new code
- Follow the existing code style (enforced by Biome)
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep functions small and focused

### Component Guidelines

1. **File Organization:**
   ```
   src/components/
   ├── ui/              # Reusable UI components
   ├── dashboard/       # Dashboard-specific components
   └── verification/    # Feature-specific components
   ```

2. **Component Structure:**
   ```typescript
   interface ComponentProps {
     // Define props with TypeScript
   }

   export function Component({ prop1, prop2 }: ComponentProps) {
     // Component logic
     return (
       // JSX
     );
   }
   ```

3. **Styling:**
   - Use Tailwind CSS classes
   - Follow the existing design system
   - Use CSS modules for complex styles if needed

### TypeScript Guidelines

- Avoid `any` types - use proper type definitions
- Use interfaces for object types
- Export types that might be reused
- Use generic types when appropriate

### Testing

While we don't have comprehensive tests yet, when adding tests:

- Place unit tests next to the component: `Component.test.tsx`
- Use descriptive test names
- Test user interactions, not implementation details
- Mock external dependencies

## 🐛 Reporting Bugs

### Before Submitting a Bug Report

1. Check if the bug has already been reported
2. Try to reproduce the issue
3. Gather relevant information (browser, OS, steps to reproduce)

### Bug Report Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g. macOS, Windows]
- Browser: [e.g. Chrome, Safari]
- Version: [e.g. 22]
```

## 💡 Suggesting Features

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of what the problem is.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions you've considered.

**Additional context**
Any other context or screenshots.
```

## 🔄 Pull Request Process

### Before Submitting

1. Ensure your code follows the style guidelines
2. Run linting: `bun lint`
3. Test your changes locally
4. Update documentation if needed
5. Write meaningful commit messages

### Pull Request Template

```markdown
## Description
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] I have tested this change locally
- [ ] I have added/updated tests as needed

## Screenshots (if applicable)

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] My changes generate no new warnings
- [ ] I have updated the documentation accordingly
```

### Review Process

1. All PRs require at least one review
2. Automated checks must pass (linting, build)
3. Address any feedback from reviewers
4. Squash commits before merging (if multiple commits)

## 🏗️ Architecture Decisions

### Adding New Dependencies

Before adding new dependencies:

1. Check if existing libraries can solve the problem
2. Consider bundle size impact
3. Evaluate maintenance status and security
4. Discuss with maintainers for major additions

### Database Changes

For database schema changes:

1. Create a new migration file in `supabase/migrations/`
2. Include both up and down migrations
3. Test migrations on a copy of production data
4. Update TypeScript types accordingly

### API Changes

For API endpoint changes:

1. Maintain backwards compatibility when possible
2. Version APIs if breaking changes are necessary
3. Update documentation
4. Consider rate limiting and security implications

## 📚 Resources

### Useful Links

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Clerk Documentation](https://clerk.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

### Learning Resources

- [React TypeScript Best Practices](https://react-typescript-cheatsheet.netlify.app/)
- [Next.js Learn Course](https://nextjs.org/learn)
- [Git Best Practices](https://www.atlassian.com/git/tutorials/comparing-workflows)

## 🎯 Priority Areas

We're particularly looking for contributions in:

- **Performance Optimization**: Improving load times and user experience
- **Accessibility**: Making the platform more accessible (WCAG compliance)
- **Testing**: Adding comprehensive test coverage
- **Mobile Responsiveness**: Improving mobile experience
- **Documentation**: Improving code documentation and user guides
- **Security**: Identifying and fixing security vulnerabilities

## 🏷️ Issue Labels

- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Documentation improvements
- `high priority` - Urgent issues
- `low priority` - Nice to have

## 📞 Getting Help

- **Discord**: Join our Discord server for real-time discussions
- **GitHub Discussions**: For longer-form discussions and questions
- **Issues**: For bug reports and feature requests
- **Email**: For security-related concerns

## 🙏 Recognition

All contributors will be recognized in our README and release notes. We appreciate every contribution, no matter how small!

---

Thank you for contributing to LV Capital Partners! 🚀
