# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0]

### Added

- **ObjectLabel component** - New media label component for displaying object information.

- **usePopoverState hook** - Custom React hook for managing popover state (open/closed, positioning) with integrated focus management and keyboard navigation support.

- **ChevronLeft icons** - Added ChevronLeftIcon component for consistent left-facing chevron icon usage across the application.

- **Rounding variant for components** - New rounding prop option for buttons and other components to support pill-style or custom border radius values.

- **Pill-style button groups** - Enhanced ButtonGroup component with pill-style options (rounded edges) and improved styling consistency.

- **Progress bar orientation & direction** - Added support for both horizontal and vertical progress bars, plus configurable direction (left-to-right or right-to-left).

- **Subtitle support** - New Subtitle Typography component with proper spacing, font sizing, and visual hierarchy for page section headings.

- **Context buttons** - ContextButton component with MenuDotsIcon for dropdown-style action menus, particularly useful in cards for additional actions.

- **StatCard footer support** - Extended StatCard to support footer elements, allowing for additional context or actionable items below main statistics.

- **White text color variant** - Added white/light text color option for use on dark backgrounds with appropriate contrast ratios.

- **Collapsible sidebar functionality** - Enhanced Sidebar component with collapsible state management and smooth transitions between expanded/collapsed views.

- **Menu props & object menu components** - Improved ObjectMenuItem with customizable props and menu positioning, plus enhanced navigation menu utilities.

### Fixed

- **Tailwind CSS animate import error** - Fixed incorrect import path for tailwindcss-animate plugin that was causing build failures in development mode.

## [1.1.0]

### Added

- StatCard - small cards for showing statistics
- Form component - a managed form with a submit button, loading spinner, and success/error alerts
- TriState Button - A stateful button which also indicates loading, error, and success states
- TriState - Stateful Icon set to indicate loading, error, success
- Checkbox component supports ref & intermediate state
- Data-table column classes

### Fixes

- Button centers content
- Pagination active page opacity
- Pagination overflow on mobile
- Table border colors
- Checkbox & radio border color

### Docs

- Repository links to npm

## [1.0.0] - Go-live

Tested and ready for production!

### Added

- Readme
- MIT License
- Changelog

## [0.1.0] Initial Release

### Added

- Toolbar components
- Segmented input
- Rating component
- Combo-box component
- Search & debounce hooks/components
- Data table and table components
- Toggle and toggle group components
- Form inputs
- Navigation components
- Overlay components
- Custom animation style engine
- Scroll area component
- Collapsible & accordion components
- Avatar component
- Ping component
- Feedback components
- Progress components
- Alert component
- Layout components
- Button group component
- Style engine features: support for boolean style props, variants are now optional
