import React, { useRef, useContext } from 'react';
import { motion } from 'framer-motion';
import { useFadeInOnScroll } from '../../hooks/useFadeInOnScroll';
import { CursorContext } from '../../context/CursorContext';
import { Sparkles, Award, Compass, HeartHandshake, CheckCircle2 } from 'lucide-react';
import ProjectImage from '../../components/ui/ProjectImage';

export const About = ({ aboutData, profileData }) => {
  const containerRef = useRef(null);
  const isRevealed = useFadeInOnScroll(containerRef, { threshold: 0.1 });
  const { setMagneticElement, triggerHover, triggerDefault } = useContext(CursorContext);

  const data = aboutData || profileData?.about || {};
  const paragraph = data.paragraph || `I am a self-taught multidisciplinary designer currently studying Chemical Engineering at <strong>IIT Bombay</strong>. My design process is defined by high contrast grids, modern typographic rhythm, and clean execution. From branding campaigns for college festivals to telemetry dashboards for rockets, I design functional art.<br><br>I specialize in translating complex systems into clean interfaces and visual guides. For the last 2 years, I have built design architectures for festival teams, student groups, and independent clients.`;
  const profilePhoto = data.profilePhoto || profileData?.profile?.portraitImage || "svg:avatar";
  const stats = data.stats || [
    '2+ Years Designing for Real Products',
    '50+ Shipped Creative Projects & Assets',
    '150k+ Festival Video Views Organically'
  ];

  return (
    <section
      ref={containerRef}
      id="about"
      className={`reveal-item ${isRevealed ? 'revealed' : ''} bg-white py-20 border-b border-slate-200/80`}
    >
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Creative Portrait / Blueprint Card */}
          <div className="lg:col-span-5">
            <div className="relative max-w-md mx-auto">
              {/* Background Glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/10 via-amber-500/10 to-indigo-500/10 rounded-3xl filter blur-xl opacity-80" />

              <div className="relative bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden p-6 sm:p-8">
                <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 mb-6">
                  <ProjectImage
                    src={profilePhoto}
                    alt="Shreyansh Singh"
                    category="Designer Portrait"
                    aspectClass="w-full h-full"
                  />
                </div>

                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h4 className="display-font text-lg font-bold text-slate-900">Shreyansh Singh</h4>
                    <span className="text-xs text-slate-500 font-medium">IIT Bombay · Batch of '27</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                    Self-Taught
                  </span>
                </div>

                <p className="text-xs text-slate-600 italic leading-relaxed pt-4">
                  "I believe in learning by breaking things, shipping actual work, and designing at the intersection of engineering systems and creative aesthetics."
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Story & Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="section-eyebrow">Biography & Creed</span>
              <h2 className="section-title">The Engineering × Design Matrix</h2>
            </div>

            <div
              className="text-slate-600 text-sm sm:text-base leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ __html: paragraph }}
            />

            {/* Key Accomplishments Checklist */}
            <div className="pt-4 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                Core Milestones
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700"
                  >
                    <CheckCircle2 size={16} className="text-indigo-600 shrink-0 mt-0.5" />
                    <span>{stat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
