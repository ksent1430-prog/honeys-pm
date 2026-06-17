import { pgTable, text, timestamp, uuid, integer, boolean, pgEnum, decimal, date, jsonb } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', [
  'SUPER_ADMIN',
  'EMPLOYEE',
  'PROPERTY_OWNER',
  'TENANT',
  'SERVICE_CONTRACTOR'
]);

export const leadStatusEnum = pgEnum('lead_status', [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'LOST',
  'CONVERTED'
]);

export const workOrderStatusEnum = pgEnum('work_order_status', [
  'OPEN',
  'ASSIGNED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED'
]);

export const invoiceStatusEnum = pgEnum('invoice_status', [
  'DRAFT',
  'SENT',
  'PAID',
  'OVERDUE',
  'CANCELLED'
]);

// Users table (links to Clerk)
export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk user ID
  email: text('email').notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  role: userRoleEnum('role').default('TENANT').notNull(),
  phoneNumber: text('phone_number'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Leads
export const leads = pgTable('leads', {
  id: uuid('id').primaryKey().defaultRandom(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull(),
  phoneNumber: text('phone_number'),
  source: text('source'),
  status: leadStatusEnum('status').default('NEW').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Properties
export const properties = pgTable('properties', {
  id: uuid('id').primaryKey().defaultRandom(),
  address: text('address').notNull(),
  city: text('city').notNull(),
  state: text('state').notNull(),
  zipCode: text('zip_code').notNull(),
  propertyType: text('property_type'), // e.g., Single Family, Apartment, etc.
  bedroomCount: integer('bedroom_count'),
  bathroomCount: decimal('bathroom_count', { precision: 3, scale: 1 }),
  rentAmount: decimal('rent_amount', { precision: 10, scale: 2 }),
  status: text('status').default('AVAILABLE').notNull(), // AVAILABLE, RENTED, MAINTENANCE
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Landlords (Property Owners)
export const landlords = pgTable('landlords', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => users.id).notNull(),
  companyName: text('company_name'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Tenants
export const tenants = pgTable('tenants', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => users.id).notNull(),
  leaseStartDate: date('lease_start_date'),
  leaseEndDate: date('lease_end_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Property Assignment (Owner to Property)
export const propertyOwners = pgTable('property_owners', {
  propertyId: uuid('property_id').references(() => properties.id).notNull(),
  landlordId: uuid('landlord_id').references(() => landlords.id).notNull(),
});

// Property Assignment (Tenant to Property)
export const propertyTenants = pgTable('property_tenants', {
  propertyId: uuid('property_id').references(() => properties.id).notNull(),
  tenantId: uuid('tenant_id').references(() => tenants.id).notNull(),
  status: text('status').default('ACTIVE').notNull(), // ACTIVE, PAST
});

// Work Orders
export const workOrders = pgTable('work_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').references(() => properties.id).notNull(),
  tenantId: uuid('tenant_id').references(() => tenants.id),
  title: text('title').notNull(),
  description: text('description').notNull(),
  priority: text('priority').default('MEDIUM').notNull(), // LOW, MEDIUM, HIGH, URGENT
  status: workOrderStatusEnum('status').default('OPEN').notNull(),
  assignedTo: text('assigned_to').references(() => users.id), // Could be an employee or contractor
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Messages
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  senderId: text('sender_id').references(() => users.id).notNull(),
  receiverId: text('receiver_id').references(() => users.id).notNull(),
  subject: text('subject'),
  content: text('content').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Invoices
export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').references(() => properties.id).notNull(),
  tenantId: uuid('tenant_id').references(() => tenants.id),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  dueDate: date('due_date').notNull(),
  status: invoiceStatusEnum('status').default('DRAFT').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Payments
export const payments = pgTable('payments', {
  id: uuid('id').primaryKey().defaultRandom(),
  invoiceId: uuid('invoice_id').references(() => invoices.id).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  paymentDate: timestamp('payment_date').defaultNow().notNull(),
  paymentMethod: text('payment_method'), // STRIPE, CASH, CHECK, etc.
  transactionId: text('transaction_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Appointments
export const appointments = pgTable('appointments', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description'),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  propertyId: uuid('property_id').references(() => properties.id),
  userId: text('user_id').references(() => users.id).notNull(), // Who the appointment is with (e.g., Lead, Tenant)
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Inspections
export const inspections = pgTable('inspections', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').references(() => properties.id).notNull(),
  inspectorId: text('assigned_to').references(() => users.id).notNull(),
  inspectionDate: date('inspection_date').notNull(),
  status: text('status').default('SCHEDULED').notNull(), // SCHEDULED, COMPLETED, CANCELLED
  type: text('type'), // MOVE_IN, MOVE_OUT, ROUTINE, EMERGENCY
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Inspection Reports
export const inspectionReports = pgTable('inspection_reports', {
  id: uuid('id').primaryKey().defaultRandom(),
  inspectionId: uuid('inspection_id').references(() => inspections.id).notNull(),
  content: text('content'), // Could be JSON or structured text
  pdfUrl: text('pdf_url'),
  summary: text('summary'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Notifications
export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type'), // INFO, SUCCESS, WARNING, ERROR
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Audit Logs
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => users.id),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id'),
  details: text('details'), // JSON string
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ======== ACCOUNTING ========

export const expenseCategoryEnum = pgEnum('expense_category', [
  'MAINTENANCE',
  'REPAIRS',
  'UTILITIES',
  'INSURANCE',
  'TAXES',
  'SUPPLIES',
  'MARKETING',
  'SALARIES',
  'CONTRACTOR',
  'OTHER'
]);

export const expenses = pgTable('expenses', {
  id: uuid('id').primaryKey().defaultRandom(),
  propertyId: uuid('property_id').references(() => properties.id),
  category: expenseCategoryEnum('category').default('OTHER').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  description: text('description').notNull(),
  expenseDate: date('expense_date').notNull(),
  vendor: text('vendor'),
  receiptUrl: text('receipt_url'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ======== HR & RECRUITING ========

export const jobStatusEnum = pgEnum('job_status', ['DRAFT', 'OPEN', 'CLOSED', 'FILLED']);
export const applicationStatusEnum = pgEnum('application_status', ['NEW', 'SCREENING', 'INTERVIEW', 'OFFERED', 'HIRED', 'REJECTED']);
export const employmentStatusEnum = pgEnum('employment_status', ['ACTIVE', 'ON_LEAVE', 'TERMINATED']);

export const jobPostings = pgTable('job_postings', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  department: text('department'),
  description: text('description').notNull(),
  requirements: text('requirements'),
  status: jobStatusEnum('status').default('DRAFT').notNull(),
  salaryRange: text('salary_range'),
  location: text('location'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const jobApplications = pgTable('job_applications', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobId: uuid('job_id').references(() => jobPostings.id).notNull(),
  applicantName: text('applicant_name').notNull(),
  email: text('email').notNull(),
  phoneNumber: text('phone_number'),
  resumeUrl: text('resume_url'),
  coverLetter: text('cover_letter'),
  status: applicationStatusEnum('status').default('NEW').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const employeeProfiles = pgTable('employee_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => users.id).notNull().unique(),
  department: text('department'),
  position: text('position'),
  salary: decimal('salary', { precision: 10, scale: 2 }),
  hireDate: date('hire_date'),
  status: employmentStatusEnum('status').default('ACTIVE').notNull(),
  emergencyContact: text('emergency_contact'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const timesheets = pgTable('timesheets', {
  id: uuid('id').primaryKey().defaultRandom(),
  employeeId: uuid('employee_id').references(() => employeeProfiles.id).notNull(),
  weekStart: date('week_start').notNull(),
  weekEnd: date('week_end').notNull(),
  hours: decimal('hours', { precision: 5, scale: 1 }).notNull(),
  status: text('status').default('PENDING').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ======== TEMP STAFFING ========

export const tempWorkers = pgTable('temp_workers', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => users.id).notNull().unique(),
  skills: text('skills'),
  availabilityStatus: text('availability_status').default('AVAILABLE').notNull(),
  hourlyRate: decimal('hourly_rate', { precision: 8, scale: 2 }),
  backgroundCheck: text('background_check').default('PENDING'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const tempClients = pgTable('temp_clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  companyName: text('company_name').notNull(),
  contactName: text('contact_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  address: text('address'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const tempAssignments = pgTable('temp_assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  workerId: uuid('worker_id').references(() => tempWorkers.id).notNull(),
  clientId: uuid('client_id').references(() => tempClients.id).notNull(),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'),
  hourlyRate: decimal('hourly_rate', { precision: 8, scale: 2 }),
  status: text('status').default('ACTIVE').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const tempInvoices = pgTable('temp_invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  assignmentId: uuid('assignment_id').references(() => tempAssignments.id).notNull(),
  workerId: uuid('worker_id').references(() => tempWorkers.id).notNull(),
  clientId: uuid('client_id').references(() => tempClients.id).notNull(),
  hoursWorked: decimal('hours_worked', { precision: 6, scale: 1 }).notNull(),
  rate: decimal('rate', { precision: 8, scale: 2 }).notNull(),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  status: text('status').default('DRAFT').notNull(),
  dueDate: date('due_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ======== CONTRACTS ========

export const contractTemplates = pgTable('contract_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  content: text('content').notNull(),
  variables: jsonb('variables').default([]),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const contracts = pgTable('contracts', {
  id: uuid('id').primaryKey().defaultRandom(),
  templateId: uuid('template_id').references(() => contractTemplates.id),
  propertyId: uuid('property_id').references(() => properties.id),
  landlordId: uuid('landlord_id').references(() => landlords.id),
  tenantId: uuid('tenant_id').references(() => tenants.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  status: text('status').default('DRAFT').notNull(),
  signedAt: timestamp('signed_at'),
  signedByLandlord: boolean('signed_by_landlord').default(false),
  signedByTenant: boolean('signed_by_tenant').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
