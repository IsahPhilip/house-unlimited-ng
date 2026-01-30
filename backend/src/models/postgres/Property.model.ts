import { Table, Column, Model, DataType, BelongsTo, ForeignKey, HasMany, BeforeDestroy } from 'sequelize-typescript';
import { User } from './User.model';
import { Review } from './Review.model';

@Table({
  tableName: 'properties',
  timestamps: true,
  underscored: true
})
export class Property extends Model<Property> {
  @Column({
    type: DataType.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  })
  title!: string;

  @Column({
    type: DataType.STRING(2000),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 2000]
    }
  })
  description!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  })
  price!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  })
  priceValue!: number;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  })
  type!: string;

  @Column({
    type: DataType.ENUM('rent', 'sale'),
    allowNull: false
  })
  category!: 'rent' | 'sale';

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 200]
    }
  })
  address!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50]
    }
  })
  city!: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 50]
    }
  })
  state!: string;

  @Column({
    type: DataType.STRING(10),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 10]
    }
  })
  zipCode!: string;

  @Column({
    type: DataType.STRING(50),
    defaultValue: 'USA',
    validate: {
      len: [0, 50]
    }
  })
  country!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  })
  beds!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  })
  baths!: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  })
  sqft!: number;

  @Column({
    type: DataType.INTEGER,
    validate: {
      min: 1800,
      max: new Date().getFullYear()
    }
  })
  yearBuilt?: number;

  @Column({
    type: DataType.INTEGER,
    validate: {
      min: 0
    }
  })
  parking?: number;

  @Column({
    type: DataType.INTEGER,
    validate: {
      min: 0
    }
  })
  lotSize?: number;

  @Column({
    type: DataType.ARRAY(DataType.STRING)
  })
  images!: string[];

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  })
  featuredImage!: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    validate: {
      len: [0, 50]
    }
  })
  amenities!: string[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    validate: {
      len: [0, 100]
    }
  })
  features!: string[];

  @Column({
    type: DataType.ARRAY(DataType.FLOAT),
    allowNull: false,
    validate: {
      len: [2, 2],
      isValidCoordinates(value: number[]) {
        if (value.length !== 2) throw new Error('Coordinates must be [longitude, latitude]');
        if (value[0] < -180 || value[0] > 180) throw new Error('Longitude must be between -180 and 180');
        if (value[1] < -90 || value[1] > 90) throw new Error('Latitude must be between -90 and 90');
      }
    }
  })
  coordinates!: number[];

  @Column({
    type: DataType.ENUM('available', 'pending', 'sold', 'rented'),
    defaultValue: 'available'
  })
  status!: 'available' | 'pending' | 'sold' | 'rented';

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  featured!: boolean;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  agentId!: number;

  @Column({
    type: DataType.STRING(255),
    validate: {
      isUrl: true
    }
  })
  virtualTourUrl?: string;

  @Column({
    type: DataType.STRING(255),
    validate: {
      isUrl: true
    }
  })
  floorPlanUrl?: string;

  @Column({
    type: DataType.STRING(255),
    validate: {
      isUrl: true
    }
  })
  videoUrl?: string;

  @Column({
    type: DataType.INTEGER,
    validate: {
      min: 0
    }
  })
  propertyTaxes?: number;

  @Column({
    type: DataType.INTEGER,
    validate: {
      min: 0
    }
  })
  hoaFees?: number;

  @Column({
    type: DataType.JSONB,
    defaultValue: {
      electricity: false,
      gas: false,
      water: false,
      internet: false,
      cable: false
    }
  })
  utilities!: {
    electricity: boolean;
    gas: boolean;
    water: boolean;
    internet: boolean;
    cable: boolean;
  };

  @Column({
    type: DataType.JSONB
  })
  petPolicy?: {
    allowed: boolean;
    restrictions?: string;
    deposit?: number;
    monthlyFee?: number;
  };

  @Column({
    type: DataType.JSONB,
    defaultValue: {
      minLease: 12,
      maxLease: null,
      applicationFee: null,
      securityDeposit: null,
      petDeposit: null
    }
  })
  leaseTerms?: {
    minLease: number;
    maxLease?: number;
    applicationFee?: number;
    securityDeposit?: number;
    petDeposit?: number;
  };

  @BelongsTo(() => User, 'agentId')
  agent!: User;

  @HasMany(() => Review, 'propertyId')
  reviews!: Review[];

  @BeforeDestroy
  static async cascadeDeleteReviews(instance: Property) {
    console.log(`Reviews being removed from property ${instance.id}`);
    // This will be handled by the association with cascade option
  }
}

export default Property;
