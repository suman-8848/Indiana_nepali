# Nepali Community Indiana

A web application to help Nepali people living in Indiana connect with each other. New residents can find nearby community members and get support settling into their new home.

## Features

- **User Registration**: Register with basic info, location, and contact method
- **Interactive Map**: Find community members using Google Maps
- **Privacy-First**: Only approximate locations stored, consent required
- **Multiple Contact Methods**: Support for email, phone, and Facebook
- **Location Search**: Find members within specified radius

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Maps**: OpenStreetMap + Leaflet.js (100% free!)
- **Geocoding**: Nominatim (OpenStreetMap's free geocoding service)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/suman-8848/Indiana_nepali.git
cd Indiana_nepali
npm install
```

### 2. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your API keys:

```bash
cp .env.local.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

No API keys needed for maps - OpenStreetMap is completely free!

### 3. Supabase Setup

1. Create a new Supabase project
2. Run the SQL commands in `supabase-schema.sql` in your Supabase SQL editor
3. Run the migration in `supabase-migration-add-other-contact.sql` to add "other" contact support
4. Enable Row Level Security (RLS) on the profiles table

### 4. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Database Schema

### Profiles Table

- `id`: UUID primary key
- `full_name`: User's full name
- `city_or_zip`: City or ZIP code in Indiana
- `latitude/longitude`: Approximate coordinates (rounded to 2 decimal places)
- `contact_type`: 'facebook', 'phone', or 'email'
- `contact_value`: The actual contact information
- `about_me`: Optional description
- `consent_to_share`: Boolean for privacy consent
- `created_at`: Timestamp
- `user_id`: Reference to Supabase auth user (for future auth implementation)

## Privacy & Security

- Locations are rounded to 2 decimal places (~1km accuracy)
- Only users who consent have their profiles visible
- Contact information only shown to help community connection
- Row Level Security enabled on database

## Future Enhancements

- User authentication with Supabase Auth
- Profile editing and deletion
- Admin panel for moderation
- Email notifications for new members
- Community events and announcements
- Mobile app version

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details