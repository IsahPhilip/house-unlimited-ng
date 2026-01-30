import { Table, Column, Model, DataType, BelongsTo, ForeignKey, BeforeDestroy } from 'sequelize-typescript';
import { User } from './User.model';
import { Property } from './Property.model';

@Table({
  tableName: 'reviews',
  timestamps: true,
  underscored: true
})
export class Review extends Model<Review> {
  @Column({
    type: DataType.STRING(100),
    validate: {
      len: [0, 100]
    }
  })
  title?: string;

  @Column({
    type: DataType.STRING(1000),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 1000]
    }
  })
  comment!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  })
  rating!: number;

  @ForeignKey(() => Property)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  propertyId!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  userId!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  agentId!: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  isVerifiedPurchase!: boolean;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  })
  helpful!: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  reported!: boolean;

  @Column({
    type: DataType.JSONB
  })
  response?: {
    comment: string;
    respondedAt: Date;
    respondedBy: number;
  };

  @BelongsTo(() => User, 'userId')
  user!: User;

  @BelongsTo(() => Property, 'propertyId')
  property!: Property;

  @BelongsTo(() => User, 'agentId')
  agent!: User;

  @BeforeDestroy
  static async updatePropertyRating(instance: Review) {
    // This will be handled by a separate service
    console.log(`Updating property rating for property ${instance.propertyId}`);
  }
}

export default Review;
