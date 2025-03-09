# Common Components

This directory contains the core UI components used throughout the ReadingRally application. These components are built on top of DaisyUI and follow our custom theme.

## Components

### Button
A versatile button component with multiple variants and states.

```tsx
import { Button } from '@/components/common';

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="accent">Accent</Button>
<Button variant="ghost">Ghost</Button>

// With loading state
<Button isLoading>Loading...</Button>

// With icons
<Button leftIcon={<Icon />}>With Icon</Button>
```

### Card
A flexible card component for containing content.

```tsx
import { Card, CardBody, CardTitle, CardActions } from '@/components/common';

<Card variant="achievement">
  <CardBody>
    <CardTitle>Achievement Unlocked!</CardTitle>
    <p>You've read 5 passages!</p>
    <CardActions>
      <Button>View All</Button>
    </CardActions>
  </CardBody>
</Card>
```

### Badge
A badge component for labels and achievements.

```tsx
import { Badge } from '@/components/common';

<Badge variant="success">Completed</Badge>
<Badge variant="accent" size="lg">New Achievement!</Badge>
```

### Alert & Toast
Components for showing feedback and notifications.

```tsx
import { Alert, Toast } from '@/components/common';

// Alert
<Alert
  variant="success"
  title="Great job!"
>
  You've improved your reading speed!
</Alert>

// Toast
<Toast
  variant="success"
  position="top-right"
  autoClose
>
  Score saved successfully!
</Toast>
```

### Progress & TimerProgress
Components for showing progress and timers.

```tsx
import { Progress, TimerProgress } from '@/components/common';

// Basic progress
<Progress value={75} showLabel />

// Timer
<TimerProgress
  duration={60}
  onComplete={() => console.log('Time's up!')}
/>
```

## Theme Colors

Our components use the following theme colors from DaisyUI:

- `primary`: #0ea5e9 (Sky blue - main actions)
- `secondary`: #d946ef (Purple - reading related)
- `accent`: #fcd34d (Yellow - achievements)
- `neutral`: #3d4451 (Gray - text)
- `info`: #3abff8 (Light blue - informational)
- `success`: #36d399 (Green - completion)
- `warning`: #fbbd23 (Orange - caution)
- `error`: #f87272 (Red - errors)

## Best Practices

1. Always use the common components instead of creating new ones for basic UI elements
2. Maintain consistency by using the predefined variants and sizes
3. Use the appropriate semantic variant for the context (e.g., success for completion, error for mistakes)
4. Include proper ARIA labels and roles for accessibility
5. Follow the child-friendly design principles of ReadingRally
