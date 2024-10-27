import { getServerSession } from 'next-auth/next'
import { authOptions } from './api/auth/[...nextauth]/route'
import PetLogForm from './components/PetLogForm'
import SignInButton from './components/SignInButton'

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      {session ? (
        <PetLogForm />
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4 p-8">
          <h1 className="text-2xl font-bold text-gray-800">Pet Hotel Log System</h1>
          <p className="text-gray-600 mb-4">Please sign in to access the pet hotel log system.</p>
          <SignInButton />
        </div>
      )}
    </main>
  )
}