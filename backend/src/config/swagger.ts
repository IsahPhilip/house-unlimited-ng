import type { Options } from 'swagger-jsdoc';
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition: Options['definition'] = {
  openapi: '3.0.0',
  info: {
    title: 'House Unlimited Nigeria API',
    version: '1.0.0',
    description: 'API documentation for the House Unlimited Nigeria platform.',
  },
  servers: [
    {
      url: '/api',
      description: 'Base API path',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    { name: 'Health', description: 'Service status' },
    { name: 'Auth', description: 'Authentication and session management' },
    { name: 'Users', description: 'User and profile management' },
    { name: 'Properties', description: 'Property catalog' },
    { name: 'Reviews', description: 'Property reviews' },
    { name: 'Uploads', description: 'File uploads' },
    { name: 'Inquiries', description: 'Lead inquiries' },
    { name: 'Newsletter', description: 'Newsletter subscriptions' },
    { name: 'Contact', description: 'Contact form submissions' },
    { name: 'Blog', description: 'Blog posts' },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        responses: {
          '200': {
            description: 'Service healthy',
          },
        },
      },
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        responses: {
          '201': { description: 'User registered' },
          '400': { description: 'Validation error' },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login',
        responses: {
          '200': { description: 'Authenticated' },
          '401': { description: 'Invalid credentials' },
        },
      },
    },
    '/auth/refresh-token': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh access token',
        responses: {
          '200': { description: 'Token refreshed' },
          '401': { description: 'Invalid refresh token' },
        },
      },
    },
    '/auth/forgot-password': {
      post: {
        tags: ['Auth'],
        summary: 'Request a password reset email',
        responses: {
          '200': { description: 'Reset email sent' },
        },
      },
    },
    '/auth/reset-password': {
      post: {
        tags: ['Auth'],
        summary: 'Reset password',
        responses: {
          '200': { description: 'Password reset' },
          '400': { description: 'Invalid token' },
        },
      },
    },
    '/auth/verify-email': {
      post: {
        tags: ['Auth'],
        summary: 'Verify email address',
        responses: {
          '200': { description: 'Email verified' },
          '400': { description: 'Invalid token' },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Logout',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Logged out' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current user',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Current user profile' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/users/profile': {
      get: {
        tags: ['Users'],
        summary: 'Get authenticated user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'User profile' },
          '401': { description: 'Unauthorized' },
        },
      },
      put: {
        tags: ['Users'],
        summary: 'Update authenticated user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Profile updated' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/users/change-password': {
      patch: {
        tags: ['Users'],
        summary: 'Change password',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Password updated' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/users/avatar': {
      post: {
        tags: ['Users'],
        summary: 'Upload avatar',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Avatar updated' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'List users (admin)',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'User list' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Get user by id (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'User details' },
          '404': { description: 'Not found' },
        },
      },
      put: {
        tags: ['Users'],
        summary: 'Update user (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'User updated' },
          '404': { description: 'Not found' },
        },
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete user (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'User deleted' },
          '404': { description: 'Not found' },
        },
      },
    },
    '/properties': {
      get: {
        tags: ['Properties'],
        summary: 'List properties',
        responses: {
          '200': { description: 'Property list' },
        },
      },
      post: {
        tags: ['Properties'],
        summary: 'Create property',
        security: [{ bearerAuth: [] }],
        responses: {
          '201': { description: 'Property created' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/properties/featured': {
      get: {
        tags: ['Properties'],
        summary: 'List featured properties',
        responses: {
          '200': { description: 'Featured properties' },
        },
      },
    },
    '/properties/search': {
      get: {
        tags: ['Properties'],
        summary: 'Search properties',
        responses: {
          '200': { description: 'Search results' },
        },
      },
    },
    '/properties/location/{location}': {
      get: {
        tags: ['Properties'],
        summary: 'Get properties by location',
        parameters: [
          { name: 'location', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Properties by location' },
        },
      },
    },
    '/properties/{id}': {
      get: {
        tags: ['Properties'],
        summary: 'Get property by id',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Property details' },
          '404': { description: 'Not found' },
        },
      },
      put: {
        tags: ['Properties'],
        summary: 'Update property',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Property updated' },
          '401': { description: 'Unauthorized' },
        },
      },
      delete: {
        tags: ['Properties'],
        summary: 'Delete property',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Property deleted' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/reviews': {
      get: {
        tags: ['Reviews'],
        summary: 'List reviews',
        responses: {
          '200': { description: 'Review list' },
        },
      },
      post: {
        tags: ['Reviews'],
        summary: 'Create review',
        security: [{ bearerAuth: [] }],
        responses: {
          '201': { description: 'Review created' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/reviews/{id}': {
      get: {
        tags: ['Reviews'],
        summary: 'Get review by id',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Review details' },
          '404': { description: 'Not found' },
        },
      },
      put: {
        tags: ['Reviews'],
        summary: 'Update review',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Review updated' },
          '401': { description: 'Unauthorized' },
        },
      },
      delete: {
        tags: ['Reviews'],
        summary: 'Delete review',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Review deleted' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/reviews/property/{propertyId}': {
      get: {
        tags: ['Reviews'],
        summary: 'Get reviews for a property',
        parameters: [
          { name: 'propertyId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Property reviews' },
        },
      },
    },
    '/reviews/user/me': {
      get: {
        tags: ['Reviews'],
        summary: 'Get reviews for current user',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'User reviews' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/uploads': {
      get: {
        tags: ['Uploads'],
        summary: 'List uploaded files',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'File list' },
          '401': { description: 'Unauthorized' },
        },
      },
      post: {
        tags: ['Uploads'],
        summary: 'Upload a file',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'File uploaded' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/uploads/{publicId}': {
      delete: {
        tags: ['Uploads'],
        summary: 'Delete a file',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'publicId', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'File deleted' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/inquiries': {
      get: {
        tags: ['Inquiries'],
        summary: 'List inquiries',
        responses: {
          '200': { description: 'Inquiry list' },
        },
      },
      post: {
        tags: ['Inquiries'],
        summary: 'Create inquiry',
        responses: {
          '201': { description: 'Inquiry created' },
        },
      },
    },
    '/newsletter/subscribe': {
      post: {
        tags: ['Newsletter'],
        summary: 'Subscribe to newsletter',
        responses: {
          '201': { description: 'Subscribed' },
          '400': { description: 'Validation error' },
        },
      },
    },
    '/newsletter/unsubscribe': {
      post: {
        tags: ['Newsletter'],
        summary: 'Unsubscribe from newsletter',
        responses: {
          '200': { description: 'Unsubscribed' },
          '404': { description: 'Subscriber not found' },
        },
      },
    },
    '/newsletter': {
      get: {
        tags: ['Newsletter'],
        summary: 'List subscribers (admin)',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Subscriber list' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/newsletter/count': {
      get: {
        tags: ['Newsletter'],
        summary: 'Get subscriber count (admin)',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Subscriber count' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/contact/submit': {
      post: {
        tags: ['Contact'],
        summary: 'Submit contact form',
        responses: {
          '201': { description: 'Contact submitted' },
          '400': { description: 'Validation error' },
        },
      },
    },
    '/contact': {
      get: {
        tags: ['Contact'],
        summary: 'List contacts (admin)',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Contact list' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/contact/stats': {
      get: {
        tags: ['Contact'],
        summary: 'Get contact stats (admin)',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Contact stats' },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/contact/{id}': {
      get: {
        tags: ['Contact'],
        summary: 'Get contact by id (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Contact details' },
          '404': { description: 'Not found' },
        },
      },
      delete: {
        tags: ['Contact'],
        summary: 'Delete contact (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Contact deleted' },
        },
      },
    },
    '/contact/{id}/status': {
      put: {
        tags: ['Contact'],
        summary: 'Update contact status (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Contact status updated' },
          '404': { description: 'Not found' },
        },
      },
    },
    '/blog/public': {
      get: {
        tags: ['Blog'],
        summary: 'List published blog posts',
        responses: {
          '200': { description: 'Published posts' },
        },
      },
    },
    '/blog/public/{id}': {
      get: {
        tags: ['Blog'],
        summary: 'Get published blog post by id',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Blog post' },
          '404': { description: 'Not found' },
        },
      },
    },
    '/blog/public/slug/{slug}': {
      get: {
        tags: ['Blog'],
        summary: 'Get published blog post by slug',
        parameters: [
          { name: 'slug', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Blog post' },
          '404': { description: 'Not found' },
        },
      },
    },
    '/blog/public/{id}/views': {
      patch: {
        tags: ['Blog'],
        summary: 'Increment blog post views',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Views incremented' },
        },
      },
    },
    '/blog/public/{id}/likes': {
      patch: {
        tags: ['Blog'],
        summary: 'Increment blog post likes',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Likes incremented' },
        },
      },
    },
    '/blog/public/{id}/related': {
      get: {
        tags: ['Blog'],
        summary: 'Get related blog posts',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'limit', in: 'query', required: false, schema: { type: 'integer', default: 3 } },
        ],
        responses: {
          '200': { description: 'Related blog posts' },
          '404': { description: 'Not found' },
        },
      },
    },
    '/blog/public/category/{category}': {
      get: {
        tags: ['Blog'],
        summary: 'List published blog posts by category',
        parameters: [
          { name: 'category', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Blog posts by category' },
        },
      },
    },
    '/blog': {
      get: {
        tags: ['Blog'],
        summary: 'List blog posts (admin)',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'Blog posts' },
          '401': { description: 'Unauthorized' },
        },
      },
      post: {
        tags: ['Blog'],
        summary: 'Create blog post (admin)',
        security: [{ bearerAuth: [] }],
        responses: {
          '201': { description: 'Blog post created' },
        },
      },
    },
    '/blog/{id}': {
      get: {
        tags: ['Blog'],
        summary: 'Get blog post by id (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Blog post' },
          '404': { description: 'Not found' },
        },
      },
      put: {
        tags: ['Blog'],
        summary: 'Update blog post (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Blog post updated' },
        },
      },
      delete: {
        tags: ['Blog'],
        summary: 'Delete blog post (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Blog post deleted' },
        },
      },
    },
    '/blog/{id}/publish': {
      patch: {
        tags: ['Blog'],
        summary: 'Publish blog post (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Blog post published' },
        },
      },
    },
    '/blog/{id}/unpublish': {
      patch: {
        tags: ['Blog'],
        summary: 'Unpublish blog post (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Blog post unpublished' },
        },
      },
    },
    '/blog/{id}/archive': {
      patch: {
        tags: ['Blog'],
        summary: 'Archive blog post (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Blog post archived' },
        },
      },
    },
    '/blog/{id}/unarchive': {
      patch: {
        tags: ['Blog'],
        summary: 'Unarchive blog post (admin)',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Blog post unarchived' },
        },
      },
    },
  },
};

export const swaggerSpec = swaggerJSDoc({
  definition: swaggerDefinition,
  apis: [],
});
