# Medivoy Backend — New Modules

## New modules added
- FamilyModule   → /api/family
- OrdersModule   → /api/orders
- ProfileModule  → /api/profile
- GeneticsModule → /api/genetics

## Where to copy files
- All `src/modules/*/` files go into your NestJS `src/modules/` folder
- Replace `src/app.module.ts` with the updated version
- Replace `app/composables/useMedivoyApi.ts` with the updated frontend composable

## New API routes

### Family
POST   /api/family          Add a family member
GET    /api/family          List members for logged-in user
DELETE /api/family/:id      Remove a member

### Orders
POST   /api/orders          Place a lab kit order
GET    /api/orders          List user orders
PATCH  /api/orders/:id/status  Update order status
DELETE /api/orders/:id      Cancel/delete order

### Profile
POST   /api/profile         Save or update health profile
GET    /api/profile         Load saved profile

### Genetics
POST   /api/genetics        Save genetics analysis result
GET    /api/genetics        Load saved genetics data

## TypeORM
All entities use synchronize: true so tables are created automatically on restart.
No migration needed for local development.