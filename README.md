
# 🌸 Mangai – Women Safety Web Application (Problem Statement 2)

Mangai is a full-stack women safety platform developed using **Lovable.ai**, a powerful AI-based web development tool. It enables users to manage emergency contacts, send instant SOS alerts, and get safety tips and emotional support through an AI chatbot.

🔗 **Live Project URL:** [Mangai Web App](https://lovable.dev/projects/9cd9db97-ca3e-444e-9e9d-bef37b251462)

---

## 🧱 Tech Stack

| Technology       | Purpose                                             | Key Benefits                                             |
|-----------------|----------------------------------------------------|---------------------------------------------------------|
| **Lovable.ai**   | AI-powered code generation and deployment         | Fast prototyping, collaborative editing, auto-deployment|
| **React.js**     | Frontend library                                   | Component-based UI, interactive interfaces             |
| **Vite**         | React build tool                                   | Lightning-fast dev server, optimized performance       |
| **TypeScript**   | Typed JavaScript                                   | Fewer bugs, maintainable code                           |
| **Tailwind CSS** | Utility-first CSS framework                        | Responsive design, clean layout, soft blue calming theme|
| **shadcn-ui**    | UI components                                     | Accessible, prebuilt, polished UI elements             |
| **Node.js + Express.js** | Backend server framework                      | Handles API requests, scalable, fast                    |
| **Supabase (PostgreSQL)** | Database and Auth service                     | Secure login, role-based access, data storage          |
| **Twilio API**   | Sending SMS alerts                                 | Real-time emergency messaging to contacts              |
| **Socket.io**    | Real-time notifications                             | Instant alert updates                                   |
| **OpenAI GPT + RAG** | AI chatbot with context-aware responses         | Safety tips, emotional support, interactive assistance |

---

## 🧩 Core Features

- 🔐 **Authentication** (Signup/Login) using Supabase Auth  
- 📇 **Emergency Contacts** – Add up to 10 trusted contacts  
- 🚨 **SOS Alert System** – Sends messages to all contacts via Twilio API  
- 💬 **Mangai Buddy Chatbot** – AI assistant providing safety tips and support  
- 👤 **Profile Management** – Change email, password, or upload profile picture  
- 🧭 **User Dashboard** – View profile, contacts, and SOS alerts  
- 📊 **Admin Panel** – Manage users and monitor alerts  
- 🧠 **RAG AI Chatbot** – Context-aware responses using vector database  

---

## ⚙️ Folder Structure

```

/backend
├── server.js
├── routes/
└── supabaseClient.js

/frontend
├── src/
├── components/
├── pages/
└── App.js

.env.example
README.md

````

---

## 🛠️ Setup Instructions (Local Development)

```bash
# 1️⃣ Clone the repository
git clone <YOUR_GITHUB_REPO_URL>

# 2️⃣ Navigate to the project directory
cd mangai

# 3️⃣ Install dependencies
npm install

# 4️⃣ Start the development server
npm run dev
````

---

## 🔗 Environment Variables

Create a `.env` file in the root and add the following:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
OPENAI_API_KEY=your_openai_api_key
PORT=5000
```

---

## 🚀 Deployment

Mangai can be deployed directly via **Lovable.ai**:

* Open the project in [Lovable.ai](https://lovable.dev/projects/9cd9db97-ca3e-444e-9e9d-bef37b251462)
* Click **Share → Publish** to deploy live

---

## 🌈 Summary

Mangai combines **technology, AI, and design** to create a calm, safe, and responsive women safety platform. The soft blue theme, emergency alerts, and AI-powered chatbot make it an interactive and empowering tool for users.



If you want, I can also **create a shorter, GitHub “project showcase” version** with badges, features checklist, and quick links that looks very professional for hackathons.  

Do you want me to make that version too?
```
