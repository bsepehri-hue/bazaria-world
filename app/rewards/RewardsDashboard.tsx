"use client";

export default function RewardsDashboard() {
  return (
    <div className="w-full h-auto p-6">

      {/* Storefronts */}
      <section className="storefronts">
        <h2>Storefronts</h2>
        <div className="storefront-grid">
          <div className="storefront-card"><h3>Emily's Crafts</h3><p>Emily Peters</p></div>
          <div className="storefront-card"><h3>Jumper's Outfits</h3><p>Oscar Salgado</p></div>
          <div className="storefront-card"><h3>Ultimate Pens</h3><p>Sophia Chen</p></div>
        </div>
      </section>

      {/* Auctions */}
      <section className="auctions">
        <h2>Auctions</h2>
        <div className="auction-grid">
          <div className="auction-card"><h3>Nintendo Switch</h3><p>Highest bid: $734</p><span className="status ends-soon">Ends soon</span></div>
          <div className="auction-card"><h3>Jordan 4 Retro Black Cat</h3><p>Highest bid: $510</p><span className="status live">Live</span></div>
          <div className="auction-card"><h3>Adidas Yeezy Slide</h3><p>Highest bid: $90</p><span className="status live">Live</span></div>
        </div>
      </section>

      {/* Payable */}
      <section className="payable">
        <h2>Payable</h2>
        <div className="payable-summary">
          <div className="summary-box">Pending: <span>$263.00</span></div>
          <div className="summary-box">Paid: <span>$540.00</span></div>
          <div className="summary-box">Withdrawn: <span>$300.00</span></div>
          <div className="summary-box">Available: <span>$240.00</span></div>
        </div>
        <button className="wallet-btn">Connect to Get Paid</button>
        <div className="transaction-history">
          <h3>Transaction History</h3>
          <ul>
            <li>Apr earnings payout — 04/14/2023 — $163.00</li>
            <li>Jordan 4 Retro Black Cat — 04/12/2023 — $100.00</li>
          </ul>
        </div>
      </section>

      {/* Steward Profile */}
      <section className="card">
        <h2>Steward Profile</h2>
        <div className="profile-info">
          <img src="/profile-placeholder.png" alt="Profile Photo" className="profile-photo" />
          <div>
            <h3>Bo Sepehri</h3>
            <p>Trusted Steward</p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-box">Credits Earned: <span>12</span></div>
          <div className="stat-box">Active Listings: <span>5</span></div>
          <div className="stat-box">Referral Strikes: <span>2</span></div>
        </div>

        <div className="profile-badges">
          <span className="badge emerald">Referral Constellation: Active</span>
          <span className="badge amber">Unlocked: Orion (Milestone 5)</span>
        </div>
      </section>

      {/* Blessing Grid */}
      <section className="card">
        <h2>Blessing Grid</h2>
        <div className="blessing-grid">
          <div className="grid-cell">Echo: $242</div>
          <div className="grid-cell">Rippled</div>
          <div className="grid-cell warning">2 Strikes</div>
        </div>
      </section>

      {/* Active Auction */}
      <section className="card">
        <h2>Active Auction</h2>
        <p><strong>Item:</strong> Vintage Ring — Orion</p>
        <form>
          <label>Place Bid ($)
            <input type="number" name="bid" min="1" step="1" />
          </label>
          <button className="btn primary" type="submit">Submit Bid</button>
        </form>
      </section>

      {/* Create Listing */}
      <section className="card">
        <h2>Create a New Listing</h2>
        <form id="create-listing-form">
          <input type="text" placeholder="Listing Title" required />
          <textarea placeholder="Description" required></textarea>
          <input type="text" placeholder="Category" required />
          <input type="number" placeholder="Starting Bid ($)" required />
          <select>
            <option value="">Select Shipping Type</option>
            <option value="local">Local Pickup</option>
            <option value="standard">Standard Shipping</option>
          </select>
          <input type="file" accept="image/*" id="profileUpload" />
          <button type="submit" className="btn primary">Publish Listing</button>
        </form>
      </section>

      {/* Activity Log */}
      <section className="card">
        <h2>Activity Log</h2>
        <div id="activity-feed"><p>No recent activity</p></div>
      </section>

      {/* Steward Summary */}
      <section className="card">
        <h2>Steward Summary</h2>
        <div className="profile-stats">
          <div className="stat-box">Credits Earned: <span>12</span></div>
          <div className="stat-box">Active Listings: <span>5</span></div>
          <div className="stat-box">Referral Strikes: <span>2</span></div>
        </div>
      </section>

      {/* Arca */}
      <section className="card">
        <h2>Arca</h2>
        <div className="arca-grid">
          {/* Arca tiles will be Reactified later */}
        </div>
      </section>

    </div>
  );
}
