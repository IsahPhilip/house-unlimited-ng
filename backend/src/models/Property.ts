import mongoose, { Document, Schema } from 'mongoose';

export interface IProperty extends Document {
  title: string;
  description: string;
  price: string;
  priceValue: number;
  type: string;
  category: 'rent' | 'sale';
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt?: number;
  parking?: number;
  lotSize?: number;
  images: string[];
  featuredImage: string;
  amenities: string[];
  features: string[];
  coordinates: [number, number]; // [longitude, latitude]
  status: 'available' | 'pending' | 'sold' | 'rented';
  featured: boolean;
  agent: mongoose.Types.ObjectId;
  virtualTourUrl?: string;
  floorPlanUrl?: string;
  videoUrl?: string;
  propertyTaxes?: number;
  hoaFees?: number;
  utilities: {
    electricity: boolean;
    gas: boolean;
    water: boolean;
    internet: boolean;
    cable: boolean;
  };
  petPolicy?: {
    allowed: boolean;
    restrictions?: string;
    deposit?: number;
    monthlyFee?: number;
  };
  leaseTerms?: {
    minLease: number;
    maxLease: number;
    applicationFee?: number;
    securityDeposit?: number;
    petDeposit?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema: Schema<IProperty> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true,
      maxlength: [100, 'Title can not be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [2000, 'Description can not be more than 2000 characters'],
    },
    price: {
      type: String,
      required: [true, 'Please add a price'],
    },
    priceValue: {
      type: Number,
      required: [true, 'Please add a numeric price value'],
    },
    type: {
      type: String,
      required: [true, 'Please add a property type'],
      enum: ['apartment', 'house', 'condo', 'townhouse', 'land', 'commercial', 'other'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['rent', 'sale'],
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
      maxlength: [200, 'Address can not be more than 200 characters'],
    },
    city: {
      type: String,
      required: [true, 'Please add a city'],
      maxlength: [50, 'City can not be more than 50 characters'],
    },
    state: {
      type: String,
      required: [true, 'Please add a state'],
      maxlength: [50, 'State can not be more than 50 characters'],
    },
    zipCode: {
      type: String,
      required: [true, 'Please add a zip code'],
      maxlength: [10, 'Zip code can not be more than 10 characters'],
    },
    country: {
      type: String,
      default: 'USA',
      maxlength: [50, 'Country can not be more than 50 characters'],
    },
    beds: {
      type: Number,
      required: [true, 'Please add number of bedrooms'],
      min: 0,
    },
    baths: {
      type: Number,
      required: [true, 'Please add number of bathrooms'],
      min: 0,
    },
    sqft: {
      type: Number,
      required: [true, 'Please add square footage'],
      min: 0,
    },
    yearBuilt: {
      type: Number,
      min: 1800,
      max: new Date().getFullYear(),
    },
    parking: {
      type: Number,
      min: 0,
    },
    lotSize: {
      type: Number,
      min: 0,
    },
    images: [{
      type: String,
    }],
    featuredImage: {
      type: String,
      required: [true, 'Please add a featured image'],
    },
    amenities: [{
      type: String,
      maxlength: [50, 'Amenity can not be more than 50 characters'],
    }],
    features: [{
      type: String,
      maxlength: [100, 'Feature can not be more than 100 characters'],
    }],
    coordinates: {
      type: [Number],
      required: [true, 'Please add coordinates'],
      validate: {
        validator: function(arr: number[]) {
          return arr.length === 2 && arr[0] >= -180 && arr[0] <= 180 && arr[1] >= -90 && arr[1] <= 90;
        },
        message: 'Coordinates must be [longitude, latitude] with valid ranges',
      },
    },
    status: {
      type: String,
      enum: ['available', 'pending', 'sold', 'rented'],
      default: 'available',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    agent: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please add an agent'],
    },
    virtualTourUrl: {
      type: String,
      match: [
        /^https?:\/\/.+/,
        'Please add a valid URL for virtual tour',
      ],
    },
    floorPlanUrl: {
      type: String,
      match: [
        /^https?:\/\/.+/,
        'Please add a valid URL for floor plan',
      ],
    },
    videoUrl: {
      type: String,
      match: [
        /^https?:\/\/.+/,
        'Please add a valid URL for video',
      ],
    },
    propertyTaxes: {
      type: Number,
      min: 0,
    },
    hoaFees: {
      type: Number,
      min: 0,
    },
    utilities: {
      electricity: { type: Boolean, default: false },
      gas: { type: Boolean, default: false },
      water: { type: Boolean, default: false },
      internet: { type: Boolean, default: false },
      cable: { type: Boolean, default: false },
    },
    petPolicy: {
      allowed: { type: Boolean, default: false },
      restrictions: { type: String, maxlength: [500, 'Restrictions can not be more than 500 characters'] },
      deposit: { type: Number, min: 0 },
      monthlyFee: { type: Number, min: 0 },
    },
    leaseTerms: {
      minLease: { type: Number, min: 1, default: 12 },
      maxLease: { type: Number, min: 1 },
      applicationFee: { type: Number, min: 0 },
      securityDeposit: { type: Number, min: 0 },
      petDeposit: { type: Number, min: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create index for text search
PropertySchema.index({
  title: 'text',
  description: 'text',
  address: 'text',
  city: 'text',
  state: 'text',
});

// Create index for geospatial queries
PropertySchema.index({ coordinates: '2dsphere' });

// Create compound indexes for common queries
PropertySchema.index({ category: 1, status: 1, featured: -1, priceValue: 1 });
PropertySchema.index({ type: 1, city: 1, status: 1 });
PropertySchema.index({ agent: 1, status: 1 });

// Virtual for average rating
PropertySchema.virtual('averageRating').get(function() {
  // This will be populated by aggregation in the controller
  return 0;
});

// Virtual for review count
PropertySchema.virtual('reviewCount').get(function() {
  // This will be populated by aggregation in the controller
  return 0;
});

// Cascade delete reviews when a property is deleted
PropertySchema.pre('remove', async function (next) {
  console.log(`Reviews being removed from property ${this._id}`);
  await this.model('Review').deleteMany({ property: this._id });
  next();
});

// Reverse populate with virtuals
PropertySchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'property',
  justOne: false,
});

PropertySchema.virtual('agentInfo', {
  ref: 'User',
  localField: 'agent',
  foreignField: '_id',
  justOne: true,
});

export default mongoose.model<IProperty>('Property', PropertySchema);
