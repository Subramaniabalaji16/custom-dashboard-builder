# Requirements Document

## Introduction

The Custom Dashboard Builder enables users to create personalized dashboards by composing widgets (Charts, Tables, and KPI Cards) on a configurable canvas grid. Users can drag and drop widgets, configure their data bindings and appearance, and save layouts that reflect real-time data from the Customer Order module. The feature also includes a Customer Order management section for creating, editing, and deleting orders that feed widget data.

## Glossary

- **Dashboard**: The main page displaying the user's saved widget layout.
- **Dashboard_Builder**: The configuration page where users compose and configure the dashboard layout.
- **Canvas_Grid**: The drag-and-drop grid area within the Dashboard_Builder where widgets are placed.
- **Widget**: A visual component (Chart, Table, or KPI Card) placed on the Canvas_Grid.
- **KPI_Card**: A widget that displays a single aggregated metric value.
- **Chart_Widget**: A widget that renders data as a Bar, Line, Area, Scatter, or Pie chart.
- **Table_Widget**: A widget that displays Customer Order data in a tabular format.
- **Widget_Panel**: The side panel listing available widget types for drag-and-drop onto the Canvas_Grid.
- **Settings_Panel**: The side panel that opens when a user configures a widget's properties.
- **Customer_Order**: A record in the Customer Order module containing customer and order information.
- **Order_Form**: The popup form used to create or edit a Customer_Order.
- **Date_Filter**: The dropdown control that filters dashboard widget data by a time range.
- **Layout**: The saved arrangement, sizes, and configurations of all widgets on the Canvas_Grid.

---

## Requirements

### Requirement 1: Dashboard Page Default State

**User Story:** As a user, I want to see a clear starting point when no dashboard is configured, so that I understand how to begin building my dashboard.

#### Acceptance Criteria

1. WHEN a user navigates to the Dashboard page and no Layout has been saved, THE Dashboard SHALL display an empty state with no widgets rendered.
2. THE Dashboard SHALL display a "Configure Dashboard" button when no Layout is saved.
3. WHEN the user clicks the "Configure Dashboard" button, THE Dashboard SHALL navigate the user to the Dashboard_Builder page.

---

### Requirement 2: Dashboard Builder — Widget Panel

**User Story:** As a user, I want to select from a categorized list of widget types, so that I can add the right visualizations to my dashboard.

#### Acceptance Criteria

1. THE Dashboard_Builder SHALL display a Widget_Panel containing the following widget types grouped by category:
   - Charts: Bar Chart, Line Chart, Pie Chart, Area Chart, Scatter Plot
   - Tables: Table
   - KPIs: KPI Value
2. WHEN a user drags a widget type from the Widget_Panel onto the Canvas_Grid, THE Dashboard_Builder SHALL place a new Widget instance at the drop target location.
3. IF a user attempts to drop a widget outside the Canvas_Grid area, THEN THE Dashboard_Builder SHALL cancel the drag operation and return the widget type to the Widget_Panel.

---

### Requirement 3: Canvas Grid Layout

**User Story:** As a user, I want to arrange widgets on a grid canvas, so that I can create a structured and organized dashboard layout.

#### Acceptance Criteria

1. THE Canvas_Grid SHALL use a 12-column grid layout on Desktop (viewport width ≥ 1024px).
2. THE Canvas_Grid SHALL use an 8-column grid layout on Tablet (viewport width ≥ 768px and < 1024px).
3. THE Canvas_Grid SHALL use a 4-column grid layout on Mobile (viewport width < 768px).
4. WHEN a Widget's column span exceeds the available columns on Tablet, THE Canvas_Grid SHALL reflow the Widget to the next row.
5. WHEN the viewport is Mobile, THE Canvas_Grid SHALL stack all Widgets vertically in a single column.
6. WHEN a user drags a Widget within the Canvas_Grid, THE Canvas_Grid SHALL display a placeholder at the projected drop position.
7. WHEN a user drops a Widget at a new position within the Canvas_Grid, THE Canvas_Grid SHALL update the Widget's position to the drop target.

---

### Requirement 4: Widget Hover Controls

**User Story:** As a user, I want quick access to settings and delete actions on each widget, so that I can manage my dashboard efficiently.

#### Acceptance Criteria

1. WHEN a user hovers over a Widget on the Canvas_Grid, THE Dashboard_Builder SHALL display a Settings icon and a Delete icon on the Widget.
2. WHEN a user clicks the Settings icon on a Widget, THE Dashboard_Builder SHALL open the Settings_Panel for that Widget.
3. WHEN a user clicks the Delete icon on a Widget, THE Dashboard_Builder SHALL display a confirmation prompt before removing the Widget.
4. WHEN the user confirms deletion, THE Dashboard_Builder SHALL remove the Widget from the Canvas_Grid.

---

### Requirement 5: Widget Resizing

**User Story:** As a user, I want to resize widgets on the canvas, so that I can control how much space each visualization occupies.

#### Acceptance Criteria

1. THE Dashboard_Builder SHALL allow users to resize a Widget by adjusting its Width columns and Height rows values in the Settings_Panel.
2. WHEN a Widget's Width columns value is updated in the Settings_Panel, THE Canvas_Grid SHALL resize the Widget to the specified column span immediately upon save.
3. WHEN a Widget's Height rows value is updated in the Settings_Panel, THE Canvas_Grid SHALL resize the Widget to the specified row span immediately upon save.

---

### Requirement 6: Save Dashboard Configuration

**User Story:** As a user, I want to save my dashboard layout, so that my widget arrangement and configurations persist across sessions.

#### Acceptance Criteria

1. THE Dashboard_Builder SHALL display a "Save Configuration" button.
2. WHEN the user clicks "Save Configuration", THE Dashboard_Builder SHALL persist the current Layout including all Widget positions, sizes, and configuration settings.
3. WHEN the Layout has been saved successfully, THE Dashboard SHALL render all configured Widgets using the saved Layout.

---

### Requirement 7: Date Filter

**User Story:** As a user, I want to filter dashboard data by a time range, so that I can focus on relevant periods.

#### Acceptance Criteria

1. THE Dashboard SHALL display a Date_Filter labeled "Show data for" with the following options: All time, Today, Last 7 Days, Last 30 Days, Last 90 Days.
2. WHEN the user selects a Date_Filter option, THE Dashboard SHALL update all Widget data to reflect only Customer_Order records within the selected time range.
3. WHILE a Date_Filter option is selected, THE Dashboard SHALL maintain the selected filter value until the user changes it.

---

### Requirement 8: KPI Card Widget Configuration

**User Story:** As a user, I want to configure a KPI Card widget to display a specific aggregated metric, so that I can monitor key business values at a glance.

#### Acceptance Criteria

1. THE Settings_Panel for a KPI_Card SHALL provide the following fields:
   - Widget title (text input, default value: "Untitled")
   - Widget type (read-only, value: "KPI")
   - Description (optional text input)
   - Width columns (number input, default: 2, minimum: 1)
   - Height rows (number input, default: 2, minimum: 1)
   - Select metric (dropdown: Customer ID, Customer name, Email id, Address, Order date, Product, Created by, Status, Total amount, Unit price, Quantity)
   - Aggregation (dropdown: Sum, Average, Count)
   - Data format (dropdown: Number, Currency; default: Number)
   - Decimal Precision (number input, default: 0, minimum: 0)
2. WHEN the selected metric is a non-numeric field (Customer ID, Customer name, Email id, Address, Order date, Product, Created by, Status), THE Settings_Panel SHALL disable the Sum and Average aggregation options and set Aggregation to Count.
3. WHEN the user saves KPI_Card configuration, THE KPI_Card SHALL display the aggregated metric value formatted according to the selected Data format and Decimal Precision.
4. WHEN Data format is set to Currency, THE KPI_Card SHALL prefix the displayed value with "$".

---

### Requirement 9: Bar, Line, Area, and Scatter Chart Widget Configuration

**User Story:** As a user, I want to configure axis-based chart widgets, so that I can visualize order data trends and distributions.

#### Acceptance Criteria

1. THE Settings_Panel for Bar, Line, Area, and Scatter Chart Widgets SHALL provide the following fields:
   - Widget title (text input, default value: "Untitled")
   - Widget type (read-only, value matches chart type)
   - Description (optional text input)
   - Width columns (number input, default: 5, minimum: 1)
   - Height rows (number input, default: 5, minimum: 1)
   - X-Axis (dropdown: Product, Quantity, Unit price, Total amount, Status, Created by, Duration)
   - Y-Axis (dropdown: Product, Quantity, Unit price, Total amount, Status, Created by, Duration)
   - Chart color (color picker with hex input)
   - Show data label (checkbox)
2. WHEN the user saves a Chart_Widget configuration, THE Chart_Widget SHALL render the chart using the selected X-Axis and Y-Axis fields from Customer_Order data.
3. WHEN "Show data label" is checked, THE Chart_Widget SHALL display data point labels on the chart.
4. WHEN a chart color is selected, THE Chart_Widget SHALL apply the selected color to the chart series.

---

### Requirement 10: Pie Chart Widget Configuration

**User Story:** As a user, I want to configure a Pie Chart widget, so that I can visualize proportional distributions of order data.

#### Acceptance Criteria

1. THE Settings_Panel for a Pie Chart Widget SHALL provide the following fields:
   - Widget title (text input, default value: "Untitled")
   - Widget type (read-only, value: "Pie chart")
   - Description (optional text input)
   - Width columns (number input, default: 4, minimum: 1)
   - Height rows (number input, default: 4, minimum: 1)
   - Choose chart data (dropdown: Product, Quantity, Unit price, Total amount, Status, Created by)
   - Show legend (checkbox)
2. WHEN the user saves a Pie Chart configuration, THE Chart_Widget SHALL render the pie chart using the selected data field grouped by distinct values from Customer_Order records.
3. WHEN "Show legend" is checked, THE Chart_Widget SHALL display a legend identifying each pie segment.

---

### Requirement 11: Table Widget Configuration

**User Story:** As a user, I want to configure a Table widget to display order records with custom columns and filters, so that I can review detailed order data on my dashboard.

#### Acceptance Criteria

1. THE Settings_Panel for a Table_Widget SHALL provide the following fields:
   - Widget title (text input, default value: "Untitled")
   - Widget type (read-only, value: "Table")
   - Description (optional text input)
   - Width columns (number input, default: 4, minimum: 1)
   - Height rows (number input, default: 4, minimum: 1)
   - Choose columns (multiselect: Customer ID, Customer name, Email id, Phone number, Address, Order ID, Order date, Product, Quantity, Unit price, Total amount, Status, Created by)
   - Sort by (dropdown: Ascending, Descending, Order date)
   - Pagination (dropdown: 5, 10, 15 rows per page)
   - Apply filter (checkbox)
   - Font size (number input, default: 14, range: 12–18)
   - Header background (color picker with hex input, default: #54bd95)
2. WHEN "Apply filter" is checked, THE Settings_Panel SHALL display a filter section allowing the user to add multiple filter conditions.
3. WHEN the user saves Table_Widget configuration, THE Table_Widget SHALL display only the selected columns from Customer_Order records.
4. WHEN a Sort by option is selected, THE Table_Widget SHALL sort the displayed rows accordingly.
5. WHEN a Pagination value is selected, THE Table_Widget SHALL display at most that number of rows per page and provide pagination controls.
6. WHEN one or more filter conditions are configured and "Apply filter" is checked, THE Table_Widget SHALL display only Customer_Order records matching all active filter conditions.

---

### Requirement 12: Real-Time Data Integration

**User Story:** As a user, I want dashboard widgets to reflect the latest Customer Order data, so that my dashboard always shows current information.

#### Acceptance Criteria

1. THE Dashboard SHALL source all Widget data from the Customer_Order table.
2. WHEN a Customer_Order record is created, updated, or deleted, THE Dashboard SHALL reflect the change in all affected Widgets upon the next data refresh.
3. THE Dashboard SHALL refresh Widget data without requiring a full page reload.

---

### Requirement 13: Customer Order Default State

**User Story:** As a user, I want to see a clear empty state in the Customer Order section when no orders exist, so that I know how to get started.

#### Acceptance Criteria

1. WHEN a user navigates to the Customer Order section and no Customer_Order records exist, THE Customer_Order section SHALL display an empty state with no records.
2. THE Customer_Order section SHALL display a "Create Order" button at all times.

---

### Requirement 14: Create Customer Order

**User Story:** As a user, I want to create a new customer order through a form, so that I can record order information in the system.

#### Acceptance Criteria

1. WHEN the user clicks "Create Order", THE Order_Form SHALL open as a popup containing the following fields:
   - Customer Information: First name, Last name, Email id, Phone number, Street Address, City, State/Province, Postal code, Country (dropdown: United States, Canada, Australia, Singapore, Hong Kong)
   - Order Information: Choose product (dropdown: Fiber Internet 300 Mbps, 5G Unlimited Mobile Plan, Fiber Internet 1 Gbps, Business Internet 500 Mbps, VoIP Corporate Package), Quantity (number input, default: 1, minimum: 1), Unit price (currency input with "$" prefix), Total amount (read-only), Status (dropdown: Pending, In progress, Completed; default: Pending), Created by (dropdown: Mr. Michael Harris, Mr. Ryan Cooper, Ms. Olivia Carter, Mr. Lucas Martin)
2. WHEN the Quantity or Unit price value changes, THE Order_Form SHALL automatically compute Total amount as Quantity multiplied by Unit price and display it in the read-only Total amount field.
3. WHEN the user submits the Order_Form and any mandatory field is empty, THE Order_Form SHALL display the message "Please fill the field" beneath each empty mandatory field and SHALL NOT submit the form.
4. WHEN all mandatory fields are valid and the user submits the Order_Form, THE Customer_Order section SHALL add the new Customer_Order record and close the popup.

---

### Requirement 15: Edit and Delete Customer Order

**User Story:** As a user, I want to edit or delete existing orders via a context menu, so that I can keep order data accurate.

#### Acceptance Criteria

1. WHEN a user right-clicks or activates the context menu on a Customer_Order record, THE Customer_Order section SHALL display "Edit" and "Delete" options.
2. WHEN the user selects "Edit", THE Order_Form SHALL open pre-populated with the selected Customer_Order's data.
3. WHEN the user submits the edited Order_Form with valid data, THE Customer_Order section SHALL update the Customer_Order record with the new values.
4. WHEN the user selects "Delete", THE Customer_Order section SHALL display a confirmation prompt.
5. WHEN the user confirms deletion, THE Customer_Order section SHALL permanently remove the Customer_Order record.

---

### Requirement 16: Responsive Dashboard Rendering

**User Story:** As a user, I want the dashboard to display correctly on any device, so that I can access my data from Desktop, Tablet, or Mobile.

#### Acceptance Criteria

1. WHILE the viewport width is ≥ 1024px, THE Dashboard SHALL render the Canvas_Grid with a 12-column layout.
2. WHILE the viewport width is ≥ 768px and < 1024px, THE Dashboard SHALL render the Canvas_Grid with an 8-column layout and reflow overflowing Widgets to the next row.
3. WHILE the viewport width is < 768px, THE Dashboard SHALL render all Widgets stacked vertically in a single column.
4. THE Dashboard SHALL adapt the Canvas_Grid layout without requiring a page reload when the viewport is resized across breakpoints.
