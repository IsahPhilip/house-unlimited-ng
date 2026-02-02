import { BlogPost } from '../types/admin';

const API_BASE_URL = 'http://localhost:5000/api';

// Public API endpoints (no authentication required)
export const getPublicBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/public`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }

    return await response.json();
  } catch (error) {
    console.error('Public blog posts error:', error);
    // Return mock data when backend is not available
    return getMockBlogPosts();
  }
};

export const getPublicBlogPostById = async (id: string): Promise<BlogPost> => {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/public/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch blog post');
    }

    return await response.json();
  } catch (error) {
    console.error('Public blog post error:', error);
    throw error;
  }
};

// Mock data for when backend is not available
const getMockBlogPosts = (): BlogPost[] => [
  {
    id: '1',
    title: 'Top 5 Real Estate Investment Strategies for 2024',
    slug: 'top-5-real-estate-investment-strategies-2024',
    excerpt: 'Discover the most profitable real estate investment strategies that will dominate the market in 2024.',
    content: `# Top 5 Real Estate Investment Strategies for 2024

## Introduction

The real estate market is constantly evolving, and 2024 promises to bring new opportunities and challenges for investors. Whether you're a seasoned investor or just starting out, having the right strategies can make all the difference in your success.

## 1. Buy and Hold Strategy

The buy and hold strategy remains one of the most reliable approaches to real estate investing. This strategy involves purchasing a property and holding onto it for an extended period, typically 5-10 years or more.

### Benefits:
- Long-term appreciation
- Steady rental income
- Tax advantages
- Forced savings through mortgage payments

### Key Considerations:
- Location is crucial
- Property management requirements
- Market cycles and timing

## 2. Fix and Flip

Fix and flip involves purchasing distressed properties, renovating them, and selling them for a profit. This strategy requires more hands-on involvement but can yield significant returns in a shorter timeframe.

### Benefits:
- Quick profits
- Creative outlet
- Market knowledge development

### Key Considerations:
- Renovation expertise required
- Market timing is critical
- Higher risk tolerance needed

## 3. Short-Term Rentals

With the rise of platforms like Airbnb and VRBO, short-term rentals have become increasingly popular. This strategy involves purchasing properties and renting them out on a nightly or weekly basis.

### Benefits:
- Higher rental income potential
- Flexibility in usage
- Seasonal demand opportunities

### Key Considerations:
- Local regulations and restrictions
- Higher maintenance requirements
- Market saturation in popular areas

## 4. Real Estate Investment Trusts (REITs)

REITs allow investors to invest in real estate without directly owning or managing properties. They're traded on major exchanges like stocks.

### Benefits:
- Liquidity
- Diversification
- Professional management
- Dividend income

### Key Considerations:
- Market volatility
- Management fees
- Limited control over investments

## 5. Real Estate Crowdfunding

Real estate crowdfunding platforms allow multiple investors to pool their money to invest in larger properties or development projects.

### Benefits:
- Access to institutional-grade investments
- Lower minimum investments
- Diversification across multiple projects
- Professional management

### Key Considerations:
- Platform fees
- Limited liquidity
- Due diligence requirements

## Conclusion

Each of these strategies has its own advantages and challenges. The key to success in real estate investing is finding the strategy that aligns with your goals, risk tolerance, and available resources. Consider consulting with a financial advisor or real estate professional before making any investment decisions.

Remember, real estate investing is not a get-rich-quick scheme. It requires patience, research, and careful planning. By choosing the right strategy and executing it well, you can build significant wealth through real estate in 2024 and beyond.`,
    featuredImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop',
    category: 'Investment',
    tags: ['real estate', 'investment', '2024', 'strategies'],
    author: {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com'
    },
    status: 'published',
    readTime: 8,
    views: 1250,
    likes: 45,
    commentsCount: 12,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
    publishedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    title: 'How to Stage Your Home for a Quick Sale',
    slug: 'how-to-stage-your-home-for-a-quick-sale',
    excerpt: 'Learn professional home staging techniques that will help you sell your property faster and for more money.',
    content: `# How to Stage Your Home for a Quick Sale

## Introduction

Home staging is a crucial step in preparing your property for sale. A well-staged home can significantly increase its appeal to potential buyers and help you sell faster and for a higher price.

## Why Home Staging Matters

Studies have shown that staged homes sell faster and for more money than unstaged homes. Here's why:

- Creates emotional connection with buyers
- Highlights the home's best features
- Helps buyers visualize themselves living there
- Reduces time on market

## Step-by-Step Home Staging Guide

### 1. Declutter and Depersonalize

Before you can stage your home, you need to remove clutter and personal items.

**What to Remove:**
- Family photos and personal memorabilia
- Excessive decorations and knick-knacks
- Extra furniture that makes rooms feel small
- Personal items from bathrooms and kitchens

**Tips:**
- Store items in a storage unit or with friends/family
- Pack as if you're moving out
- Keep only essential items

### 2. Deep Clean Everything

A clean home is essential for showing. Don't just do a surface clean—go deep.

**Areas to Focus On:**
- Windows and window tracks
- Baseboards and crown molding
- Light fixtures and ceiling fans
- Oven and refrigerator interiors
- Grout and caulk in bathrooms
- Carpets and upholstery

### 3. Make Necessary Repairs

Fix any issues that could turn off potential buyers.

**Common Repairs:**
- Leaky faucets
- Cracked tiles
- Peeling paint
- Squeaky doors
- Broken light fixtures
- Loose cabinet handles

### 4. Neutralize Your Decor

Make your home appealing to the widest range of buyers by using neutral colors and decor.

**Paint Colors:**
- Soft whites, beiges, and grays
- Avoid bold colors in main living areas
- Consider the neighborhood's style

**Decor Choices:**
- Remove bold artwork
- Use neutral throw pillows and blankets
- Choose simple, classic furniture

### 5. Stage Key Rooms

Focus your staging efforts on the most important rooms.

**Living Room:**
- Arrange furniture to create conversation areas
- Add cozy throws and pillows
- Ensure good lighting
- Create a focal point (fireplace, TV, etc.)

**Kitchen:**
- Clear countertops except for 1-2 decorative items
- Add fresh flowers or fruit
- Ensure appliances are clean and shiny
- Stage the dining area if separate

**Bedrooms:**
- Use quality linens
- Add a cozy throw at the foot of the bed
- Ensure good lighting
- Remove excess furniture

**Bathrooms:**
- Add fresh towels
- Use matching soap dispensers
- Add a plant or flowers
- Ensure everything is spotless

### 6. Create Curb Appeal

First impressions matter, so don't neglect the outside of your home.

**Exterior Touches:**
- Pressure wash siding and walkways
- Add fresh mulch to flower beds
- Plant seasonal flowers
- Ensure good lighting
- Keep the lawn mowed and edged

### 7. Set the Mood

Create an inviting atmosphere that makes buyers want to stay.

**Lighting:**
- Open all curtains and blinds
- Turn on all lights during showings
- Use warm, inviting light bulbs
- Add lamps for ambient lighting

**Scents:**
- Bake cookies or bread before showings
- Use subtle, fresh scents
- Avoid strong perfumes or air fresheners
- Ensure no pet or cooking odors

**Music:**
- Play soft, instrumental music
- Keep volume low
- Choose calming, neutral music

## Professional Staging vs. DIY

### When to Hire a Professional:
- High-end properties
- Complex layouts
- You're short on time
- You want maximum return on investment

### When to DIY:
- Budget constraints
- Simple, straightforward spaces
- You have design skills
- You have time to dedicate to the project

## Cost vs. Return

Home staging typically costs 1-3% of your home's asking price but can return 8-10% in increased sale price.

**Average Costs:**
- Professional staging: $400-$1,200 per month
- DIY staging: $200-$800 in supplies
- Professional photography: $150-$350

## Final Tips

1. **Take Professional Photos:** Most buyers start their search online, so great photos are essential.

2. **Keep It Clean:** Clean daily during the selling process.

3. **Be Flexible:** Accommodate showing requests whenever possible.

4. **Price It Right:** Even the best-staged home won't sell if it's overpriced.

5. **Work with a Pro:** Consider hiring a real estate agent experienced in staging.

## Conclusion

Home staging is an investment that pays dividends in faster sales and higher prices. By following these steps and creating a welcoming, neutral space, you'll help potential buyers see your home as their future dream home.`,
    featuredImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop',
    category: 'Home Selling',
    tags: ['staging', 'home sale', 'decorating', 'tips'],
    author: {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com'
    },
    status: 'published',
    readTime: 6,
    views: 890,
    likes: 23,
    commentsCount: 8,
    createdAt: '2024-01-10T14:20:00Z',
    updatedAt: '2024-01-10T14:20:00Z',
    publishedAt: '2024-01-10T14:20:00Z'
  },
  {
    id: '3',
    title: 'Understanding the Current Real Estate Market Trends',
    slug: 'understanding-current-real-estate-market-trends',
    excerpt: 'A comprehensive analysis of the current real estate market and what it means for buyers and sellers.',
    content: `# Understanding the Current Real Estate Market Trends

## Market Overview

The real estate market in 2024 is experiencing significant shifts that are affecting both buyers and sellers. Understanding these trends is crucial for making informed decisions in your real estate transactions.

## Key Market Indicators

### Interest Rates

Interest rates have been a major factor influencing the real estate market. After several years of historically low rates, we're seeing a gradual increase that's impacting affordability and buyer demand.

**Current Trends:**
- Mortgage rates hovering around 6-7%
- Impact on monthly payments
- Shift in buyer preferences
- Effect on home prices

### Inventory Levels

Housing inventory remains tight in many markets, creating competitive conditions for buyers.

**Statistics:**
- Months supply of inventory at historic lows
- New construction not keeping pace with demand
- Geographic variations in availability
- Impact on pricing and bidding wars

### Price Trends

Home prices continue to rise, though the pace has moderated in some areas.

**Regional Variations:**
- Coastal cities seeing slower growth
- Suburban and rural areas maintaining momentum
- Luxury market adjustments
- First-time buyer challenges

## Impact on Different Market Segments

### First-Time Buyers

First-time buyers are facing unprecedented challenges in today's market.

**Challenges:**
- High down payment requirements
- Limited inventory in desired price ranges
- Competition from investors and cash buyers
- Student loan debt impact

**Strategies:**
- Exploring alternative financing options
- Considering fixer-uppers
- Looking in less competitive markets
- Working with knowledgeable agents

### Move-Up Buyers

Existing homeowners looking to upgrade face different challenges.

**Considerations:**
- Equity in current homes
- Timing the sale and purchase
- Appraisal gaps
- Market uncertainty

### Investors

Real estate investors are adapting their strategies to the changing market.

**Trends:**
- Shift toward cash flow over appreciation
- Focus on affordable markets
- Increased due diligence
- Portfolio diversification

## Technology's Role in the Market

Technology continues to transform how we buy and sell real estate.

### Virtual Tours and Showings

The pandemic accelerated the adoption of virtual technology in real estate.

**Benefits:**
- Wider reach for sellers
- Time savings for buyers
- Safety considerations
- Global accessibility

### Online Platforms

Digital platforms have revolutionized property search and transactions.

**Impact:**
- Increased transparency
- Faster transactions
- Data-driven decisions
- New business models

### Blockchain and Smart Contracts

Emerging technologies are beginning to impact real estate transactions.

**Potential Benefits:**
- Reduced transaction costs
- Increased security
- Faster closing times
- Improved record keeping

## Future Predictions

### Short-Term Outlook (6-12 months)

The market is expected to continue evolving with several key factors to watch.

**Predictions:**
- Interest rate stabilization
- Gradual inventory increases
- Price adjustments in overheated markets
- Continued technology adoption

### Long-Term Trends (1-5 years)

Several long-term trends are likely to shape the future of real estate.

**Expected Developments:**
- Sustainable and energy-efficient homes
- Smart home technology integration
- Remote work impact on location preferences
- Urban planning and walkability focus

## Advice for Market Participants

### For Buyers

Navigating today's market requires strategy and patience.

**Recommendations:**
- Get pre-approved for financing
- Work with experienced agents
- Be prepared for competition
- Consider long-term value over short-term trends
- Don't rush into decisions

### For Sellers

Maximizing your sale price requires understanding current market dynamics.

**Strategies:**
- Price competitively from the start
- Invest in professional staging and photography
- Be flexible with showings
- Consider market timing
- Work with agents who understand local trends

### For Investors

Successful investing requires adapting to market conditions.

**Approach:**
- Focus on cash flow properties
- Diversify across markets and property types
- Maintain adequate reserves
- Stay informed about regulatory changes
- Consider professional property management

## Conclusion

The real estate market is complex and constantly evolving. Success in today's market requires staying informed, being adaptable, and working with knowledgeable professionals. Whether you're buying, selling, or investing, understanding these trends will help you make better decisions and achieve your real estate goals.`,
    featuredImage: 'https://images.unsplash.com/photo-1528702748617-c64d4918b58e?w=800&auto=format&fit=crop',
    category: 'Market Trends',
    tags: ['market analysis', 'trends', 'buyers', 'sellers', 'investors'],
    author: {
      id: '1',
      name: 'Admin User',
      email: 'admin@example.com'
    },
    status: 'published',
    readTime: 10,
    views: 0,
    likes: 0,
    commentsCount: 0,
    createdAt: '2024-01-20T09:15:00Z',
    updatedAt: '2024-01-20T09:15:00Z'
  }
];