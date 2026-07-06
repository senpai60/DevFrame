import Navbar from "../src/components/navbar/Navbar";

export default function Home() {
  return (
    <div className="hero-container">
      <div className="hero-content">
        <Navbar />

        <main className="main-content">
          <div className="hero-split">
            <section className="hero-left">
              <h1 className="hero__title">
                Show your code.<br />
                Build your network.<br />
                <span className="text-gradient">Grow together.</span>
              </h1>
              
              <p className="hero__subtitle">
                Auto-fetch your GitHub projects.<br />
                Share, connect, collaborate.<br />
                The developer social platform.
              </p>

              <div className="hero__actions">
                <a className="btn btn-primary" href="#start">
                  Start Building <span aria-hidden="true">&nearrow;</span>
                </a>
                <a className="btn btn-secondary" href="#explore">
                  Explore Projects
                </a>
              </div>

              <div className="hero__features">
                <div className="feature">
                  <div className="feature-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
                  </div>
                  <div className="feature-text">
                    <strong>Auto-fetch</strong>
                    <span>GitHub integration</span>
                  </div>
                </div>
                
                <div className="feature">
                  <div className="feature-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <div className="feature-text">
                    <strong>Share & Connect</strong>
                    <span>Like, comment, follow</span>
                  </div>
                </div>

                <div className="feature">
                  <div className="feature-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <div className="feature-text">
                    <strong>Find Collaborators</strong>
                    <span>Build amazing projects</span>
                  </div>
                </div>
              </div>
            </section>
            
            <section className="hero-right">
              <div className="hero-graphic">
                <div className="code-window">
                  <div className="code-header">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <pre className="code-content">
                    <code>
                      <span className="keyword">import</span> {'{'} <span className="variable">DevFrame</span> {'}'} <span className="keyword">from</span> <span className="string">'@devframe/core'</span>;
                      <br/><br/>
                      <span className="keyword">const</span> <span className="function">DeveloperProfile</span> = () =&gt; {'{'}
                      <br/>
                      &nbsp;&nbsp;<span className="keyword">const</span> {'{'} repos, network {'}'} = <span className="function">useGitHub</span>();
                      <br/><br/>
                      &nbsp;&nbsp;<span className="keyword">return</span> (
                      <br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="tag">DevFrame.Card</span>&gt;
                      <br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="tag">Projects</span> data={'{repos}'} /&gt;
                      <br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="tag">Connections</span> count={'{network.size}'} /&gt;
                      <br/>
                      &nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="tag">DevFrame.Card</span>&gt;
                      <br/>
                      &nbsp;&nbsp;);
                      <br/>
                      {'}'};
                    </code>
                  </pre>
                </div>
                <div className="glow"></div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
