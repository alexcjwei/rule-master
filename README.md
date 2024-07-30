# RuleMaster

RuleMaster is a retrieval-augmented generation (RAG) system for answering board game questions (a rule-answering-guru, if you will).

To build RuleMaster, I learned how to create a full-stack storage, query, and retrieval system. Notably, I learned how to combine Prisma, Postgres, and pg_vector to store and query vector embeddings. I also learned how to use AWS S3 to store the rulebook PDFs.

## Tools

- [React](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [Postgres](https://www.postgresql.org/)
- [pg_vector](https://github.com/pgvector/pgvector)
- [Prisma](https://www.prisma.io/)
- [AWS S3](https://aws.amazon.com/s3/)

## Installation

Install Postgres and create a database called `rule-master`.

Install the required packages by running:
```bash
npm install
```

Run migrations with the following command:
```bash
npx prisma migrate dev
```

Message me for `.env` file.

## Usage

To start the server, run:
```bash
npm run dev
```

