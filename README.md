# DowMan Properties & Co.

A polished property marketplace and admin dashboard for showcasing residential listings across Nigeria, with a strong emphasis on premium homes, thoughtful presentation, and streamlined client enquiries.

## Overview

DowMan Properties & Co. is a front-end real estate website designed to help prospective buyers explore featured homes, refine searches by property type and budget, and submit enquiries for viewing or management follow-up. The project also includes an administrator dashboard for adding and managing listings in a lightweight enterprise-style workflow.

This repository combines:

- A luxury-inspired public-facing property website
- Search and filtering interactions for listings
- Property detail dialogs with recommended homes
- Inquiry and inspection request forms
- An admin login and management interface
- Supabase-powered authentication and project configuration

## Key Features

### Public Website
- Modern real-estate landing page with hero section and brand positioning
- Search by property type, location, and budget
- Filterable property grid for houses, apartments, and townhouses
- Individual property detail modal with amenity and pricing information
- Saved homes interaction and recommendation cards
- Contact, inquiry, and inspection request forms

### Admin Dashboard
- Administrator sign-in flow
- Dashboard for viewing and managing listing inventory
- Add new property listings with image URL, pricing, and specifications
- Search and filter listings by category or keyword
- Delete listings from the browser-based prototype dashboard

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Supabase JavaScript client
- Formspree for enquiry submissions
- Local browser storage for prototype listing management

## Project Structure

```text
DowMan-Properties/
├── index.html                # Main landing page
├── script.js                 # Public website interaction logic
├── listings.js               # Listing rendering and property logic
├── styles.css                # Site styling
├── supabase-config.js        # Supabase configuration
├── Admin/
│   ├── admin.html            # Admin dashboard
│   ├── auth.js               # Authentication logic
│   ├── dashboard.js          # Listing management logic
│   ├── login.html            # Admin sign-in page
│   ├── auth.css              # Auth styling
│   ├── dashboard.css         # Dashboard styling
│   └── ...
├── Assets/                   # Property and marketing imagery
└── README.md                 # Project documentation
```

## Getting Started

### Prerequisites
- A modern web browser
- A local web server (optional but recommended for smoother development)
- Access to Supabase project credentials if using the admin auth flow

### Run the Project

You can open the public site directly in a browser:

```bash
index.html
```

For a more reliable local experience, serve the project from a local web server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Admin Setup

1. Open the admin sign-in page:
   ```text
   /Admin/login.html
   ```
2. Sign in using your configured Supabase authentication credentials.
3. After login, access the dashboard at:
   ```text
   /Admin/admin.html
   ```

### Supabase Configuration

Update the project URL and anonymous key in:

```text
supabase-config.js
```

Example:

```javascript
const SUPABASE_URL = "https://lkzfdkpzveahsofaeivo.supabase.co";
const SUPABASE_KEY = "sb_publishable_0zpUDMSzdK8TIcWzKXanaw_blGPJe8G";
```

## Notes

- The public website is designed as a modern front-end experience and is suitable for demonstration, portfolio, or prototype use.
- The admin dashboard currently stores prototype listing data in browser local storage for quick management testing.
- For a production system, it is recommended to replace local browser storage with a secure backend, real database records, and managed authentication workflows.
- Form submissions connect to Formspree and should be configured with valid endpoints for live production use.

## Usage Guidelines

This project is ideal for:

- Real-estate marketing websites
- Property listing showcases
- Residential sales presentations
- Portfolio demonstrations for front-end development
- Client-facing property inquiry flows

## Support and Maintenance

For ongoing development, consider adding:

- Real backend data storage
- Property image upload handling
- Search indexing and filters
- CMS-style admin editing tools
- Production-grade validations and analytics
- Role-based access control for agents and managers

## Project Status

This project is currently a front-end prototype and presentation site with functional demo interactions.

## Contact

For business or project inquiries related to DowMan Properties & Co., please use the enquiry workflow available on the website or review the contact section in the marketing pages.
