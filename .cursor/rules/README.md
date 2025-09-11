# Cursor Rules Templates

## 📋 Overview

Template rules that can be used for any project with the same quality as Better Habit.

## 🚀 How to Use

### **1. Copy Template Rules**

```bash
# Copy template rules to new project
cp -r .cursor/rules/templates/ ../new-project/.cursor/rules/
```

### **2. Customize for Project**

- Edit `project-overview.md` with new project details
- Adjust `coding-standards.md` with tech stack
- Update `ui-ux-patterns.md` with design system
- Modify `api-integration.md` with data source

### **3. Choose Required Rules**

- **Small Project**: 4 basic files
- **Medium Project**: + api-integration.md + database-schema.md
- **Large Project**: All 8 files

## 📁 File Structure

```
.cursor/rules/
├── README.md                    # Usage guide
├── project-overview.md          # Better Habit project overview
├── coding-standards.md          # Next.js + TypeScript coding standards
├── ui-ux-patterns.md            # Tailwind + DaisyUI UI/UX patterns
├── api-integration.md           # NextAuth + Google Sheets integration
├── component-patterns.md        # Better Habit component patterns
├── database-schema.md           # Google Sheets database structure reference
├── deployment-guidelines.md     # Next.js deployment guidelines
└── customization-guide.md       # Customization guide
```

## 🎨 Customization Levels

### **Level 1: Basic (5 minutes)**

- Change project name
- Update tech stack
- Adjust primary colors

### **Level 2: Intermediate (15 minutes)**

- Customize component patterns
- Update API integration
- Adjust deployment strategy

### **Level 3: Advanced (30 minutes)**

- Full customization
- Add project-specific patterns
- Create custom rules

## 🔧 Quick Start Commands

```bash
# 1. Copy templates
cp -r .cursor/rules/templates/ ../new-project/.cursor/rules/

# 2. Rename project
find ../new-project/.cursor/rules/ -name "*.md" -exec sed -i 's/Better Habbit/g' {} \;

# 3. Update tech stack
find ../new-project/.cursor/rules/ -name "*.md" -exec sed -i 's/Next.js 14g' {} \;

# 4. Customize colors
find ../new-project/.cursor/rules/ -name "*.md" -exec sed -i 's/#1496F6/g' {} \;
```

## 📚 Best Practices

1. **Always customize** for specific projects
2. **Keep templates updated** with latest best practices
3. **Document changes** you make
4. **Share templates** with team for consistency
5. **Version control** template rules

## 🆕 Template Updates

These templates will be updated regularly with:

- Latest best practices
- New patterns discovered
- Bug fixes and improvements
- New technology support

## 🤝 Contributing

If you find new patterns or improvements:

1. Update the appropriate template
2. Test in new project
3. Document changes
4. Share with team
