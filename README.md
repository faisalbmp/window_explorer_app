Window Explorer Monorepo
This repository contains the source code for a web-based file explorer application, built as a monorepo with a separate frontend and backend.

Frontend: A responsive user interface built with Nuxt.js and Vue 3, styled with Tailwind CSS.

Backend: A robust API service powered by Elysia.js on the Bun runtime, connected to a PostgreSQL database with Drizzle ORM.

The project is structured as a monorepo managed with Bun Workspaces, allowing for unified dependency management and streamlined development workflows.

Features
Two-Panel Layout: Classic file explorer interface with a folder tree on the left and content view on the right.

Hierarchical Folder View: The left panel displays the complete folder structure, which can be expanded and collapsed.

Dynamic Content Display: Clicking a folder in the tree dynamically loads its subfolders and files into the right panel.

Modern Tech Stack: Utilizes a fast, modern, and type-safe stack with Bun, TypeScript, Elysia.js, and Nuxt.js.

Comprehensive Testing: Includes unit, integration, and End-to-End (E2E) tests for both frontend and backend to ensure reliability.

Getting Started

Quick Start
Install dependencies from the root directory:

bun install

Configure your .env file in packages/backend.

Run database migrations from the root directory:

bun run be:migrate

Start both development servers from the root directory:

bun run dev

Backend API will be available at http://localhost:3000.

Frontend application will be available at http://localhost:3001.