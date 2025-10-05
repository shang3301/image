import LandingAnimation from "@/components/landinganimation";


export default function Home() {
  return (
    <div className="landing">
      <LandingAnimation />

      {/* Preloader */}
      <div className="landing-preloader">
        <div className="landing-intro-title">
          <h1>TECHNOLYMPICS</h1>
        </div>
        <div className="landing-outro-title">
          <h1>IS BACK</h1>
        </div>
      </div>

      {/* Split Overlay */}
      <div className="landing-split-overlay">
        <div className="landing-intro-title">
          <h1>TECHNOLYMPICS</h1>
        </div>
        <div className="landing-outro-title">
          <h1>IS BACK</h1>
        </div>
      </div>

      {/* Tags */}
      <div className="landing-tags-overlay">
        <div className="landing-tag landing-tag-1">
          <p>IMRPROVISE. ADAPT. OVERCOME.</p>
        </div>
        <div className="landing-tag landing-tag-2">
          <p>CODE. CREATE. INNOVATE. </p>
        </div>
        <div className="landing-tag landing-tag-3">
          <p>TECHNOLYMPICS 2025</p>
        </div>
      </div>

      {/* Main Container */}
      <div className="landing-container">
        <nav>
        </nav>

        <div className="landing-hero-img">
          <img src="/images/sidecharacter.jpg" alt="Hero" />
        </div>

        <div className="landing-card">
          <iframe width="100%" height="100%" 
          src="https://www.youtube.com/embed/q2UYrRkVIUY" 
          title="4K 100% Royalty-Free Stock Footage | Technology CPU Light Effect Zooming | No Copyright Video" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" >
          </iframe>
        </div>
          <div className="register">
            <p><a href="">Register Here !</a></p>
          </div>
      </div>

    </div>
  );
}
