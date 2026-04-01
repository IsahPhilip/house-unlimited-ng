# House Unlimited Features Plugin

A WordPress plugin that adds custom functionality for the House Unlimited real estate theme.

## Features

### Wishlist
- Add/remove properties to/from user wishlists
- AJAX-powered functionality
- Shortcode: `[hu_wishlist]`
- Admin management of user wishlists

### Property Inquiries
- AJAX-powered inquiry forms
- Custom database table for inquiries
- Admin dashboard for managing inquiries
- Email notifications
- Shortcode: `[hu_inquiry_form property_id="123"]`

### Property Reviews
- User-submitted reviews with ratings
- AJAX-powered review system
- Admin moderation
- Shortcode: `[hu_reviews property_id="123"]`

### Enhanced User Profiles
- Additional user fields (phone, bio, location)
- Avatar upload functionality
- Account dashboard at `/my-account/`
- Profile editing

## Installation

1. Upload the `house-unlimited-plugin` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. The plugin will automatically create necessary database tables on activation

## Usage

### Wishlist
Add the wishlist shortcode to any page or use the account dashboard:

```
[hu_wishlist]
```

### Inquiries
Add inquiry forms to property pages:

```
[hu_inquiry_form property_id="123"]
```

### Reviews
Display reviews on property pages:

```
[hu_reviews property_id="123"]
```

### Account Dashboard
Users can access their account dashboard at `/my-account/` with the following sections:
- Overview
- My Wishlist
- My Reviews
- Profile Settings

## Database Tables

The plugin creates two custom database tables:

- `wp_hu_inquiries` - Stores property inquiries
- `wp_hu_reviews` - Stores property reviews

## Requirements

- WordPress 5.0+
- PHP 7.0+
- House Unlimited theme (recommended)

## Development

### File Structure
```
house-unlimited-plugin/
├── house-unlimited-features.php (main plugin file)
├── includes/
│   ├── class-wishlist.php
│   ├── class-inquiries.php
│   ├── class-reviews.php
│   └── class-user-profile.php
└── README.md
```

### Adding New Features
1. Create a new class in the `includes/` directory
2. Include the class in the main plugin file
3. Initialize the class in the `House_Unlimited_Features::init()` method

## Changelog

### 1.0.0
- Initial release
- Wishlist functionality
- Property inquiries
- Property reviews
- Enhanced user profiles