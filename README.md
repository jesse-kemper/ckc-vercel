# Pet Hotel Log Application

The Pet Hotel Log Application is a web-based tool designed to help pet hotels manage and log information about pets staying at their facility. This application allows users to input and store data about each pet's stay, including their name, room number, and various health and care details.

## Features

- Log pet details including name, room number, and date of stay.
- Record information about pet's elimination, consumption, medication, and more.
- Perform a "Nose to Tail" check with various health indicators.
- Store data in a database for easy retrieval and management.

## Technologies Used

- **Next.js**: Frontend framework.
- **Node.js**: Backend runtime environment.
- **Express.js**: Web framework for Node.js.
- **Prisma**: ORM for database management.
- **SQLite3**: Database for storing pet logs.
- **HTML/CSS**: Frontend structure and styling.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- A PostgreSQL database (or adjust for SQLite as needed).

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/pet-hotel.git
   cd pet-hotel
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up the database:**

   Update the `.env` file with your database credentials:

   ```plaintext
   DATABASE_URL="postgresql://user:password@localhost:5432/pethotel"
   ```

   Run the following commands to set up the database:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Usage

- Fill out the form on the homepage with the pet's details.
- Submit the form to save the data to the database.
- Ensure all fields are filled out correctly to avoid errors.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the ISC License.

References:
For Prisma setup and database configuration, see:

# Create .env file
cat > .env << 'EOL'
DATABASE_URL="postgresql://user:password@localhost:5432/pethotel"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret"
EOL

# Add .env to .gitignore
echo ".env" >> .gitignore

echo "Setup complete! Please update your .env file with your actual credentials."
echo "Next steps:"
echo "1. Update .env with your database and Google OAuth credentials"
echo "2. Run 'npx prisma generate' to generate Prisma Client"
echo "3. Run 'npx prisma db push' to push the schema to your database"