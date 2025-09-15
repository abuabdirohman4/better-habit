# Release Guide

## Versioning Strategy

Better Habit follows [Semantic Versioning](https://semver.org/) (SemVer):

- **MAJOR** (1.0.0): Breaking changes, major new features
- **MINOR** (0.1.0): New features, backward compatible
- **PATCH** (0.0.1): Bug fixes, backward compatible
- **PRERELEASE** (1.0.0-alpha.1): Alpha, beta, or release candidate

## Release Process

### 1. Pre-Release Checklist

- [ ] All tests passing (`npm run lint`)
- [ ] Code reviewed and approved
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json
- [ ] Build successful (`npm run build`)
- [ ] No breaking changes (unless major release)

### 2. Creating a Release

#### Using Script (Recommended)
```bash
# Make script executable (first time only)
chmod +x scripts/version.sh

# Patch release (bug fixes)
./scripts/version.sh patch

# Minor release (new features)
./scripts/version.sh minor

# Major release (breaking changes)
./scripts/version.sh major

# Pre-release (alpha/beta)
./scripts/version.sh prerelease
```

#### Manual Process
```bash
# 1. Update version
npm version patch  # or minor, major, prerelease

# 2. Update CHANGELOG.md
# Add new version section

# 3. Commit changes
git add .
git commit -m "chore: bump version to X.X.X"

# 4. Create tag
git tag -a vX.X.X -m "Release version X.X.X"

# 5. Push to remote
git push origin main
git push origin vX.X.X
```

### 3. GitHub Release

1. Go to GitHub repository
2. Click "Releases" → "Create a new release"
3. Select the tag you just created
4. Add release title and description
5. Attach build artifacts if needed
6. Publish release

### 4. Post-Release

- [ ] Verify deployment
- [ ] Update documentation
- [ ] Notify team/users
- [ ] Monitor for issues

## Release Types

### Patch Release (1.0.1)
- Bug fixes
- Security patches
- Documentation updates
- Performance improvements
- UI/UX minor fixes

### Minor Release (1.1.0)
- New features
- UI/UX improvements
- New integrations
- Enhanced functionality
- New habit tracking features

### Major Release (2.0.0)
- Breaking changes
- Major architecture changes
- Complete redesigns
- Deprecated features removal
- Major API changes

### Pre-release (1.1.0-alpha.1)
- Alpha testing
- Beta testing
- Release candidates
- Feature previews

## Better Habit Specific Guidelines

### Feature Categories
- **Habit Management**: Creating, editing, deleting habits
- **Tracking**: Daily completion, progress tracking
- **Analytics**: Statistics, charts, reports
- **UI/UX**: Interface improvements, mobile experience
- **PWA**: Offline support, installation features
- **Integration**: Google Sheets, authentication

### Testing Checklist
- [ ] All pages load correctly
- [ ] Habit creation/editing works
- [ ] Progress tracking functions
- [ ] PWA installation works
- [ ] Mobile responsiveness
- [ ] Authentication flows
- [ ] Google Sheets integration

## Best Practices

1. **Always test before release**
2. **Update CHANGELOG.md for every release**
3. **Use conventional commits**
4. **Tag releases immediately after commit**
5. **Keep release notes clear and concise**
6. **Test the release process in staging first**
7. **Document breaking changes clearly**
8. **Include migration guides for major releases**

## Quick Commands

```bash
# Check current version
npm version

# See all tags
git tag -l

# See recent commits
git log --oneline -10

# Check uncommitted changes
git status

# Stash changes
git stash

# Apply stashed changes
git stash pop
```

## Troubleshooting

### Common Issues

1. **Uncommitted changes**: Commit or stash before versioning
2. **Build fails**: Fix linting errors before release
3. **Tag already exists**: Delete tag and recreate
4. **Push fails**: Check remote repository access

### Recovery

```bash
# Delete local tag
git tag -d v1.0.1

# Delete remote tag
git push origin :refs/tags/v1.0.1

# Reset to previous commit
git reset --hard HEAD~1

# Revert version in package.json
npm version 1.0.0 --no-git-tag-version
```
