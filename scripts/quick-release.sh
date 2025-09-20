#!/bin/bash

# Better Habit Quick Release Script
# Usage: ./scripts/quick-release.sh [patch|minor|major|prerelease] [description]

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

# Get the version type from command line argument
VERSION_TYPE=${1:-patch}
DESCRIPTION=${2:-""}

# Validate version type
case $VERSION_TYPE in
    patch|minor|major|prerelease)
        print_status "Creating $VERSION_TYPE release..."
        ;;
    *)
        print_error "Invalid version type. Use: patch, minor, major, or prerelease"
        echo "Usage: $0 [patch|minor|major|prerelease] [description]"
        exit 1
        ;;
esac

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    print_warning "You have uncommitted changes. Please commit or stash them first."
    git status --short
    echo ""
    echo "Do you want to continue anyway? (y/N)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        print_error "Release cancelled. Please commit your changes first."
        exit 1
    fi
fi

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
- **Description**: $DESCRIPTION

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
$([ -n "$DESCRIPTION" ] && echo "- $DESCRIPTION")

EOF
else
    print_status "Updating CHANGELOG.md..."
    # Add new version to CHANGELOG.md
    sed -i.bak "s/## \[Unreleased\]/## [$NEW_VERSION] - $(date +%Y-%m-%d)\n\n### Added\n- Version $NEW_VERSION release$([ -n "$DESCRIPTION" ] && echo "\n- $DESCRIPTION")\n\n## [Unreleased]/" CHANGELOG.md
    rm -f CHANGELOG.md.bak
fi

# Commit changes
git add package.json VERSION.md CHANGELOG.md
git commit -m "chore: bump version to $NEW_VERSION

$([ -n "$DESCRIPTION" ] && echo "$DESCRIPTION")"

# Create git tag
git tag -a "v$NEW_VERSION" -m "Release version $NEW_VERSION

$([ -n "$DESCRIPTION" ] && echo "$DESCRIPTION")"

print_success "Version $NEW_VERSION created successfully!"

# Ask if user wants to push
echo ""
echo "Do you want to push to GitHub now? (Y/n)"
read -r response
if [[ "$response" =~ ^[Nn]$ ]]; then
    print_status "Release created locally. To push later:"
    echo "  git push origin master"
    echo "  git push origin v$NEW_VERSION"
else
    print_status "Pushing to GitHub..."
    
    # Push commits
    git push origin master
    
    # Push tags
    git push origin v$NEW_VERSION
    
    print_success "Release $NEW_VERSION pushed to GitHub successfully!"
    print_status "You can now create a GitHub release at:"
    echo "  https://github.com/abuabdirohman4/prj-better-habit/releases"
fi

print_status "Release process completed!"
print_status "Next steps:"
echo "  1. Create GitHub release (if not done automatically)"
echo "  2. Verify deployment"
echo "  3. Monitor for issues"
echo "  4. Update team about new release"






