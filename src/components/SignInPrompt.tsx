import { Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';

interface SignInPromptProps {
  message: string;
}

export default function SignInPrompt({ message }: SignInPromptProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-3xl bg-primary-50 px-6 py-8 text-center">
      <span className="rounded-full bg-primary-800 p-3 text-accent-500">
        <LogIn className="h-5 w-5" />
      </span>
      <p className="text-sm font-semibold text-primary-800">{message}</p>
      <Link to="/cont" className="btn-primary">
        Intră în cont sau creează unul
      </Link>
    </div>
  );
}
