export default function MarketplacePage() {
  return (
    <div className="p-8 bg-gray-50 min-h-[calc(100vh-64px)]">
      {/* Header */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-10">
        The Bazar
      </h1>

      {/* Functional Entry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {/* Storefront Rentals */}
        <a
          href="/marketplace/storefronts"
          className="bg-white rounded-xl shadow p-8 text-center hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-semibold mb-2">Storefront Rentals</h2>
          <p className="text-gray-500">
            Create your presence. Build your identity.
          </p>
        </a>

        {/* Auction Link Rentals */}
        <a
          href="/marketplace/auction-links"
          className="bg-white rounded-xl shadow p-8 text-center hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-semibold mb-2">Auction Link Rentals</h2>
          <p className="text-gray-500">
            Host your own auction window.
          </p>
        </a>

        {/* Dashboard */}
        <a
          href="/dashboard"
          className="bg-white rounded-xl shadow p-8 text-center hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-semibold mb-2">Your Dashboard</h2>
          <p className="text-gray-500">
            Activity, obligations, and your role.
          </p>
        </a>

        {/* Messaging */}
        <a
          href="/messages"
          className="bg-white rounded-xl shadow p-8 text-center hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-semibold mb-2">Messaging</h2>
          <p className="text-gray-500">
            Conversations that move things forward.
          </p>
        </a>

        {/* Vault */}
        <a
          href="/vault"
          className="bg-white rounded-xl shadow p-8 text-center hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-semibold mb-2">Vault</h2>
          <p className="text-gray-500">
            Balances, custody, and settlement.
          </p>
        </a>

        {/* Steward / Adminflow */}
        <a
          href="/admin"
          className="bg-white rounded-xl shadow p-8 text-center hover:shadow-lg transition"
        >
          <h2 className="text-2xl font-semibold mb-2">Steward Tools</h2>
          <p className="text-gray-500">
            Governance, oversight, and escalation.
          </p>
        </a>

      </div>
    </div>
  );
}