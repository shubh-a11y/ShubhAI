# 🤖 ShubhAI — Multi-Agent AI Platform

<div align="center">

<img src="https://skillicons.dev/icons?i=react,js,tailwind,nodejs,express,mongodb,redis,docker,aws,firebase&perline=10" />

<br/>

<img src="https://skillicons.dev/icons?i=python,git,github,vite&perline=10" />

<br/><br/>

**A full-stack, microservice-based AI platform powered by specialized agents, LangChain, LangGraph and multiple AI models.**

Build • Analyze • Search • Code • Generate • Retrieve • Automate

<br/>



\

</div>

---

## 📸 Project Preview

<table>
<tr>
<td width="50%">
<img src="https://github.com/user-attachments/assets/96d1df6d-dbc9-44e2-b093-7da61b1e9ff5" alt="ShubhAI Chat Interface" />
<p align="center"><b>AI Chat Interface</b></p>
</td>

<td width="50%">
<img width="1902" height="1062" alt="image" src="https://github.com/user-attachments/assets/25a685f5-708f-4171-a8c9-e857914af246" />
<p align="center"><b>Web Search</b></p>
</td>
</tr>

<tr>
<td width="50%">
<img width="1807" height="886" alt="image" src="https://github.com/user-attachments/assets/59e736e9-e5d3-4b47-8c4b-d5473251cd2a" />

<p align="center"><b>Image Generation</b></p>
</td>

<td width="50%">
<img width="1552" height="890" alt="image" src="https://github.com/user-attachments/assets/35761e84-7ebe-446b-b677-0166a2eca8e9" />
<p align="center"><b>Credits & Billing</b></p>
</td>
</tr>
</table>

---

# 🎥 Demo

> **YouTube Demo:**
> 🔗 **[Watch the ShubhAI Technical Demo](YOUR_YOUTUBE_VIDEO_URL)**

The demo showcases the application's major capabilities, multi-agent routing, document and image processing, code generation, artifact generation, authentication, credits and payment flow.

---

# 📌 Table of Contents

* [About ShubhAI](#-about-shubhai)
* [Why ShubhAI?](#-why-shubhai)
* [Features](#-features)
* [AI Agent System](#-ai-agent-system)
* [System Architecture](#-system-architecture)
* [Request Lifecycle](#-request-lifecycle)
* [Specialized Agents](#-specialized-agents)
* [PDF RAG Pipeline](#-pdf-rag-pipeline)
* [Multimodal Image Analysis](#-multimodal-image-analysis)
* [Authentication & Sessions](#-authentication--sessions)
* [Credits & Billing](#-credits--billing)
* [Object Storage](#-object-storage)
* [Frontend Architecture](#-frontend-architecture)
* [Backend Architecture](#-backend-architecture)
* [Technology Stack](#-technology-stack)
* [Project Structure](#-project-structure)
* [Getting Started](#-getting-started)
* [Environment Variables](#-environment-variables)
* [Running the Project](#-running-the-project)
* [Docker & Infrastructure](#-docker--infrastructure)
* [Security Considerations](#-security-considerations)
* [Engineering Decisions](#-engineering-decisions)
* [Challenges & Learnings](#-challenges--learnings)
* [Future Improvements](#-future-improvements)
* [Contributing](#-contributing)
* [License](#-license)

---

# 🧠 About ShubhAI

**ShubhAI** is a full-stack, microservice-based AI platform designed to provide multiple AI capabilities through a unified conversational interface.

Instead of relying on a single monolithic AI endpoint, ShubhAI uses a **multi-agent architecture** where different tasks are handled by specialized agents.

Depending on the user's request, the system can:

* 💬 Have contextual conversations
* 🔎 Search the web
* 💻 Generate and reason about code
* 📄 Analyze uploaded PDFs
* 🧠 Perform PDF-based Retrieval-Augmented Generation (RAG)
* 🖼️ Analyze images using multimodal AI
* 🎨 Generate images
* 📑 Generate PDF documents
* 📊 Generate PowerPoint presentations
* 💳 Manage usage through a credit-based system
* 💰 Process payments through Razorpay
* 🔐 Authenticate users through Firebase
* ⚡ Maintain sessions using Redis
* ☁️ Store generated artifacts using S3-compatible object storage

The project was designed as an exploration of **modern full-stack AI engineering**, combining frontend engineering, backend architecture, distributed services, AI orchestration, storage, authentication, payments and containerization.

---

# 🎯 Why ShubhAI?

Many AI applications expose a single endpoint:

```text
User → API → LLM → Response
```

ShubhAI takes a different approach:

```text
                    User
                     │
                     ▼
                 Frontend
                     │
                     ▼
                API Gateway
                     │
                     ▼
             Agent Orchestrator
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
      Chat         Search       Coding
        │            │            │
        └────────────┼────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
      PDF RAG    Image Analysis  Generation
```

This allows each capability to have its own logic, prompts, tools and processing pipeline.

---

# ✨ Features

## 💬 Intelligent AI Chat

* Conversational AI interface
* Persistent conversations
* Context-aware interactions
* Markdown rendering
* Syntax highlighting
* Animated message transitions
* Loading state while the AI is processing
* Optimistic user-message rendering

---

## 🤖 Multi-Agent AI

ShubhAI supports multiple specialized agents:

| Agent              | Purpose                               |
| ------------------ | ------------------------------------- |
| 💬 Chat            | General conversational AI             |
| 🔎 Search          | Web-search-based answers              |
| 💻 Coding          | Code generation and coding tasks      |
| 📄 PDF             | PDF generation                        |
| 🧠 PDF RAG         | Question answering over uploaded PDFs |
| 🖼️ Image Analyzer | Multimodal image understanding        |
| 🎨 Image           | Image generation                      |
| 📊 PPT             | PowerPoint generation                 |

The user can also use **Auto mode**, allowing the system to determine the appropriate processing path.

---

## 📎 File Uploads

Users can upload:

* PDF documents
* Images

The frontend uses `FormData` to send attachments to the backend, while Multer handles multipart uploads on the server.

Uploaded files are propagated through the AI pipeline using the LangGraph state.

---

## 🧠 PDF RAG

ShubhAI supports Retrieval-Augmented Generation over uploaded PDF documents.

The pipeline allows users to ask questions about the contents of a document rather than relying solely on the model's general knowledge.

```text
PDF Upload
    │
    ▼
File Processing
    │
    ▼
Document Extraction
    │
    ▼
Chunking / Retrieval
    │
    ▼
Relevant Context
    │
    ▼
LLM
    │
    ▼
Grounded Response
```

---

## 🖼️ Multimodal Image Analysis

Images can be uploaded directly through the chat interface.

The image is passed through the agent pipeline and processed using a multimodal model.

```text
Image
  │
  ▼
Multer
  │
  ▼
LangGraph State
  │
  ▼
Image Analyzer Agent
  │
  ▼
Multimodal LLM
  │
  ▼
Analysis
```

---

## 💻 Coding Agent

The Coding Agent is designed for programming-related tasks.

It can:

* Generate code
* Explain code
* Handle coding-oriented prompts
* Return generated project/file artifacts when required
* Distinguish coding requests from general conversational requests

The frontend also integrates a Monaco-based editor experience for code-oriented functionality.

---

## 📄 PDF Generation

ShubhAI can generate PDF artifacts from user prompts.

The generated document is processed by the dedicated PDF agent and uploaded to object storage.

---

## 📊 PowerPoint Generation

The PPT agent can generate presentation artifacts from natural-language prompts.

The generated presentation is uploaded to object storage and exposed to the frontend through a temporary signed URL.

---

## 🎨 Image Generation

The Image Agent converts a natural-language request into an image-generation prompt, invokes the image-generation pipeline and stores the resulting artifact.

---

# 🤖 AI Agent System

The core of ShubhAI is its **LangGraph-based agent orchestration system**.

The agent service contains dedicated agent implementations for chat, coding, image generation, image analysis, PDF generation, PDF RAG, PPT generation and search.

Conceptually:

```text
                         ┌─────────────┐
                         │    START    │
                         └──────┬──────┘
                                │
                                ▼
                         ┌─────────────┐
                         │    Router   │
                         └──────┬──────┘
                                │
        ┌───────────────┬───────┼────────┬───────────────┐
        ▼               ▼       ▼        ▼               ▼
      Chat           Search   Coding    PDF           Image
                                      │
                                      ▼
                                    PDF RAG

        ┌───────────────────────┬──────────────────────┐
        ▼                       ▼                      ▼
   Image Analyzer             PPT                Generation
        │
        └───────────────────────┬──────────────────────┘
                                ▼
                              END
```

LangGraph allows the application to represent AI workflows as explicit graph-based state transitions instead of placing all orchestration logic into a single controller.

---

# 🏗️ System Architecture

ShubhAI follows a **microservice-oriented backend architecture**.

```text
                                      ┌──────────────────────┐
                                      │       React UI       │
                                      │   Vite + Tailwind    │
                                      └──────────┬───────────┘
                                                 │
                                                 │ HTTP / Axios
                                                 ▼
                                      ┌──────────────────────┐
                                      │     API Gateway      │
                                      │       Express        │
                                      └──────────┬───────────┘
                                                 │
                    ┌────────────────────────────┼───────────────────────────┐
                    │                            │                           │
                    ▼                            ▼                           ▼
          ┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
          │  Auth Service   │        │  Chat Service   │        │  Agent Service  │
          │                 │        │                 │        │                 │
          │ Firebase Auth   │        │ Conversations   │        │   LangGraph     │
          │ Redis Sessions  │        │ Message Store   │        │ Specialized     │
          └────────┬────────┘        └────────┬────────┘        │ Agents          │
                   │                          │                 └────────┬────────┘
                   │                          │                          │
                   ▼                          ▼                          ▼
              ┌─────────┐                ┌─────────┐            ┌────────────────┐
              │ MongoDB │                │ MongoDB │            │ Multiple LLMs  │
              └─────────┘                └─────────┘            └────────────────┘
                                                                      │
                                                                      ▼
                                                               ┌──────────────┐
                                                               │    MinIO     │
                                                               │ S3-Compatible│
                                                               │ Object Store │
                                                               └──────────────┘

                                      ┌──────────────────────┐
                                      │   Billing Service    │
                                      │                      │
                                      │ Razorpay Integration │
                                      │ Payment Verification │
                                      │ Credit Management    │
                                      └──────────┬───────────┘
                                                 │
                                                 ▼
                                             MongoDB
```

---

# 🔄 Request Lifecycle

A typical AI request follows this flow:

```text
1. User enters prompt
        │
        ▼
2. React creates FormData
        │
        ▼
3. Axios sends request
        │
        ▼
4. API Gateway receives request
        │
        ▼
5. Authentication/session is validated
        │
        ▼
6. Agent Service receives request
        │
        ▼
7. LangGraph determines execution path
        │
        ▼
8. Specialized agent executes
        │
        ▼
9. Required LLM / tool / storage is invoked
        │
        ▼
10. Result is returned
        │
        ▼
11. Chat service persists conversation/message data
        │
        ▼
12. Frontend updates Redux state
        │
        ▼
13. Assistant response is rendered
```

---

# 📄 PDF RAG Pipeline

When a user uploads a PDF:

```text
                    PDF
                     │
                     ▼
                Multer Upload
                     │
                     ▼
              Agent Request
                     │
                     ▼
              LangGraph State
                     │
                     ▼
                PDF RAG Agent
                     │
                     ▼
          Document Processing
                     │
                     ▼
              Retrieval Layer
                     │
                     ▼
            Relevant Document
                Context
                     │
                     ▼
                   LLM
                     │
                     ▼
              Grounded Answer
```

This separates document retrieval from general conversation and allows the application to provide context-specific answers.

---

# 🖼️ Multimodal Image Analysis

Image analysis follows a similar attachment-aware routing strategy:

```text
                Image Upload
                     │
                     ▼
                  Multer
                     │
                     ▼
                req.file
                     │
                     ▼
              LangGraph State
                     │
                     ▼
          Image Analyzer Agent
                     │
                     ▼
             Base64 Encoding
                     │
                     ▼
          Multimodal LLM Model
                     │
                     ▼
                 Analysis
```

This architecture allows the same conversational interface to handle both text and multimodal requests.

---

# 🔐 Authentication & Sessions

Authentication uses **Firebase Authentication** for identity verification.

The backend then creates its own application session.

```text
User
 │
 ▼
Firebase Authentication
 │
 ▼
Firebase ID Token
 │
 ▼
Auth Service
 │
 ├── Verify Firebase Token
 │
 ├── Find/Create User
 │
 ├── Generate Session ID
 │
 └── Store Session in Redis
 │
 ▼
HTTP-Only Session Cookie
```

Redis is used as the session store, allowing session state to remain external to individual backend processes.

The session contains application-level user information such as:

* User ID
* Name
* Email
* Firebase UID
* Avatar
* Plan
* Credits
* Total credits
* Plan expiration

---

# 💳 Credits & Billing

ShubhAI implements a credit-based usage system.

Different operations consume different amounts of credits.

Example:

| Operation | Credits |
| --------- | ------: |
| Chat      |      10 |
| Search    |      20 |
| Coding    |      30 |
| PPT       |      50 |
| PDF       |      50 |
| Image     |      50 |

The credit system is integrated with the billing service.

```text
                 User
                  │
                  ▼
             Select Plan
                  │
                  ▼
          Create Razorpay Order
                  │
                  ▼
              Razorpay
                  │
                  ▼
           Payment Completed
                  │
                  ▼
          Signature Verification
                  │
                  ▼
          Billing Service
                  │
                  ▼
           Update User Plan
                  │
                  ▼
          Add Credits to Account
                  │
                  ▼
             Redis Refresh
```

The backend stores payment records containing information such as order ID, payment ID, amount, credits, selected plan and payment status.

---

# ☁️ Object Storage

Generated files such as PDFs, PowerPoint presentations and images require persistent object storage.

Instead of tightly coupling development to AWS S3, ShubhAI uses **MinIO**, an S3-compatible object-storage solution.

This provides an architecture similar to:

```text
Application
     │
     ▼
S3-Compatible API
     │
     ▼
   MinIO
     │
     ▼
Persistent Object Storage
```

This keeps the application compatible with an S3-style storage interface while allowing local development without requiring an AWS S3 deployment.

The project's Docker Compose configuration includes MinIO with persistent volume storage and exposes both its API and web console.

---

# 🎨 Frontend Architecture

The frontend is built using:

* React
* Vite
* Tailwind CSS
* Redux Toolkit
* Axios
* Framer Motion
* Lucide React
* React Markdown
* React Syntax Highlighter
* Monaco Editor

The current frontend dependency stack reflects this combination of UI, state management, animation, Markdown/code rendering and development tooling.

### Frontend flow

```text
React Components
       │
       ▼
Redux Store
       │
       ▼
Feature/API Functions
       │
       ▼
Axios
       │
       ▼
API Gateway
```

The application separates:

* UI components
* Pages
* Redux state
* API feature functions
* Assets

This keeps API communication separate from presentation logic.

---

# 🧩 Frontend State Management

Redux Toolkit is used for global application state.

Important state domains include:

### User State

Stores:

* Current user
* Plan
* Credits
* Total credits
* User profile information

### Conversation State

Stores:

* Conversations
* Selected conversation
* Conversation metadata

### Message State

Stores:

* Messages
* Generated artifacts
* AI responses
* Conversation output

This allows different parts of the application to react to changes without tightly coupling components.

---

# 📂 Backend Architecture

The backend is divided into independently organized services.

```text
backend/
│
├── gateway/
│
├── services/
│   │
│   ├── auth/
│   │
│   ├── chat/
│   │
│   ├── agent/
│   │
│   └── billing/
│
├── shared/
│
└── docker-compose.yml
```

The repository currently contains dedicated `gateway`, `auth`, `chat`, and `billing` services alongside the agent service.

---

# 🚪 API Gateway

The gateway acts as the primary entry point for the frontend.

Conceptually:

```text
Frontend
   │
   ▼
Gateway
   │
   ├── /api/auth
   │
   ├── /api/chat
   │
   ├── /api/agent
   │
   ├── /api/me
   │
   └── /api/billing
```

This prevents the frontend from needing to know the internal location of every microservice.

It also provides a centralized location for cross-cutting concerns such as:

* CORS
* Cookies
* Authentication protection
* Routing
* Service proxying

---

# 🧠 Agent Service

The Agent Service contains the AI orchestration layer.

Its structure separates:

```text
agents/
config/
controllers/
graph/
routes/
utils/
```

The agent directory currently contains dedicated implementations for:

* Chat
* Coding
* Image generation
* Image analysis
* PDF generation
* PDF RAG
* PPT generation
* Search

This organization keeps each AI capability independently maintainable.

---

# 🛠️ Technology Stack

## Frontend

<div align="center">

<img src="https://skillicons.dev/icons?i=react,js,tailwind,vite" />

</div>

* React
* JavaScript
* Vite
* Tailwind CSS
* Redux Toolkit
* Axios
* Framer Motion
* Lucide React
* React Markdown
* React Syntax Highlighter
* Monaco Editor

---

## Backend

<div align="center">

<img src="https://skillicons.dev/icons?i=nodejs,express" />

</div>

* Node.js
* Express.js
* REST APIs
* Axios
* Microservice architecture

---

## AI / LLM

* LangChain
* LangGraph
* Groq
* Gemini
* OpenRouter
* Multimodal LLM processing
* Retrieval-Augmented Generation

---

## Databases & Storage

<div align="center">

<img src="https://skillicons.dev/icons?i=mongodb,redis" />

</div>

* MongoDB
* Redis
* MinIO
* S3-compatible object storage

---

## Authentication & Payments

* Firebase Authentication
* Redis-backed application sessions
* Razorpay
* HTTP-only cookies

---

## DevOps / Infrastructure

<div align="center">

<img src="https://skillicons.dev/icons?i=docker,aws,git,github" />

</div>

* Docker
* Docker Compose
* AWS EC2
* AWS ECR
* MinIO
* Git
* GitHub

---

# 📁 Project Structure

```text
ShubhAI/
│
├── frontend/
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── ...
│
├── backend/
│   │
│   ├── gateway/
│   │
│   ├── services/
│   │   ├── auth/
│   │   ├── chat/
│   │   ├── agent/
│   │   │   ├── agents/
│   │   │   ├── config/
│   │   │   ├── controllers/
│   │   │   ├── graph/
│   │   │   ├── routes/
│   │   │   └── utils/
│   │   │
│   │   └── billing/
│   │
│   ├── shared/
│   │
│   ├── docker-compose.yml
│   └── package.json
│
├── package.json
└── README.md
```

The repository separates frontend and backend concerns at the root level, while the backend further separates gateway, services and shared code.

---

# 🚀 Getting Started

## Prerequisites

Make sure the following are installed:

* Node.js 18+
* npm
* Git
* Docker
* Docker Compose
* MongoDB
* Firebase project
* Required AI API keys
* Razorpay account for payment functionality

---

# 📥 Clone the Repository

```bash
git clone https://github.com/shubh-a11y/ShubhAI.git

cd ShubhAI
```

---

# 🐳 Start Infrastructure Services

The backend includes Docker Compose configuration for Redis and MinIO.

```bash
cd backend

docker compose up -d
```

This starts:

```text
Redis
  ↓
localhost:6379

MinIO API
  ↓
localhost:9000

MinIO Console
  ↓
localhost:9001
```

The Compose configuration persists MinIO data through a Docker volume.

---

# ⚙️ Environment Variables

Create the required `.env` files for the relevant services.

> **Never commit real API keys, Firebase credentials, Razorpay secrets or other sensitive values to Git.**

Typical configuration includes:

```env
# MongoDB
MONGO_URI=your_mongodb_connection_string

# Redis
REDIS_URL=redis://localhost:6379

# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_private_key

# AI Providers
GROQ_API_KEY=your_groq_key
GEMINI_API_KEY=your_gemini_key
OPENROUTER_API_KEY=your_openrouter_key

# Razorpay
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret

# MinIO / S3-compatible storage
AWS_ACCESS_KEY_ID=your_minio_access_key
AWS_SECRET_ACCESS_KEY=your_minio_secret_key
AWS_REGION=your_region
AWS_S3_BUCKET=your_bucket_name

# Service configuration
FRONTEND_URL=http://localhost:5173
```

Adjust variable names according to the `.env` configuration expected by each service.

---

# ▶️ Running the Frontend

```bash
cd frontend

npm install

npm run dev
```

The frontend is built with Vite and exposes the standard development/build scripts defined in its package configuration.

---

# ▶️ Running the Backend

Each backend service can be started independently according to its own package configuration.

Typical development flow:

```bash
cd backend/services/auth
npm install
npm run dev
```

Repeat for the required services:

```text
auth
chat
agent
billing
gateway
```

The exact commands can be adapted to the scripts defined in each service's `package.json`.

---

# 🐳 Docker & Infrastructure

Docker is used to simplify infrastructure setup and make the development environment reproducible.

The current backend Compose configuration provisions:

```text
┌────────────────────┐
│ Docker Compose     │
├────────────────────┤
│                    │
│ Redis              │
│                    │
│ MinIO              │
│                    │
└────────────────────┘
```

MinIO uses a persistent Docker volume so stored artifacts survive container restarts.

---

# 🔒 Security Considerations

ShubhAI was designed with several security considerations:

### HTTP-only Sessions

Authentication sessions are maintained using HTTP-only cookies rather than exposing session identifiers directly to frontend JavaScript.

### Environment Variables

Sensitive configuration is kept outside source code.

### Firebase Token Verification

Firebase identity tokens are verified server-side.

### API Gateway Protection

Protected backend routes are accessed through the gateway and authentication middleware.

### File Validation

Uploaded files are restricted to supported types such as:

* PDF
* Images

and uploads are size-limited.

### S3-Compatible Storage

Generated artifacts are stored through an object-storage interface rather than exposing local filesystem paths to clients.

---

# 🧠 Engineering Decisions

## Why Microservices?

The project separates major responsibilities into services:

```text
Authentication
       │
       ├── independent service

Chat
       │
       ├── independent service

AI Agents
       │
       ├── independent service

Billing
       │
       └── independent service
```

This keeps unrelated concerns isolated and provides a foundation for independently scaling or modifying services.

---

## Why LangGraph?

A multi-agent system contains branching workflows.

LangGraph provides an explicit stateful graph model for representing:

* routing
* agent transitions
* shared state
* conditional execution
* specialized workflows

This is more expressive than placing every possible AI capability into one large controller.

---

## Why Redis?

Redis is used for application sessions and fast-access state.

Instead of keeping sessions entirely inside individual Node.js processes:

```text
Request
   ↓
Any Backend Instance
   ↓
Redis
   ↓
Session
```

This makes session management more suitable for distributed services.

---

## Why MinIO?

MinIO provides S3-compatible object storage.

It allows the application to use an S3-style API while avoiding unnecessary dependence on AWS infrastructure during development.

This also makes the storage layer easier to migrate between:

```text
Development
    ↓
MinIO

Production
    ↓
AWS S3 / compatible storage
```

---

## Why a Gateway?

Without a gateway:

```text
Frontend
 ├── Auth Service
 ├── Chat Service
 ├── Agent Service
 └── Billing Service
```

With a gateway:

```text
Frontend
     │
     ▼
Gateway
 ├── Auth
 ├── Chat
 ├── Agent
 └── Billing
```

The frontend only needs to understand one backend entry point.

---

# 🧪 Error Handling & User Experience

The frontend includes several UX mechanisms designed to make asynchronous AI operations feel responsive:

* Optimistic user messages
* Disabled input during generation
* Assistant loading animation
* Smooth message transitions
* Automatic scrolling
* Attachment previews
* File removal
* Animated UI interactions
* Markdown rendering
* Code syntax highlighting

These features are particularly important because AI requests can take significantly longer than ordinary CRUD requests.

---

# 📚 What I Learned Building ShubhAI

Building ShubhAI involved learning and applying a wide range of technologies and engineering concepts.

### Frontend Engineering

* React component architecture
* Redux Toolkit
* API abstraction
* Async state handling
* File uploads
* Responsive UI
* Animations
* Markdown rendering
* Code editors

### Backend Engineering

* Express.js
* REST APIs
* API gateways
* Microservices
* Middleware
* Authentication
* Session management
* File processing

### AI Engineering

* LangChain
* LangGraph
* Prompt engineering
* Agent orchestration
* RAG
* Multimodal AI
* Multiple LLM providers
* AI-generated artifacts

### Infrastructure

* Docker
* Docker Compose
* Redis
* MinIO
* AWS concepts
* EC2
* ECR
* S3-compatible storage

### Application Infrastructure

* Firebase Authentication
* MongoDB
* Razorpay
* Credit-based usage systems
* Service-to-service communication

---

# ⚡ Key Technical Highlights

The most technically significant parts of ShubhAI include:

### 1. Multi-Agent Orchestration

Different requests can be routed to specialized AI agents.

### 2. Stateful AI Workflows

LangGraph is used to model the agent execution flow and shared state.

### 3. Attachment-Aware Routing

Uploaded files can change the execution path, allowing PDF and image requests to be handled by specialized processing pipelines.

### 4. RAG

Uploaded PDFs can be used as a source of contextual information for AI responses.

### 5. Multimodal AI

Images can be passed to multimodal models for analysis.

### 6. Microservice Backend

Authentication, chat, AI processing and billing are separated into dedicated services.

### 7. Redis Sessions

Application sessions are stored outside individual backend processes.

### 8. S3-Compatible Storage

MinIO provides local object storage while preserving an S3-compatible architecture.

### 9. Credit-Based Monetization

AI operations consume credits and paid plans can replenish user balances.

### 10. Artifact Generation

The system can generate and store PDFs, PPTs and images.

---

# 📈 Future Improvements

Potential future improvements include:

* [ ] Streaming LLM responses
* [ ] Real-time agent execution status
* [ ] Agent execution tracing
* [ ] More sophisticated RAG evaluation
* [ ] Vector database integration
* [ ] Background job processing
* [ ] Message queues
* [ ] Better service discovery
* [ ] Rate limiting
* [ ] Centralized logging
* [ ] Distributed tracing
* [ ] Automated tests
* [ ] CI/CD pipeline
* [ ] Production deployment
* [ ] Kubernetes orchestration
* [ ] Voice input
* [ ] More multimodal capabilities
* [ ] Improved payment idempotency
* [ ] More granular authorization
* [ ] Persistent artifact history

---

# 🚧 Deployment

ShubhAI is designed to be container-friendly and can be deployed using a container-based infrastructure.

A production deployment could follow a model such as:

```text
                         Internet
                             │
                             ▼
                       Load Balancer
                             │
                             ▼
                       API Gateway
                             │
             ┌───────────────┼────────────────┐
             ▼               ▼                ▼
           Auth            Chat             Agent
             │               │                │
             └───────────────┼────────────────┘
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
                 MongoDB            Redis
                                       
                             │
                             ▼
                       Object Storage
```

For local development and demonstrations, Docker Compose with Redis and MinIO provides the necessary infrastructure without requiring a cloud deployment.

---

# 🏆 Project Status

**Status: Completed ✅**

ShubhAI was developed as an end-to-end exploration of modern AI application engineering.

The project combines:

```text
Frontend Engineering
        +
Backend Engineering
        +
Microservices
        +
AI Agents
        +
RAG
        +
Multimodal AI
        +
Authentication
        +
Payments
        +
Distributed State
        +
Object Storage
        +
Containerization
```

---

# 👨‍💻 Author

### Shubhang

Computer Science / Software Engineering Student

Interested in:

* Full-Stack Development
* AI Engineering
* Backend Architecture
* Distributed Systems
* Competitive Programming
* Developer Tools

---

# 🤝 Contributing

Contributions, suggestions and improvements are welcome.

### Fork the repository

```bash
git fork
```

### Create a feature branch

```bash
git checkout -b feature/amazing-feature
```

### Commit your changes

```bash
git commit -m "Add amazing feature"
```

### Push the branch

```bash
git push origin feature/amazing-feature
```

### Open a Pull Request

---

# ⭐ Support

If you found the project interesting, consider giving the repository a ⭐ on GitHub.

It helps the project get more visibility and motivates further development.

---

# 📜 License

This project is licensed under the MIT License.

See the `LICENSE` file for more information.

---

<div align="center">

## 🚀 Built with curiosity, countless debugging sessions, and a lot of ☕.

### **ShubhAI**

**A multi-agent AI platform built from the ground up.**

⭐ Star the repository if you found it interesting.

</div>
