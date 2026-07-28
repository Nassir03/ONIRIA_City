export default function FinalSalesCTA() {
  return (
    <section className="finalSalesSection">
      <div
        className="finalSalesBackground"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519046904884-53103b34b206?q=85&w=2000&auto=format&fit=crop')",
        }}
      >
        <div className="finalSalesOverlay" />

        <div className="finalSalesContent">
          <p className="finalSalesLabel">YOUR PLACE IN ZANZIBAR</p>

          <h2>Begin your ONIRIA journey</h2>

          <p className="finalSalesDescription">
            Discover a new opportunity to live, invest and belong in a
            thoughtfully designed community in Fumba, Zanzibar.
          </p>

          <div className="finalSalesActions">
            <a href="/inquiries" className="finalSalesPrimaryButton">
              Make an inquiry
            </a>

            <a href="/contact" className="finalSalesSecondaryButton">
              Contact our team
            </a>
          </div>

          <div className="finalSalesInformation">
            <div>
              <span>Location</span>
              <strong>Fumba, Zanzibar</strong>
            </div>

            <div>
              <span>Collections</span>
              <strong>Villas, Residences & V Avenue</strong>
            </div>

            <div>
              <span>Availability</span>
              <strong>Register your interest</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}