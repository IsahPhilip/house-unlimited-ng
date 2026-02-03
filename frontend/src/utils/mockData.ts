import { Property, TeamMember, Principle, FAQ, Review } from '../types';

// --- Mock Data ---
export const PROPERTIES: Property[] = [
  { 
    id: 1, 
    title: 'Riverview Retreat', 
    price: '$6,000/month', 
    priceValue: 6000, 
    type: 'Apartment', 
    category: 'rent', 
    address: '6391 Elgin St. Celina, Delaware 10299', 
    beds: 4, 
    baths: 2, 
    sqft: 2148, 
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Experience luxury living in this spacious 4-bedroom apartment featuring stunning river views. This modern residence offers an open-concept layout with high-end finishes, a gourmet kitchen, and floor-to-ceiling windows that flood the space with natural light.',
        amenities: ['River View', 'Gourmet Kitchen', 'Parking', 'Gym', 'Balcony', 'Smart Home System'],
        coordinates: [39.7392, -104.9903],
        virtualTourUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' // Example YouTube video
      },
      {
        id: 2,
        title: 'Sunset Vista Villa',
        price: '$396,000',
        priceValue: 396000,
        type: 'Villa',
        category: 'sale',
        address: '1901 Thornridge Cir., Hawaii 81063',
        beds: 2,
        baths: 1,
        sqft: 1148,
        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800'
        ],
        description: 'Escape to paradise in this charming Hawaiian villa. Perfect for a cozy getaway or a primary residence, this property boasts incredible sunset views over the Pacific. Authentic tropical architecture meets modern comfort in this uniquely situated home.',
        amenities: ['Ocean View', 'Private Garden', 'Lanai', 'Outdoor Shower', 'Solar Panels'],
        coordinates: [21.3069, -157.8583],
        virtualTourUrl: 'https://my.matterport.com/show/?m=D4VM2W7fC1m' // Example 3D tour
      },  { 
    id: 3, 
    title: 'Pineview Place', 
    price: '$125,000', 
    priceValue: 125000, 
    type: 'Apartment', 
    category: 'sale', 
    address: '2464 Royal Ln., New Jersey 45463', 
    beds: 1, 
    baths: 1, 
    sqft: 1248, 
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800',
    description: 'Efficient and elegant, Pineview Place is an ideal starter home or investment property. This well-maintained apartment features hardwood floors, updated appliances, and a quiet balcony overlooking the local park.',
    amenities: ['Park View', 'Updated Appliances', 'Security System', 'Laundry In-unit'],
    coordinates: [40.7128, -74.0060]
  },
  { 
    id: 4, 
    title: 'Azure Sky Villa', 
    price: '$8,000/month', 
    priceValue: 8000, 
    type: 'Villa', 
    category: 'rent', 
    address: '2118 Thornridge Cir., Connecticut 35...', 
    beds: 6, 
    baths: 3, 
    sqft: 3000, 
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800',
    description: 'This grand villa in Connecticut offers unparalleled space and privacy. With 6 bedrooms and sprawling living areas, it is the perfect retreat for large families. The property features a private pool and professionally landscaped grounds.',
    amenities: ['Private Pool', 'Landscaped Garden', 'Double Garage', 'Fireplace', 'Wine Cellar'],
    coordinates: [41.6032, -73.0877]
  },
  { 
    id: 5, 
    title: 'MetroView Apartments', 
    price: '$245,000', 
    priceValue: 245000, 
    type: 'Apartment', 
    category: 'sale', 
    address: '2972 Westheimer Rd., Illinois 85486', 
    beds: 3, 
    baths: 2, 
    sqft: 1850, 
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800', 
    featured: true,
    description: 'Live in the heart of the city with these stunning metro views. This 3-bedroom unit combines urban convenience with quiet luxury. Features include a wrap-around balcony and access to building amenities including a rooftop lounge.',
    amenities: ['Rooftop Access', 'City View', '24/7 Doorman', 'Wrap-around Balcony'],
    coordinates: [39.7337, -89.6501]
  },
  { 
    id: 6, 
    title: 'Skyline Oasis Apartments', 
    price: '$315,000', 
    priceValue: 315000, 
    type: 'Apartment', 
    category: 'sale', 
    address: '2715 Ash Dr. San Jose, South Dakota 83475', 
    beds: 4, 
    baths: 3, 
    sqft: 2500, 
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800', 
    featured: true,
    description: 'An oasis in the sky, this top-floor unit offers tranquility and sophistication. Every room is designed with the views in mind. The primary suite features a spa-like bathroom and a private seating area.',
    amenities: ['Spa Bathroom', 'Elevator Access', 'High Ceilings', 'Walk-in Closets'],
    coordinates: [44.3668, -100.3538]
  },
];

export const INITIAL_REVIEWS: Review[] = [
  { id: 1, propertyId: 1, userName: 'John Smith', rating: 5, comment: 'Absolutely stunning views and the interior is top-notch.', date: '2024-03-15' },
  { id: 2, propertyId: 1, userName: 'Sarah Jenkins', rating: 4, comment: 'Great location, though parking can be a bit tight during peak hours.', date: '2024-04-02' },
  { id: 3, propertyId: 5, userName: 'Michael Ross', rating: 5, comment: 'Modern, clean, and the rooftop is incredible.', date: '2024-02-20' },
];

export const TEAM: TeamMember[] = [
  { name: 'Sarah Montgomery', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400' },
  { name: 'David Chen', role: 'Head of Real Estate', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400' },
  { name: 'Elena Rodriguez', role: 'Chief Technology Officer', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400' },
  { name: 'Michael Smith', role: 'Senior Interior Designer', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400' },
];

export const PRINCIPLES: Principle[] = [
  { title: 'Radical Transparency', desc: 'We provide honest data and clear pricing, ensuring you have all the facts before making a decision.', icon: '👁️' },
  { title: 'AI-Driven Innovation', desc: 'We leverage Gemini AI to visualize possibilities and find matches that traditional search engines miss.', icon: '🤖' },
  { title: 'People First', desc: 'Beyond the tech, our primary focus is the human experience of finding a place to call home.', icon: '🤝' },
  { title: 'Uncompromising Integrity', desc: 'We hold ourselves and our agents to the highest ethical standards in every transaction.', icon: '💎' },
];

export const FAQS: FAQ[] = [
  { question: 'How do I start the buying process?', answer: 'The first step is to get pre-approved for a mortgage to understand your budget. Then, use our search tools to browse properties and schedule tours with our agents.' },
  { question: 'What are the closing costs?', answer: 'Closing costs typically range from 2% to 5% of the purchase price and include things like title insurance, appraisal fees, and taxes.' },
  { question: 'Can I sell my property on this platform?', answer: 'Yes! Contact one of our senior realtors via the Contact Us page to list your property and leverage our AI marketing tools.' },
  { question: 'How does the AI Dream Home Visualizer work?', answer: 'We use Google Gemini AI to process your text description and generate a high-fidelity image of a potential exterior design for your dream home.' },
];
