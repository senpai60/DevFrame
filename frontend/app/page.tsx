import Navbar from "../src/components/navbar/Navbar";

export default function Home() {
  return (
    <div className="hero-container">
      <div className="hero-overlay" />
      <div className="hero-content">
        <Navbar />

        <main className="main-content">
          <section className="hero">
            <h1 className="hero__title">
              Your private equity<br />
              broker, secure in every<br />
              transaction made.
            </h1>
            
            <a className="hero__learn-more" href="#services">
              Learn more about our services <span aria-hidden="true">&rarr;</span>
            </a>
          </section>
        </main>
        
        <footer className="hero__footer">
          <div className="hero__footer-left">
            <a href="#scroll" className="hero__scroll">
              Scroll to learn more &darr;
            </a>
          </div>
          <div className="hero__footer-middle">
            <p className="hero__footer-text">
              Unlisted shares are not traded on a<br/>
              stock exchange, which makes the<br/>
              work that we do even more important.
            </p>
          </div>
          <div className="hero__footer-right">
            <span className="hero__pill">Secondary Market Stocks</span>
            <div className="hero__pill-group">
              <span className="hero__icon-pill">&nearrow;</span>
              <span className="hero__pill">Raising Capital</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
