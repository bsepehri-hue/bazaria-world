import Link from 'next/link';

export default function Welcome() {
  return (
    <div className="parchment p-8">
      <h1 className="text-4xl mb-6">Welcome to ListToBid</h1>

      <Link href="/onboarding" className="btn-emerald">
        Become a Steward
      </Link>
      <Link href="/directory" className="btn-amber ml-4">
        Browse Merchants
      </Link>
      <Link href="/vault" className="btn-gold ml-4">
        View Earnings
      </Link>
    </div>
  );
}