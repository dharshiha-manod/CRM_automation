# Manod CRM Automation

Manod CRM is a React + Node.js CRM system with lead automation, proposal workflow, payment reminders, customer success automation, follow-ups, reports, campaigns, and user management.

## Project structure

- `frontend/` - Vite React CRM app
- `backend/` - Express API server
- `amplify.yml` - AWS Amplify build config for the frontend
- `.github/workflows/deploy-backend-elastic-beanstalk.yml` - GitHub Actions deployment for the backend

## Local development

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
npm install
npm run dev
```

## AWS auto deployment

Frontend deployment is handled by AWS Amplify. The included `amplify.yml` builds the `frontend` app from the repository root.

Backend deployment is handled by GitHub Actions and Elastic Beanstalk. Add these GitHub repository secrets before using the workflow:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION` - example: `ap-southeast-2`
- `EB_APPLICATION_NAME` - example: `manod-crm-backend`
- `EB_ENVIRONMENT_NAME` - example: `Manod-crm-backend-env`
- `EB_S3_BUCKET` - an S3 bucket in the same AWS region for deployment bundles

Set backend runtime values such as database, email, Twilio, and OpenAI keys in Elastic Beanstalk environment properties. Do not commit `.env` files.

For the frontend, set `VITE_API_URL` in Amplify environment variables to your backend API URL.
