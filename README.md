# 🍓 Strawberry SCIM client
Lightweight SCIM client with simple UI that makes HTTP requests to your SCIM Endpoints. Based mainly on [AAD SCIM client](https://docs.microsoft.com/en-us/azure/active-directory/app-provisioning/use-scim-to-provision-users-and-groups#understand-the-aad-scim-implementation).

## Features
### 🔌 Connection test
You need only **endpoint URL** and **secret token**

### 👤👥 Quick CRUD tests
Predefined groups and users to test your endpoint in one click.

### 🧪 Advanced tests
Predefined set of requests simulating advanced - more real-life - synchronization. You can select the number of queries run.

### Curl commands
For every action there is curl command available which you can copy to clipboard. Look for `curl` button in action status.

## Demo
Try it right away: https://strawberry-scim.vercel.app/

# Astro
Dev:
```sh
npm run dev
```
Open `http://localhost:3000`

Build:
```sh
npm run build
npm run start
```

Stack:
- Astro with React components
- React Bootstrap 5
- Node.js adapter for server-side functionality

