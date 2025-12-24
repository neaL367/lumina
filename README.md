# Lumina

Lumina is a **Next.js** application that demonstrates a modern image gallery with advanced routing patterns. It integrates **Cloudinary** for image management and uses **Next.js Parallel Routes and Interception** to implement high‑performance image modals, inspired by the `nextgram` example.

## Demo

👉 [https://lumina-khaki-delta.vercel.app](https://lumina-khaki-delta.vercel.app)

## Deploy Your Own

Deploy your own copy of Lumina to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FneaL367%2Flumina&env=NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,CLOUDINARY_API_KEY,CLOUDINARY_API_SECRET)

## Features

* **Next.js App Router** – Built with the latest Next.js features, including React Server Components and streaming.
* **Advanced Routing** – Uses **Parallel Routes** and **Intercepting Routes** to display images in modals when navigating from the feed, while still supporting shareable, standalone URLs on refresh.
* **Cloudinary Integration** – High‑performance image optimization and delivery.
* **Tailwind CSS** – Utility‑first styling for rapid UI development.
* **TypeScript** – Fully type‑safe codebase.

## Getting Started

Follow these steps to run the project locally.

### 1. Clone the repository

```bash
git clone https://github.com/neaL367/lumina.git
cd lumina
```

### 2. Install dependencies

This project uses **bun** for package management (based on `bun.lock`), but you can use your preferred package manager.

```bash
bun install
```

### 3. Configure environment variables

Add your Cloudinary credentials `.env.local`:

```bash
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=your_folder
```

### 4. Run the development server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Project Structure

```txt
app/          # App Router setup, including modal routing logic
@modal        # Parallel route slot for intercepting routes (modals)
components/   # Reusable UI components
lib/          # Cloudinary configuration and helpers
utils/        # Shared utility functions
```

## References

* Parallel Routes & Modals: [https://nextjs.org/docs/app/building-your-application/routing/parallel-routes#modals](https://nextjs.org/docs/app/building-your-application/routing/parallel-routes#modals)
* Image Gallery Starter: [https://github.com/vercel/next.js/tree/canary/examples/with-cloudinary](https://github.com/vercel/next.js/tree/canary/examples/with-cloudinary)
* NextGram: [https://github.com/vercel/nextgram](https://github.com/vercel/nextgram)
