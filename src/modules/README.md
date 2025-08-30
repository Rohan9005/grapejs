# Template Editor Modules

This directory contains the modular structure for the GrapesJS Template Editor with Handlebars integration.

## Module Structure

### `types.ts`
- **Purpose**: Shared types and interfaces
- **Exports**: 
  - `TemplateEditorProps` - Main component props
  - `DataType` - Data type definitions
  - `ExplorerModalMode` - Modal mode types
  - `ExplorerModalContext` - Modal context types
  - `DataEntry` - Data entry structure
  - Constants: `PLACE_TAG`, `HBS_ATTR`

### `utils.ts`
- **Purpose**: Utility functions for data manipulation and HTML escaping
- **Exports**:
  - `typeOf()` - Get data type of value
  - `previewStr()` - Create preview string for values
  - `escapeHtml()` - Escape HTML characters
  - `getValueFromPath()` - Get value using dot notation
  - `setComponentText()` - Set component text content

### `handlebarsAdapter.ts`
- **Purpose**: Handlebars <-> HTML conversion
- **Exports**:
  - `hbsToHtml()` - Convert HBS template to HTML with tokens
  - `htmlToHbs()` - Convert HTML back to HBS
  - `compilePathPreview()` - Compile path preview for modal

### `dataExplorer.ts`
- **Purpose**: Data explorer modal functionality
- **Exports**:
  - `openExplorerModal()` - Open data binding modal
  - `renderCards()` - Build card grid for data nodes

### `editorSetup.ts`
- **Purpose**: GrapesJS editor setup and configuration
- **Exports**:
  - `setupHbsTokenComponent()` - Setup HBS token component type
  - `setupBlocks()` - Setup basic blocks
  - `setupTokenBinding()` - Setup token binding functionality
  - `setupUsageHighlighting()` - Setup usage highlighting

### `eventHandlers.ts`
- **Purpose**: Editor event handlers
- **Exports**:
  - `setupComponentAddHandler()` - Handle component add events
  - `setupDoubleClickHandler()` - Handle double click events
  - `setupSelectionHandler()` - Handle selection events

### `exportUtils.ts`
- **Purpose**: Export and preview utilities
- **Exports**:
  - `exportHbs()` - Export HBS template
  - `preview()` - Preview compiled template

## Usage

The main `TemplateEditor.tsx` component imports and uses these modules:

```typescript
import type { TemplateEditorProps } from './modules/types';
import { hbsToHtml } from './modules/handlebarsAdapter';
import { setupHbsTokenComponent, setupBlocks, setupTokenBinding, setupUsageHighlighting } from './modules/editorSetup';
import { setupComponentAddHandler, setupDoubleClickHandler, setupSelectionHandler } from './modules/eventHandlers';
import { exportHbs, preview } from './modules/exportUtils';
```

## Benefits of Modular Structure

1. **Separation of Concerns**: Each module has a specific responsibility
2. **Reusability**: Modules can be imported and used independently
3. **Testability**: Each module can be tested in isolation
4. **Maintainability**: Easier to locate and modify specific functionality
5. **Scalability**: New features can be added as separate modules

## Adding New Features

To add new functionality:

1. Create a new module file in this directory
2. Export the functionality from the module
3. Add the export to `index.ts` if needed
4. Import and use in the main component

Example:
```typescript
// newFeature.ts
export const newFeature = () => {
  // Implementation
};

// index.ts
export * from './newFeature';

// TemplateEditor.tsx
import { newFeature } from './modules/newFeature';
```
