<template>
  <div>
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1>Find Your <span class="highlight">Dream Job</span></h1>
        <p class="hero-sub">Connect with top employers. Launch your career with the JSA Portal!.</p>
        <div class="hero-actions">
          <router-link to="/register" class="btn btn-primary btn-lg">Get Started</router-link>
          <router-link to="/jobs" class="btn btn-secondary btn-lg">Browse Jobs</router-link>
        </div>
        <div class="hero-stats">
          <div><strong>500+</strong><span>Active Jobs</span></div>
          <div><strong>200+</strong><span>Companies</span></div>
          <div><strong>10K+</strong><span>Students</span></div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">How It Works</h2>
        <div class="steps">
          <div class="step">
            <div class="step-num">1</div>
            <h3>Create Account</h3>
            <p>Sign up as a student looking for jobs or an employer looking for talent.</p>
          </div>
          <div class="step">
            <div class="step-num">2</div>
            <h3>Build Your Profile</h3>
            <p>Add your skills, experience, and resume to stand out from the crowd.</p>
          </div>
          <div class="step">
            <div class="step-num">3</div>
            <h3>Apply & Connect</h3>
            <p>Browse opportunities and apply to positions that match your skills.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- For Students & Employers -->
    <section class="section alt">
      <div class="container">
        <div class="two-col">
          <div class="feature-card">
            <h3>&#127891; For Students</h3>
            <ul>
              <li>Search & filter job listings</li>
              <li>One-click applications with saved resume</li>
              <li>Track application status in real-time</li>
              <li>Build a professional profile</li>
            </ul>
            <router-link to="/register" class="btn btn-primary">Join as Student</router-link>
          </div>
          <div class="feature-card">
            <h3>&#127970; For Employers</h3>
            <ul>
              <li>Post job openings and internships</li>
              <li>Review student applications</li>
              <li>Shortlist and manage candidates</li>
              <li>Build your employer brand</li>
            </ul>
            <router-link to="/register" class="btn btn-primary">Join as Employer</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <p>&copy; 2026 Job Success Agency Portal. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.hero {
  background: linear-gradient(135deg, #312e81, #4f46e5, #7c3aed);
  color: #fff;
  padding: 5rem 0 4rem;
  text-align: center;
}
.hero h1 {
  font-size: 3rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1rem;
}
.highlight {
  background: linear-gradient(135deg, #ffffff, #9b79e6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero-sub {
  font-size: 1.125rem;
  opacity: 0.85;
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}
.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
}

/* Hero-specific button styles */
.hero .btn {
  min-width: 160px;
  padding: 0.85rem 1.5rem;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 999px;
  letter-spacing: 0.2px;
  box-shadow: 0 8px 20px rgba(16,24,40,0.06);
  transition: transform 220ms cubic-bezier(.2,.8,.2,1), box-shadow 220ms, background 220ms;
}

.hero .btn-primary {
  background: linear-gradient(90deg, var(--primary), var(--primary-2));
  color: #fff;
  border: none;
  box-shadow: 0 10px 30px rgba(79,70,229,0.12);
}
.hero .btn-primary:hover,
.hero .btn-primary:focus {
  transform: translateY(-6px);
  box-shadow: 0 20px 45px rgba(79,70,229,0.18);
}

.hero .btn-secondary {
  background: rgba(255,255,255,0.12);
  color: #fff;
  border: 1px solid rgba(255,255,255,0.16);
}
.hero .btn-secondary:hover,
.hero .btn-secondary:focus {
  background: rgba(255,255,255,0.18);
  transform: translateY(-3px);
}

/* Stack buttons vertically on small screens with spacing */
@media (max-width: 480px) {
  .hero-actions { flex-direction: column; gap: 0.75rem; }
  .hero .btn { width: 100%; min-width: 0; }
}
.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
}
.hero-stats div {
  text-align: center;
}
.hero-stats strong {
  display: block;
  font-size: 1.75rem;
  font-weight: 700;
}
.hero-stats span {
  font-size: 0.875rem;
  opacity: 0.7;
}

.section {
  padding: 4rem 0;
}
.section.alt {
  background: var(--gray-100);
}
.section-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2.5rem;
  color: var(--gray-900);
}
.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}
.step {
  text-align: center;
  padding: 1.5rem;
}
.step-num {
  width: 48px;
  height: 48px;
  background: var(--primary);
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 auto 1rem;
}
.step h3 {
  font-size: 1.125rem;
  margin-bottom: 0.5rem;
  color: var(--gray-800);
}
.step p {
  color: var(--gray-500);
  font-size: 0.9rem;
}

.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
.feature-card {
  background: #fff;
  padding: 2rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}
.feature-card h3 {
  font-size: 1.375rem;
  margin-bottom: 1rem;
  color: var(--gray-900);
}
.feature-card ul {
  list-style: none;
  margin-bottom: 1.5rem;
}
.feature-card li {
  padding: 0.375rem 0;
  color: var(--gray-600);
  font-size: 0.9rem;
}
.feature-card li::before {
  content: "✓ ";
  color: var(--success);
  font-weight: 700;
}

.footer {
  background: var(--gray-900);
  color: var(--gray-400);
  padding: 2rem 0;
  text-align: center;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .hero h1 { font-size: 2rem; }
  .steps { grid-template-columns: 1fr; }
  .two-col { grid-template-columns: 1fr; }
  .hero-actions { flex-direction: column; align-items: center; }
}
</style>