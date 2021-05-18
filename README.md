# 🍓 Strawberry SCIM client
Lightweight SCIM client with simple Bootstrap UI to make HTTP requests to your SCIM Endpoints.

## Features
- quick setup (only your endpoint URL and secret token are needed) with connection test
- quick tests
  - predefined group names to test your enpoint
- based mainly on [AAD SCIM client.](https://docs.microsoft.com/en-us/azure/active-directory/app-provisioning/use-scim-to-provision-users-and-groups#understand-the-aad-scim-implementation)

## Demo
Try it right away: https://strawberry-scim.vercel.app/

# Next.js
Dev:
- `npm run dev`
- `http://localhost:4041`

Stack:
- nextjs, bootstrap 5, vercel
- jest, cypress

TODO / Roadmap:
- [ ] `/Users` endpoint section
- [ ] DB of Users and Groups
- [ ] i18n: english, czech
- [ ] jest + code coverage
- [ ] cypress
