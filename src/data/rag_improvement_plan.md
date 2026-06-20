# RAG (Retrieval-Augmented Generation) Improvement Plan for PrimeVita AI

## Current Implementation Analysis
The current implementation injects the entire `knowledge_base.md` content into the system instruction for every chat request.

### Issues
- **Context/Token Limits:** As the knowledge base expands, incorporating the entire document will exceed the model's context window, leading to truncation or degradation in the quality of responses.
- **Efficiency:** The model processes irrelevant information for every query, increasing latency and cost.
- **Grounding Limitations:** Without RAG, the model relies on its static understanding of the provided text, which may not be optimal for specific technical or nuanced questions compared to semantic search-based retrieval.

## Proposed RAG Architecture
To improve grounding and context retrieval, we should migrate to an embedding-based Retrieval-Augmented Generation (RAG) system.

### Migration Steps
1.  **Preprocessing & Chunking:**
    - Break `knowledge_base.md` into smaller, logically sound chunks (e.g., by service, FAQ section).
2.  **Vector Embedding Generation:**
    - Use Gemini's embedding API (e.g., `text-embedding-004`) to generate vector representations for each chunk.
3.  **Vector Store Integration:**
    - Store chunks and their embeddings in a vector-capable database (e.g., Firestore with vector search capabilities).
4.  **Runtime Retrieval:**
    - When a user submits a query:
        - Generate an embedding for the user's query.
        - Query the vector store for the top *N* similar chunks.
        - Construct a dynamic system prompt containing *only* these relevant chunks as context.
    - Submit the refined request to the Gemini model.

## Benefits
- **Scalability:** The knowledge base can grow indefinitely without hitting token limits.
- **Accuracy:** The model only receives highly relevant context, improving grounding and reducing hallucinations.
- **Performance:** Reduced processing of unnecessary tokens leads to faster response times.
