import React from "react";
import "../styles/Landing.css";

function Landing() {
  return (
    <main className="landing">
      <section className="hero">
        <h1>
          every hero needs a <br />
          <span className="highlight">sidekick.</span>
        </h1>

        <div className="robynn-graphic">
          <span className="robynn-text">Robyyn</span>
        </div>

        <p className="subtitle">
          batman had robin. <span>now, job seekers have  robyyn.</span>
        </p>
     </section>
    </main>
  );
}

export default Landing;