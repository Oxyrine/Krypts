# Krypts DRM Platform

Krypts is a secure, plug-and-play Digital Rights Management (DRM) platform designed to protect images, PDFs, and video files from unauthorized distribution and screen-capture leaks. It offers military-grade encryption, time-limited signed tokens, dynamic watermarking, and an intuitive dashboard for managing protected media.

---

##  Tech Stack & Infrastructure

The project is built on a modern, decoupled architecture split into a React frontend and a Python backend:

### Frontend (Web Dashboard & Viewers)
* **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
* **Language**: TypeScript
* **Styling**: Tailwind CSS, [shadcn/ui](https://ui.shadcn.com/), GSAP Animations
* **Deployment**: [Vercel](https://vercel.com/) (Connected via continuous deployment from the GitHub repository)

### Native Desktop App (Screenshot Protection)
* **Framework**: Electron.js wrapping the Next.js frontend
* **Core Functionality**: Uses OS-level APIs (`SetWindowDisplayAffinity`) to completely block screen recorders (OBS, Zoom) and OS snipping tools (Win+Shift+S, Mac Screenshot) by rendering a black screen.
* **Repository**: Maintained as a separate repository (`Oxyrine/krypts-2.0`) to keep the web build clean.

### Backend
* **Framework**: [FastAPI](https://fastapi.tiangolo.com/) (Asynchronous Python)
* **ORM & Database**: SQLAlchemy (Async) + PostgreSQL (previously SQLite)
* **Luminance/Image Processing**: Pillow (PIL)
* **PDF Handling**: ReportLab & PyPDF
* **Deployment**: [Railway](https://railway.app/) (Containerized build using Docker)
* **Storage**: Railway Persistent Volume (mounted at `/app/local_vault`)

---

##  Architecture & Core Workflows

```mermaid
graph TD
    A[Frontend: Next.js] -->|1. Upload File| B(Backend: FastAPI)
    B -->|2. Encrypt & Save| C[(Persistent Volume)]
    A -->|3. Request Signed Token| B
    B -->|4. Generate JWT Token| A
    A -->|5. Redirect to Secure Viewer| D[Secure Viewer Page]
    D -->|6. Stream Decrypted Media + Apply Watermarks| B
```

### 1. Upload & Encryption Workflow
1. The administrator uploads a file via the **Upload Content** page in the dashboard.
2. The frontend sends a `multipart/form-data` request to the backend.
3. The backend receives the file, encrypts it on-the-fly using **AES-256 encryption**, and assigns it a unique UUID.
4. The encrypted file is saved to the persistent storage block directory (`/app/local_vault`).

### 2. Token Generation & Granular Access
1. To share a file securely, the owner generates an **Access Token** through the Token Generator page.
2. The user can specify:
   * **Expiration period** (e.g., 2 hours, 1 day)
   * **IP Restrictions** (restricting access to a specific IP address range)
   * **Download Permissions** (allowing/disallowing local decrypted downloading)
3. The backend signs this request into a secure, short-lived JWT token containing the file ID, permissions, and expirations.

### 3. Secure Viewing & Dynamic Watermarking
1. When a recipient opens the shared URL (e.g., `https://krypts.vercel.app/view/image?file_id=xxx&token=yyy`), the page decodes the secure JWT.
2. The browser makes an authenticated stream request to the backend to decrypt the media.
3. **Adaptive Watermarking**:
   * **Server-Side Watermarks (Baked-in)**: The backend decrypts the media, detects background brightness, and stamps a repeating, diagonal watermark (containing recipient's email/ID, date) directly onto the image pixels or PDF canvas before streaming.
     * *Light Backgrounds*: Uses dark charcoal text (`rgb(40,40,40)`) with slightly higher opacity (18%) so it is visible against white backdrops.
     * *Dark Backgrounds*: Uses light gray text (`rgb(210,210,210)`) with lower opacity (12%).
   * **Client-Side Floating Watermarks**: The React viewer renders randomly-positioned floating text overlays on top of the document/image container, shifting every few seconds to prevent clean screen captures or camera-based leaks.

---

##  Database Persistence & Storage

To avoid losing user accounts and uploaded files whenever the container redeploys, the platform utilizes Railway's infrastructure services:

1. **PostgreSQL Database**:
   * A Railway PostgreSQL instance acts as the database.
   * Connected using the async SQLAlchemy driver via the `DATABASE_URL` variable configured as:
     `postgresql+asyncpg://postgres:password@host:port/railway`
2. **Persistent Volume**:
   * A Railway Storage Volume is mounted at `/app/local_vault` in the backend service.
   * **Permissions Workaround**: Since Railway mounts volumes as `root`, the custom `/app/entrypoint.sh` startup script runs as root to grant write permissions (`chmod 777`) to the volume folder before dropping privileges to start the Uvicorn FastAPI server.

---

## Project Directory Structure

```bash
├── backend/                  # Python FastAPI Backend
│   ├── app/
│   │   ├── models/           # SQLAlchemy DB Models (User, File, Token, Alerts)
│   │   ├── routers/          # FastAPI API Endpoints (Auth, Files, Tokens, Content)
│   │   ├── utils/            # Cryptography & Watermarking utilities
│   │   ├── config.py         # App environment variables & settings
│   │   └── main.py           # FastAPI entrypoint, middleware, and CORS configuration
│   ├── entrypoint.sh         # Shell script adjusting volume permissions on startup
│   └── Dockerfile            # Container definition for Railway deployment
│
└── src/                      # Next.js Frontend
    ├── app/
    │   ├── dashboard/        # Dashboard layout, upload forms, and management pages
    │   ├── view/             # Secure viewers for image, PDF, and video formats
    │   └── (marketing)/      # Docs, landing page, landing navbar, and pricing cards
    ├── components/
    │   ├── ui/               # Reusable UI primitives (buttons, inputs, cards)
    │   └── auth-guard.tsx    # Higher-Order Component restricting dashboard access
    └── lib/
        ├── api.ts            # Axios configuration pointing to Railway server API
        └── auth-context.tsx  # React context wrapping authorization, login, and signup
```

---

##  Running Locally

### 1. Start the Backend
Navigate to the `backend/` directory, set up your Python virtual environment, install requirements, and run the server:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
*Note: Make sure to define your `.env` variables (e.g., `DATABASE_URL` pointing to local Postgres/SQLite).*

### 2. Start the Frontend
Navigate to the root directory, install npm packages, and run the dev server:
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the landing page.
