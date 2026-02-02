import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'inquiries',
  timestamps: true,
})
export class Inquiry extends Model {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  propertyId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  })
  email!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  message!: string;
}
