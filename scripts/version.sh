#!/bin/bash

# Better Habit Versioning Script
# Usage: ./scripts/version.sh [patch|minor|major|prerelease]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not a git repository. Please run this script from the project root."
    exit 1
fi

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    print_warning "You have uncommitted changes. Please commit or stash them first."
    git status --short
    exit 1
fi

# Get the version type from command line argument
VERSION_TYPE=${1:-patch}

# Validate version type
case $VERSION_TYPE in
    patch|minor|major|prerelease)
        print_status "Creating $VERSION_TYPE version..."
        ;;
    *)
        print_error "Invalid version type. Use: patch, minor, major, or prerelease"
        echo "Usage: $0 [patch|minor|major|prerelease]"
        exit 1
        ;;
esac

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
print_status "Current version: $CURRENT_VERSION"

# Update version in package.json
npm version $VERSION_TYPE --no-git-tag-version

# Get new version
NEW_VERSION=$(node -p "require('./package.json').version")
print_status "New version: $NEW_VERSION"

# Update VERSION.md
cat > VERSION.md << EOF
# Version History

## Current Version: $NEW_VERSION

### Version $NEW_VERSION ($(date +%Y-%m-%d))
- **Type**: $VERSION_TYPE Release
- **Status**: $(if [[ $VERSION_TYPE == "prerelease" ]]; then echo "Pre-release"; else echo "Stable"; fi)
- **Changes**: See CHANGELOG.md for detailed changes

EOF

# Update CHANGELOG.md
if [ ! -f CHANGELOG.md ]; then
    print_status "Creating CHANGELOG.md..."
    cat > CHANGELOG.md << EOF
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup

## [$NEW_VERSION] - $(date +%Y-%m-%d)

### Added
- Version $NEW_VERSION release

EOF
else
    print_status "Updating CHANGELOG.md..."
    # Add new version to CHANGELOG.md
    sed -i.bak "s/## \[Unreleased\]/## [$NEW_VERSION] - $(date +%Y-%m-%d)\n\n### Added\n- Version $NEW_VERSION release\n\n## [Unreleased]/" CHANGELOG.md
    rm -f CHANGELOG.md.bak
fi

# Commit changes
git add package.json VERSION.md CHANGELOG.md
git commit -m "chore: bump version to $NEW_VERSION"

# Create git tag
git tag -a "v$NEW_VERSION" -m "Release version $NEW_VERSION"

print_success "Version $NEW_VERSION created successfully!"
print_status "To push to remote:"
echo "  git push origin main"
echo "  git push origin v$NEW_VERSION"
