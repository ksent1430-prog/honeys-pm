# OpsFlow API Routes

## Created by Backend & Data Specialist

All routes under `/home/team/shared/opsflow/src/app/api/`

### Route Inventory

| API | File | Methods | Description |
|-----|------|---------|-------------|
| **Leads** | `/api/leads/route.ts` | GET, POST | List (with filters: status, source, date range, search), Create |
| | `/api/leads/[id]/route.ts` | GET, PATCH, DELETE | Detail, Update (status/notes), Delete |
| **Customers** | `/api/customers/route.ts` | GET, POST | List (with search), Create |
| | `/api/customers/[id]/route.ts` | GET, PATCH, DELETE | Detail with service history, Update, Delete |
| **Properties** | `/api/properties/route.ts` | GET, POST | List (filters: type, status, search) with tenants, Create |
| | `/api/properties/[id]/route.ts` | GET, PATCH, DELETE | Detail with work orders/inspections/appointments, Update, Delete |
| **Work Orders** | `/api/work-orders/route.ts` | GET, POST | List (filters: type, status, assignedTo, propertyId), Create |
| | `/api/work-orders/[id]/route.ts` | GET, PATCH, DELETE | Detail, Update (auto-sets completedAt), Delete |
| **Messages** | `/api/messages/route.ts` | GET, POST | List (scoped to user, filters: sender, receiver, entity), Send |
| | `/api/messages/[id]/route.ts` | GET, PATCH | Detail, Mark as read |
| **Notifications** | `/api/notifications/route.ts` | GET, POST | List for user (with unread count), Create |
| | `/api/notifications/[id]/route.ts` | PATCH | Mark as read |
| **Inspections** | `/api/inspections/route.ts` | GET, POST | List (filters: propertyId, status), Schedule |
| | `/api/inspections/[id]/route.ts` | GET, PATCH | Detail, Update (auto-sets completedAt) |
| **Appointments** | `/api/appointments/route.ts` | GET, POST | List (date range, propertyId, status), Create |
| | `/api/appointments/[id]/route.ts` | PATCH, DELETE | Update, Delete |
| **Invoices** | `/api/invoices/route.ts` | GET, POST | List (filters: status, customerId, propertyId), Create (auto-number) |
| | `/api/invoices/[id]/route.ts` | GET, PATCH | Detail with payments, Update (auto-sets paidAt) |
| **Payments** | `/api/payments/route.ts` | GET, POST | List by invoice, Record (auto-updates invoice status) |
| **Audit Logs** | `/api/audit-logs/route.ts` | GET | List (admin-only, filters: entity, action) |
| **Uploads** | `/api/uploads/route.ts` | POST | File upload (validation, placeholder URL) |
| **Reports** | `/api/reports/route.ts` | GET | Type: revenue, leads, work-orders, properties |
| **Dashboard** | `/api/dashboard/kpi/route.ts` | GET | KPI aggregation (existing, was built earlier) |

### Conventions
- All routes use Clerk `auth()` for authentication
- All routes use `db.execute(sql\`...\`)` for database operations (raw SQL for compatibility)
- Input validation via `validateInput()` helper
- Error handling with `ApiError` class and `handleApiError()` wrapper
- Proper HTTP status codes (200, 201, 400, 401, 404, 500)
- Dynamic data via `force-dynamic` export
- TypeScript strict mode compatible

### Shared Helper
- `/home/team/shared/opsflow/src/lib/api-helpers.ts` - `requireAuth()`, `ApiError`, `handleApiError()`, `successResponse()`, `notFoundResponse()`, `validateInput()`