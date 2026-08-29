# Transit — AIoT & LLM Research Assistant

A Retrieval-Augmented Generation (RAG) research assistant that answers questions strictly grounded in a published academic paper — *"A Systematic Review of AIoT and Large Language Model Applications in Smart Urban Transport"* (ITNAF National Conference, ISC-indexed, 2024).

Unlike a general-purpose chatbot, Transit only answers using retrieved passages from the source paper, reducing hallucination and providing full source transparency for every response.

## How it works

```
User question
     │
     ▼
Tokenize + remove stopwords
     │
     ▼
TF-IDF vectorization (client-side, no external embedding API)
     │
     ▼
Cosine similarity ranking against 14 paper chunks
     │
     ▼
Top-4 most relevant passages retrieved
     │
     ▼
Passages + question sent to Claude with a strict "answer only from this context" instruction
     │
     ▼
Grounded answer + visible source citations
```

## Features

- **Client-side semantic retrieval** — TF-IDF + cosine similarity implemented from scratch in plain JavaScript, no external embedding service required
- **Transparent citations** — every answer is accompanied by the exact source passages and their relevance scores
- **Animated pipeline visualization** — shows the query → retrieve → reason → answer flow in real time
- **Secure backend** — a serverless Node.js function proxies LLM calls so the API key is never exposed client-side

## Tech stack

`JavaScript` `HTML/CSS` `Claude API (Anthropic)` `Node.js (Vercel Serverless Functions)`

## Project structure

```
├── api/ask.js        # Secure backend — proxies requests to the Anthropic API
├── public/index.html # Frontend — retrieval logic, UI, chat interface
└── vercel.json        # Deployment configuration
```

## Running locally / deploying

This project requires an Anthropic API key to generate answers (retrieval works entirely offline). See the deployment guide for step-by-step instructions on getting an API key and deploying for free on Vercel.

```bash
npm install -g vercel
vercel dev
```

## Why I built this

This project is a practical implementation of concepts I explored in my published research on integrating Large Language Models with AIoT-based transport systems — specifically the role of retrieval-based grounding in reducing hallucination for safety-relevant applications, as discussed in the paper's LLM Integration Layer section.
