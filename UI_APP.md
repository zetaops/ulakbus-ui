# UI APP

## Supported Devices
Firefox, Chrome, Safari, Internet Explorer

## Web Socket Connection / Session Management
Webs ocket connection starts just after session cookie is set and is closed by
end of the session. We aim all communication between backend and UI should be
passed through web socket connection. On any page async messages (requestes) and
their responses must be handled properly and respectful for session state. XHR
also is an alternative and must work when session expires or is needed to be
refreshed or users try to view page by clicking an external URL. Page views by
an external URL must be handled properly, users must be redirected login page
if they are not already signed in, and after successful login, they must be
redirected back the page which they are looking for by establising websocket
connection properly.

## Components
Form, form elements (standard html ones buttons, inputs, text-areas, select and
nonstandard ones  date / time pickers, date range, integer range, email, file,
typeahead inputs, etc..), widgets (table, data grid, chart, message box, avatar,
calendar, task manager, etc..) are independent components and their main
properties can be configured. Also they can be combined e.g a pie chart can have
a button or a message box can have some buttons even if they are not form or app
doesnt expect any data from these components.

## Page Structure
A page is composed of permanent and nonpermanent elements listed below:

- Header
- Main Navigation Menu
- Content Area
- Footer

## Page Types by Layout

- Dashboard
- WorkFlow Step
- WorkFLow Step with a sidebar

## Component List

- **Form** - HTML form element.
- **Text Input** Standart text input.
- **Email Input** Email text input with standard email validation.
- **URL Input** URL text input with URL validation.
- **Password Input**
- **Date** is widget for dates with a date picker
- **Date Range** is a special `Date` widget with two picker.
- **Time**
- **Time Range**
- **Datetime**
- **Dateime Range**
- **Button**
- **File**
- **Image** with preview
- **Document** with mimetype icon
- **Select** Static, model or custom view data source and typeahead search in
data source (even static)
  - **Single**
  - **Multiple**
- **Checkbox**
- **Radio Group**
- **Number Range**
- **Simple Text**
- **Markup Text**
- **Tabs**
- **Table**
- **List**
- **Video**
- **Image**
- **Progress Bar**
- **Modal**
- **Breadcrumb**
- **Selected Object Menu** This widget appears when an item is selected and
includes WF links which can be executed for selected item.
- **Data Grid** is fully configurable and can be fed by external data sources or
static data.
- **General Report Widget** is a `Data Grid` widget which is bundled with a
column selector. Its column data, view for data source and filter options are
defined by backend.
- **Alert Box**
- **Message Box**
- **Charts**
- **Map**
