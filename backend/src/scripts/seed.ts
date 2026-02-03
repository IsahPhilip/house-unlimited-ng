import 'dotenv/config';
import mongoose from 'mongoose';
import slugifyModule from 'slugify';

import { connectDB } from '../config/database.js';
import { logger } from '../utils/logger.js';
import User from '../models/mongodb/User.mongoose.js';
import Property from '../models/mongodb/Property.mongoose.js';
import Review from '../models/mongodb/Review.mongoose.js';
import { BlogPost } from '../models/mongodb/BlogPost.mongoose.js';
import Newsletter from '../models/Newsletter.js';
import Contact from '../models/Contact.js';
import Deal from '../models/mongodb/Deal.mongoose.js';

const readTimeFor = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

type SlugifyFn = (value: string, options?: Record<string, unknown> | string) => string;

const slugify = (
  (slugifyModule as unknown as { default?: SlugifyFn }).default ??
    (slugifyModule as unknown as SlugifyFn)
);

const run = async (): Promise<void> => {
  await connectDB();

  const shouldReset = process.env.SEED_RESET === 'true';

  if (shouldReset) {
    logger.info('SEED_RESET=true detected. Clearing existing seed collections...');
    await Promise.all([
      Review.deleteMany({}),
      Property.deleteMany({}),
      BlogPost.deleteMany({}),
      Newsletter.deleteMany({}),
      Contact.deleteMany({}),
      Deal.deleteMany({}),
      User.deleteMany({}),
    ]);
  }

  const adminUser = await User.findOne({ email: 'admin@houseunlimited.com' }).select('+password');
  const admin = adminUser ?? new User();
  Object.assign(admin, {
    name: 'House Unlimited Admin',
    email: 'admin@houseunlimited.com',
    password: 'AdminPass123!',
    role: 'admin',
    isEmailVerified: true,
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      favoritePropertyTypes: ['apartment', 'house'],
      priceRange: { min: 50000, max: 1500000 },
    },
  });
  await admin.save();

  const agentUser = await User.findOne({ email: 'agent@houseunlimited.com' }).select('+password');
  const agent = agentUser ?? new User();
  Object.assign(agent, {
    name: 'Olivia Grant',
    email: 'agent@houseunlimited.com',
    password: 'AgentPass123!',
    role: 'agent',
    isEmailVerified: true,
    phone: '+234 904 375 2708',
    location: 'Abuja, Nigeria',
    preferences: {
      emailNotifications: true,
      smsNotifications: true,
      favoritePropertyTypes: ['apartment', 'condo', 'house'],
      priceRange: { min: 100000, max: 5000000 },
    },
  });
  await agent.save();

  const secondAgentUser = await User.findOne({ email: 'agent2@houseunlimited.com' }).select('+password');
  const secondAgent = secondAgentUser ?? new User();
  Object.assign(secondAgent, {
    name: 'Tosin Adeyemi',
    email: 'agent2@houseunlimited.com',
    password: 'AgentPass123!',
    role: 'agent',
    isEmailVerified: true,
    phone: '+234 803 442 9911',
    location: 'Lagos, Nigeria',
    preferences: {
      emailNotifications: true,
      smsNotifications: true,
      favoritePropertyTypes: ['apartment', 'condo'],
      priceRange: { min: 75000, max: 3500000 },
    },
  });
  await secondAgent.save();

  const userUser = await User.findOne({ email: 'user@houseunlimited.com' }).select('+password');
  const endUser = userUser ?? new User();
  Object.assign(endUser, {
    name: 'Samuel Okoro',
    email: 'user@houseunlimited.com',
    password: 'UserPass123!',
    role: 'user',
    isEmailVerified: true,
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      favoritePropertyTypes: ['apartment', 'townhouse'],
      priceRange: { min: 80000, max: 800000 },
    },
  });
  await endUser.save();

  const propertiesSeed = [
    {
      title: 'Wuse Garden Terrace',
      description:
        'Modern 3-bedroom terrace in Wuse Zone 4 with premium finishes, rooftop lounge, and secure parking.',
      price: '₦650,000,000',
      priceValue: 650000000,
      type: 'house',
      category: 'sale',
      address: 'Suite 12, Wuse Zone 4',
      city: 'Abuja',
      state: 'FCT',
      zipCode: '904101',
      country: 'Nigeria',
      beds: 3,
      baths: 3,
      sqft: 2800,
      yearBuilt: 2022,
      parking: 2,
      lotSize: 320,
      images: [
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=1200',
      ],
      featuredImage:
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
      amenities: ['Rooftop lounge', 'CCTV', 'Backup power', 'Borehole'],
      features: ['Smart home controls', 'Marble floors', 'Walk-in closets'],
      coordinates: [7.4898, 9.0765],
      status: 'available',
      featured: true,
      agent: agent._id,
      utilities: {
        electricity: true,
        gas: false,
        water: true,
        internet: true,
        cable: true,
      },
    },
    {
      title: 'Lekki Phase One Apartment',
      description:
        'Upscale 2-bedroom apartment in Lekki Phase One with lagoon views, gym, and 24/7 security.',
      price: '₦180,000,000',
      priceValue: 180000000,
      type: 'apartment',
      category: 'sale',
      address: 'Block B, Admiralty Way',
      city: 'Lagos',
      state: 'Lagos',
      zipCode: '101233',
      country: 'Nigeria',
      beds: 2,
      baths: 2,
      sqft: 1400,
      yearBuilt: 2021,
      parking: 1,
      lotSize: 180,
      images: [
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200',
      ],
      featuredImage:
        'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1200',
      amenities: ['Gym', 'Swimming pool', 'Elevator', 'Concierge'],
      features: ['Balcony', 'Open-plan kitchen', 'Smart entry'],
      coordinates: [3.4241, 6.4474],
      status: 'available',
      featured: false,
      agent: agent._id,
      utilities: {
        electricity: true,
        gas: true,
        water: true,
        internet: true,
        cable: false,
      },
    },
  ];

  for (const propertyData of propertiesSeed) {
    const existing = await Property.findOne({
      title: propertyData.title,
      address: propertyData.address,
    });
    if (existing) {
      Object.assign(existing, propertyData);
      await existing.save();
    } else {
      await Property.create(propertyData);
    }
  }

  const [propertyA, propertyB] = await Property.find()
    .sort({ createdAt: 1 })
    .limit(2);

  if (propertyA && propertyB) {
    propertyB.status = 'sold';
    await propertyB.save();

    const blogPostsSeed = [
      {
        title: 'Top Neighborhoods to Watch in 2026',
        slug: slugify('Top Neighborhoods to Watch in 2026', { lower: true, strict: true }),
        excerpt:
          'A curated look at Abuja and Lagos neighborhoods with rising demand and strong rental yields.',
        content:
          'Investors are focusing on mixed-use districts that offer walkability, infrastructure upgrades, and proximity to major business hubs. In Abuja, Wuse and Jabi remain stable choices, while in Lagos, Lekki Phase One and Victoria Island continue to lead the premium segment.',
        featuredImage:
          'https://images.unsplash.com/photo-1600585154340-be6199f7a096?auto=format&fit=crop&q=80&w=1200',
        category: 'Market Trends',
        tags: ['market', 'nigeria', 'investing'],
        status: 'published',
        readTime: readTimeFor(
          'Investors are focusing on mixed-use districts that offer walkability, infrastructure upgrades, and proximity to major business hubs.'
        ),
        author: admin._id,
        views: 120,
        likes: 35,
        commentsCount: 3,
        publishedAt: new Date(),
        metaTitle: 'Top Neighborhoods to Watch in 2026',
        metaDescription: 'Key Abuja and Lagos neighborhoods for smart property investments in 2026.',
      },
      {
        title: 'Buying vs Renting: A Practical Guide',
        slug: slugify('Buying vs Renting: A Practical Guide', { lower: true, strict: true }),
        excerpt:
          'We break down the costs, flexibility, and long-term benefits of buying versus renting.',
        content:
          'Buying can be a wealth-building strategy if you plan to stay for several years and can handle upfront costs. Renting offers flexibility and a lower initial cash outlay. Consider your income stability, plans, and access to financing before deciding.',
        featuredImage:
          'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200',
        category: 'Home Buying',
        tags: ['buying', 'renting', 'finance'],
        status: 'published',
        readTime: readTimeFor(
          'Buying can be a wealth-building strategy if you plan to stay for several years and can handle upfront costs.'
        ),
        author: agent._id,
        views: 85,
        likes: 19,
        commentsCount: 1,
        publishedAt: new Date(),
        metaTitle: 'Buying vs Renting: A Practical Guide',
        metaDescription: 'Understand the trade-offs between buying and renting a home.',
      },
    ];

    for (const postData of blogPostsSeed) {
      const existing = await BlogPost.findOne({ slug: postData.slug });
      if (existing) {
        Object.assign(existing, postData);
        await existing.save();
      } else {
        await BlogPost.create(postData);
      }
    }

    const existingReview = await Review.findOne({
      property: propertyA._id,
      user: endUser._id,
    });
    if (!existingReview) {
      await Review.create({
        title: 'Great location',
        comment: 'Loved the neighborhood access and quick commute. The agent was responsive.',
        rating: 5,
        property: propertyA._id,
        user: endUser._id,
        agent: agent._id,
        isVerifiedPurchase: false,
      });
    }

    const existingReview2 = await Review.findOne({
      property: propertyB._id,
      user: admin._id,
    });
    if (!existingReview2) {
      await Review.create({
        title: 'Strong value',
        comment: 'Well-priced with solid amenities. Maintenance is prompt and helpful.',
        rating: 4,
        property: propertyB._id,
        user: admin._id,
        agent: agent._id,
        isVerifiedPurchase: false,
      });
    }
  }

  const newsletterSeed = [
    { email: 'updates@houseunlimited.com' },
    { email: 'investor@houseunlimited.com' },
  ];

  for (const subscriber of newsletterSeed) {
    const existing = await Newsletter.findOne({ email: subscriber.email });
    if (!existing) {
      await Newsletter.create({ ...subscriber, isActive: true });
    }
  }

  const contactSeed = {
    name: 'Adaeze Nwosu',
    email: 'adaeze.nwosu@example.com',
    subject: 'Interested in Wuse Garden Terrace',
    message: 'Please share more details about payment plans and inspection schedule.',
    phone: '+2348065550123',
    type: 'property_inquiry',
    status: 'pending',
    priority: 'high',
    assignedTo: agent._id,
    propertyId: propertyA?._id,
  };

  const existingContact = await Contact.findOne({
    email: contactSeed.email,
    subject: contactSeed.subject,
  });
  if (!existingContact) {
    await Contact.create(contactSeed);
  }

  const contactSeed2 = {
    name: 'Chinedu Okafor',
    email: 'chinedu.okafor@example.com',
    subject: 'Schedule inspection for Lekki Phase One Apartment',
    message: 'Looking to inspect this week. Please share available time slots.',
    phone: '+2348091102233',
    type: 'property_inquiry',
    status: 'in_progress',
    priority: 'medium',
    assignedTo: secondAgent._id,
    propertyId: propertyB?._id,
  };

  const existingContact2 = await Contact.findOne({
    email: contactSeed2.email,
    subject: contactSeed2.subject,
  });
  if (!existingContact2) {
    await Contact.create(contactSeed2);
  }

  if (propertyA && propertyB) {
    const existingDeal = await Deal.findOne({
      property: propertyB._id,
      buyer: endUser._id,
    });

    if (!existingDeal) {
      await Deal.create({
        property: propertyB._id,
        buyer: endUser._id,
        seller: admin._id,
        agent: agent._id,
        offerPrice: 170000000,
        acceptedPrice: 175000000,
        status: 'closed',
      });
    }

    const existingDeal2 = await Deal.findOne({
      property: propertyA._id,
      buyer: admin._id,
    });

    if (!existingDeal2) {
      await Deal.create({
        property: propertyA._id,
        buyer: admin._id,
        seller: agent._id,
        agent: secondAgent._id,
        offerPrice: 630000000,
        status: 'pending',
      });
    }
  }

  logger.info('Seed completed successfully.');
  await mongoose.connection.close();
  process.exit(0);
};

run().catch(async (error) => {
  logger.error('Seed script failed:', error);
  await mongoose.connection.close();
  process.exit(1);
});
