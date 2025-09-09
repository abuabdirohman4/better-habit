# Component Patterns & Best Practices

## Component Architecture

### Component Structure

```tsx
// components/ComponentName/index.tsx
import React from "react";

interface ComponentNameProps {
    // Props interface
}

const ComponentName: React.FC<ComponentNameProps> = ({ ...props }) => {
    // Component logic
    return (
        // JSX
    );
};

export default ComponentName;
```

## Better Habit Specific Components

### Button Component Pattern

```tsx
// components/Button/index.tsx
interface ButtonProps {
    color?: string;
    className?: string;
    onClick?: () => void;
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    color = "bg-primary",
    className = "",
    onClick,
    children,
}) => {
    return (
        <button
            className={`btn ${color} text-white font-semibold rounded-lg ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};
```

### Modal Component Pattern

```tsx
// Modal with DaisyUI
<dialog
    className="modal backdrop-blur-xl backdrop-brightness-150"
    ref={modalRef}
>
    <div className="h-full w-full max-w-md px-7 col-start-1 row-start-1 transform rounded-lg px-3.5 mt-5">
        <form method="dialog" className="flex justify-end">
            <button className="btn btn-md btn-circle btn-ghost">
                <FontAwesomeIcon icon={faXmark} size="2xl" color="gray" />
            </button>
        </form>
        {/* Modal content */}
    </div>
</dialog>
```

### Form Input Pattern

```tsx
// Input with Better Habit styling
<input
    type="text"
    name="fieldName"
    onChange={handleChange}
    value={form.fieldName}
    className="border-2 border-primary text-gray-900 text-sm rounded-full focus:ring-primary focus:border-primary block w-full py-4 px-7 mb-3"
    placeholder="Placeholder text"
    required
/>
```

### Password Input with Toggle

```tsx
// Password input with show/hide toggle
<div className="relative flex mb-3">
    <input
        type={showPassword ? "text" : "password"}
        name="password"
        onChange={handleChange}
        value={form.password}
        className="border-2 border-primary text-gray-900 text-sm rounded-full focus:ring-primary focus:border-primary block w-full py-4 px-7"
        placeholder="Password"
        required
    />
    <div
        className="absolute right-8 top-4 cursor-pointer"
        onClick={() => setShowPassword(!showPassword)}
    >
        {showPassword ? <RiEyeLine size={20} /> : <RiEyeCloseLine size={20} />}
    </div>
</div>
```

### Checkbox Pattern

```tsx
// Checkbox with custom styling
<div className="flex items-start ml-3 mb-6">
    <div className="flex items-center h-5">
        <input
            name="remember"
            id="remember"
            type="checkbox"
            checked={rememberMe}
            onChange={handleCheckboxChange}
            className="w-4 h-4 border border-gray-300 rounded-full bg-primary text-primary focus:ring-3 focus:ring-primary"
        />
    </div>
    <label
        htmlFor="remember"
        className="ms-2 text-sm text-primary font-semibold cursor-pointer"
    >
        Remember me
    </label>
</div>
```

### Loading Spinner Pattern

```tsx
// Loading state with spinner
{isLoading ? (
    <div className="flex justify-center">
        <Spinner className="h-10 w-10 mt-56" />
    </div>
) : (
    // Content
)}
```

### Image with Next.js Optimization

```tsx
// Optimized image with Next.js Image component
<Image
    src="/illustration/get-started.svg"
    width={400}
    height={500}
    alt="get started"
    priority={true}
/>
```

## Layout Patterns

### Page Layout Structure

```tsx
// Standard page layout
<main className="bg-white pt-24 px-7">
    <h1 className="text-4xl font-semibold mx-3">
        Page Title with <span className="text-primary">Highlighted Text</span>
    </h1>

    {/* Page content */}

    {/* Bottom spacing for navigation */}
    <div className="pb-20"></div>
</main>
```

### Centered Content

```tsx
// Centered content with flex
<div className="flex justify-center my-10">{/* Content */}</div>
```

### Full Width Button

```tsx
// Full width button
<Button color="bg-primary" className="w-full py-3.5" onClick={handleClick}>
    Button Text
</Button>
```

## State Management Patterns

### Form State Management

```tsx
const [form, setForm] = useState<{
    field1: string;
    field2: string;
}>({
    field1: "",
    field2: "",
});

const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });
```

### SWR Data Fetching (CSV Optimized)

```tsx
// Using SWR for data fetching with CSV optimization
import { useHabits } from "@/hooks/useHabits";

const { habits, isLoading, error, createHabit, updateHabit, deleteHabit } =
    useHabits();

// Handle loading state
if (isLoading) {
    return <Spinner />;
}

// Handle error state
if (error) {
    return <div className="text-red-500">Error: {error}</div>;
}
```

### CSV Data Handling

```tsx
// CSV data transformation and handling
const processCSVData = (rawData: any[]) => {
    return rawData.map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description || "",
        frequency: row.frequency,
        target: parseInt(row.target) || 1,
        color: row.color || "#1496F6",
        userId: row.userId,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
    }));
};

// Error handling for CSV parsing
const handleCSVError = (error: any) => {
    console.error("CSV parsing error:", error);
    // Fallback to authenticated method or show user-friendly error
    return [];
};
```

### Local Storage Integration

```tsx
// Using custom session utilities
useEffect(() => {
    const rememberMe = getLocal(LOCALKEY.rememberMe);
    if (rememberMe) {
        setRememberMe(rememberMe);
    }
    const clientid = getLocal(LOCALKEY.clientid);
    if (clientid) {
        setForm({
            clientid: clientid,
            password: "",
        });
    }
    setIsLoading(false);
}, []);
```

## Icon Usage Patterns

### FontAwesome Icons

```tsx
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

<FontAwesomeIcon icon={faXmark} size="2xl" color="gray" />;
```

### React Icons

```tsx
import { RiEyeLine, RiEyeCloseLine } from "react-icons/ri";

<RiEyeLine size={20} />
<RiEyeCloseLine size={20} />
```

## Responsive Design Patterns

### Mobile-First Approach

```tsx
// Mobile first with responsive classes
<div className="text-2xl md:text-4xl font-semibold">
    Responsive Text
</div>

<div className="px-4 md:px-7 lg:px-12">
    Responsive Padding
</div>
```

### Grid Layouts

```tsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {/* Grid items */}
</div>
```

## Accessibility Patterns

### ARIA Labels

```tsx
<button aria-label="Close modal" title="Close">
    <FontAwesomeIcon icon={faXmark} />
</button>
```

### Focus Management

```tsx
// Focus on modal open
const openModal = () => {
    if (modalRef.current) {
        modalRef.current.showModal();
        // Focus management can be added here
    }
};
```

## Animation Patterns

### AOS Integration

```tsx
// AOS animation attributes
<div data-aos="fade-up" data-aos-duration="1000">
    Animated content
</div>
```

### Hover Effects

```tsx
// Hover effects with Tailwind
<button className="hover:bg-primary/90 transition-colors duration-200">
    Hover Button
</button>
```

## Error Handling Patterns

### Error States

```tsx
// Error display
{
    error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error.message}
        </div>
    );
}
```

### Loading States

```tsx
// Loading state
{isLoading ? (
    <div className="flex justify-center items-center h-64">
        <Spinner className="h-8 w-8" />
    </div>
) : (
    // Content
)}
```

## TypeScript Patterns

### Interface Definitions

```tsx
interface User {
    id: string;
    email: string;
    name: string;
}

interface FormData {
    email: string;
    password: string;
}
```

### Event Handlers

```tsx
const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
};

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
};
```

## SWR Patterns

### SWR Provider Setup

```tsx
// app/layout.tsx
import SWRProvider from "@/components/SWRProvider";
import SessionProvider from "@/components/SessionProvider";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <SessionProvider>
                    <SWRProvider>{children}</SWRProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
```

### SWR with Optimistic Updates

```tsx
// Component with optimistic updates
const HabitList = () => {
    const { habits, createHabit, updateHabit, deleteHabit } = useHabits();

    const handleCreateHabit = async (
        habitData: Omit<Habit, "id" | "createdAt" | "updatedAt">
    ) => {
        try {
            await createHabit(habitData);
            // SWR automatically updates the cache
        } catch (error) {
            // Handle error
            console.error("Failed to create habit:", error);
        }
    };

    return (
        <div>
            {habits.map((habit) => (
                <HabitCard
                    key={habit.id}
                    habit={habit}
                    onUpdate={updateHabit}
                    onDelete={deleteHabit}
                />
            ))}
        </div>
    );
};
```

### SWR with Conditional Fetching

```tsx
// Conditional data fetching
const HabitEntries = ({ habitId }: { habitId: string }) => {
    const { entries, isLoading, error } = useHabitEntries(habitId);

    if (!habitId) {
        return <div>No habit selected</div>;
    }

    if (isLoading) {
        return <Spinner />;
    }

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <div>
            {entries.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
            ))}
        </div>
    );
};
```

### SWR with Manual Revalidation

```tsx
// Manual revalidation
const RefreshButton = () => {
    const { mutate } = useHabits();

    const handleRefresh = () => {
        mutate(); // Revalidate all SWR data
    };

    return (
        <button onClick={handleRefresh} className="btn btn-primary">
            Refresh Data
        </button>
    );
};
```

## Best Practices

1. **Component Composition**: Break down complex components into smaller, reusable pieces
2. **Props Interface**: Always define TypeScript interfaces for component props
3. **Default Props**: Use default parameters for optional props
4. **Event Handlers**: Use proper TypeScript event types
5. **Conditional Rendering**: Use ternary operators for simple conditions, functions for complex logic
6. **Key Props**: Always provide unique keys for list items
7. **Accessibility**: Include proper ARIA labels and semantic HTML
8. **Performance**: Use React.memo for expensive components
9. **Error Boundaries**: Implement error boundaries for better error handling
10. **SWR Patterns**: Use SWR for all server state management with proper error handling
11. **Optimistic Updates**: Implement optimistic updates for better UX
12. **Conditional Fetching**: Only fetch data when conditions are met
13. **CSV Optimization**: Use CSV format for Google Sheets data fetching for better performance
14. **Data Transformation**: Always transform CSV data to proper TypeScript interfaces
15. **Error Fallbacks**: Implement fallback mechanisms for CSV parsing errors
16. **Testing**: Write tests for component behavior and user interactions
