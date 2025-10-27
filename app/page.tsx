import LandingAnimation from "@/components/landinganimation";


export default function Home() {
  return (
    <div className="landing">
      <LandingAnimation />

      {/* Preloader */}
      <div className="landing-preloader">
        <div className="landing-intro-title">
          <h1>IMAGE</h1>
        </div>
        <div className="landing-outro-title">
          <h1>IS BACK</h1>
        </div>
      </div>

      {/* Split Overlay */}
      <div className="landing-split-overlay">
        <div className="landing-intro-title">
          <h1>IMAGE</h1>
        </div>
        <div className="landing-outro-title">
          <h1>IS BACK</h1>
        </div>
      </div>

      {/* Tags */}
      <div className="landing-tags-overlay">
        <div className="landing-tag landing-tag-1">
          <p>Vasudhaiva Kutumbakam</p>
        </div>
        <div className="landing-tag landing-tag-2">
          <p>A Festival of Interschool Competitions</p>
        </div>
        <div className="landing-tag landing-tag-3">
          <p>Novermber 19 & 20, 2025</p>
        </div>
      </div>

      {/* Main Container */}
      <div className="landing-container">
        <nav>
        </nav>

        <div className="landing-hero-img">
          <img src="images/2.jpg" alt="background" />
        </div>

        <div className="landing-card">
          <h1>Image 2025</h1>
          <br />
          <br />
          <br />
          <p>Back with 25 Events</p>
          <div className="event-lists">
            <ul className="event-list">
              <li>Symphony</li>
              <li>Nrityanjali</li>
              <li>Sur Sangam</li>
              <li>Kitchen Geniuses</li>
              <li>TED Talk</li>
              <li>बातों–बातों में</li>
              <li>Poetic Fantasy</li>
              <li>Sanskrit Shloka</li>
              <li>Chitrashala</li>
              <li>Aesthetic Moves</li>
              <li>GameCraft</li>
              <li>Webolution</li>
              <li>CrypteX</li>
            </ul>
            <ul className="event-list">
              <li>ChemCraft 3D</li>
              <li>Vista View</li>
              <li>Pulse Within</li>
              <li>Nukkad Natak</li>
              <li>Rube It Up!</li>
              <li>EcoInnovators</li>
              <li>Reel Harmony</li>
              <li>GameSpark</li>
              <li>Top Coders</li>
              <li>IQrypt</li>
              <li>Bid Blitz</li>
              <li>Think Tank</li>
            </ul>
          </div>
            <p className="events-a"><a href="events/">Check The Events Here!</a></p>
        </div>
          <div className="register">
            <p><a href="https://forms.gle/8FJTZ359txi17roy6">Register Here !</a></p>
          </div>
      </div>

    </div>
  );
}
