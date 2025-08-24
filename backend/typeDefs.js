// graphql/typeDefs.js

const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Customer {
    customerId: ID!
    firstName: String!
    lastName: String!
    address: String!
    dob: String!
    userId: String
    email: String
    phoneNumber: String
    orders: [Order]
  }

  type Order {
    orderId: ID!
    orderDate: String!
    customerId: ID!
    userId: ID
    orderStatus: String!
    orderTotal: Float!
    customer: Customer
    user: User
    orderItems: [OrderItem]
  }

  type OrderItem {
    orderItemId: ID!
    orderId: ID!
    variantId: ID!
    quantity: Int!
    price: Float!
    order: Order
    variant: Variant
  }

  type Department {
    departmentId: ID!
    departmentName: String!
    designations: [Designation]
  }

  type Designation {
    designationId: ID!
    designationName: String!
    departments: [Department]
  }

  type Department_Designation {
    departmentId: ID!
    designationId: ID!
    department: Department
    designation: Designation
  }

  type Variant {
    variantId: ID!
    name: String!
    additionalPrice: Float!
    stock: Int!
    productId: ID!
    product: Product
  }

  type Product {
    productId: ID!
    name: String!
    category: String!
    brand: String!
    sku: String!
    description: String
    price: Float!
    stock: Int!
    imageUrl: String
    variants: [Variant]
  }

  type Employee {
    employeeId: ID!
    firstName: String!
    lastName: String!
    departmentId: ID!
    designationId: ID!
    address: String!
    dob: String!
    userId: String!
    department: Department
    designation: Designation
  }

  type User {
    userId: ID!
    password: String!
    username: String!
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String!
    dob: String!
    role: String!
    orders: [Order]
    wishlist: [Wishlist]
  }

  type Wishlist {
    wishlistId: ID!
    userId: ID!
    productId: ID!
    user: User
    product: Product
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    customers: [Customer]
    customer(id: ID!): Customer
    orders: [Order]
    order(id: ID!): Order
    departments: [Department]
    products: [Product]
    product(id: ID!): Product
    users: [User]
    user(id: ID!): User
    wishlist: [Wishlist]
    wishlistItem(id: ID!): Wishlist
  }

  type Mutation {
    createCustomer(firstName: String!, lastName: String!, address: String!, dob: String!, userId: String!, email: String!, phoneNumber: String!): Customer
    createOrder(orderDate: String!, customerId: ID!, orderStatus: String!, orderTotal: Float!): Order
    createDepartment(departmentName: String!): Department
    createDesignation(designationName: String!): Designation
    createDepartmentDesignation(departmentId: ID!, designationId: ID!): Department_Designation
    createEmployee(firstName: String!, lastName: String!, departmentId: ID!, designationId: ID!, address: String!, dob: String!, userId: String!): Employee
    createUser(password: String!, username: String!, email: String!, phoneNumber: String!, dob: String!, role: String!): User
    updateProfile(firstName: String!, lastName: String!, email: String!, phoneNumber: String!): User!
    updatePassword(currentPassword: String!, newPassword: String!): User!
    login(email: String!, password: String!): AuthPayload!
  }
`;

module.exports = typeDefs;