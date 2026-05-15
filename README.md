# Ekanta BizCore — Business Management System

## Quick Start
```bash
npm install
npm run dev
# → http://localhost:5174/
```

## Supabase Setup (optional)
1. Create a project at supabase.com
2. Copy `.env.example` to `.env`
3. Add your Supabase URL and anon key
4. Run the SQL in `supabase/schema.sql` to create tables
5. App uses local state as fallback when Supabase is not configured

## Login Credentials
| Role       | Email                   | Password   |
|------------|-------------------------|------------|
| Admin      | admin@ekanta.com        | Admin@123  |
| Marketing  | marketing@ekanta.com    | Mkt@123    |
| CEO        | ceo@ekanta.com          | Ceo@123    |

## Role Permissions
- **Admin**: Sales, Inventory, Payments, Receivables, Fabric Orders (full CRUD)
- **Marketing**: Google Ads, Meta Ads, ROI Analytics (full CRUD)  
- **CEO**: All modules (read-only view) + Executive Controls

## Features
- Role-based dashboards with sidebar module navigation
- Add / Edit / Delete with popup forms and validation
- Real-time Supabase sync (falls back to local state)
- Dark / Light mode toggle
- Search & filter on all tables
- Sales & Operations FIRST, Marketing & Ads BELOW (CEO view)
