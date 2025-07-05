# 🔑 Your Production Environment Variables

Copy these EXACT values to your Vercel dashboard:

## Variable 1: ADMIN_USERS
```
Name: ADMIN_USERS
Value: [{"username":"admin","passwordHash":"$2a$12$pq1PXHjpfeyEpctlYp3aHeFAAGlAt9j2i5q5XsPrHYdEbO825xv9u"},{"username":"superadmin","passwordHash":"$2a$12$k9t2/EZgZ5k1end25ul3Nu9.MNYrdHon/1iPEaRL7RFeDzlJ9xiqu"}]
```

## Variable 2: JWT_SECRET
```
Name: JWT_SECRET
Value: cb4550f073d0b2ae1f5a25f8818b06a4fc5695c9426d2621081ddb3353c573fa8f5394c69ae9c6fa788c47f5683838eefaefc5fbe5039c561df5e0b5cbb5654c5d
```

## Test Credentials (CHANGE IN PRODUCTION!)
- Username: `admin` | Password: `admin123!@#`
- Username: `superadmin` | Password: `super456$%^`

## Quick Copy Commands:
```
ADMIN_USERS=[{"username":"admin","passwordHash":"$2a$12$pq1PXHjpfeyEpctlYp3aHeFAAGlAt9j2i5q5XsPrHYdEbO825xv9u"},{"username":"superadmin","passwordHash":"$2a$12$k9t2/EZgZ5k1end25ul3Nu9.MNYrdHon/1iPEaRL7RFeDzlJ9xiqu"}]

JWT_SECRET=cb4550f073d0b2ae1f5a25f8818b06a4fc5695c9426d2621081ddb3353c573fa8f5394c69ae9c6fa788c47f5683838eefaefc5fbe5039c561df5e0b5cbb5654c5d
```

⚠️ **SECURITY NOTE**: Change these passwords immediately after testing!
