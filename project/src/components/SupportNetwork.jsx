import React from 'react';
import { Navigate } from 'react-router-dom';
import NavBar from './NavBar';
import '../styles/SupportNetwork.css';

function SupportNetwork({ isAuthenticated, onLogout }) {
  if (!isAuthenticated) {
    console.log("SupportNetwork: User not authenticated, redirecting to login.");
    return <Navigate to="/login" replace />;
  }
  const supportResources = [
    {
      category: "Professional Support",
      resources: [
        {
          name: "Licensed Therapists",
          description: "Find qualified mental health professionals through:",
          links: [
            { text: "Psychology Today Directory", url: "https://psychologyindia.com/" },
            { text: "BetterHelp", url: "https://www.betterhelp.com" },
            { text: "Talkspace", url: "https://www.talkspace.com" }
          ],
          icon: "👨‍⚕️"
        },
        {
          name: "Support Groups",
          description: "Join local and online support groups:",
          links: [
            { text: "NAMI Support Groups", url: "https://namiindia.in/" },
            { text: "7 Cups", url: "https://www.7cups.com" },
            { text: "Mental Health India", url: "https://www.nimhans.ac.in/" }
          ],
          icon: "👥"
        }
      ]
    },
    {
      category: "Crisis Support",
      resources: [
        {
          name: "24/7 Crisis Lines",
          description: "Immediate support when you need it most:",
          links: [
            { text: "Suicide & Crisis Lifeline", url: "https://findahelpline.com/countries/in/topics/suicidal-thoughts" },
            { text: "Crisis Helpline Numbers", url: "https://findahelpline.com/countries/in/topics/depression" }
          ],
          icon: "🆘"
        },
        {
          name: "Emergency Services",
          description: "For immediate medical attention:",
          links: [
            { text: "Call 112 for emergencies", url: null },
            { text: "Emergency Response Support System (ERSS)", url: "https://112.gov.in/" }
          ],
          icon: "🚑"
        }
      ]
    },
    {
      category: "Online Communities",
      resources: [
        {
          name: "Mental Health Forums",
          description: "Connect with others who understand:",
          links: [
            { text: "Mental Health Forum", url: "https://www.mentalhealthforum.net" },
            { text: "Reddit r/MentalHealth", url: "https://www.reddit.com/r/mentalhealth/" },
            { text: "Anxiety and Depression Association", url: "https://adaa.org/find-help/support" }
          ],
          icon: "💻"
        },
        {
          name: "Peer Support",
          description: "Connect with trained peer supporters:",
          links: [
            { text: "Peers for Progress", url: "https://ishanyaindia.org/psg/" },
            { text: "Mental Health Peer Support", url: "https://iphpune.org/service/support-groups/?utm_source=chatgpt.com" }
          ],
          icon: "🤝"
        }
      ]
    },
    {
      category: "Self-Help Resources",
      resources: [
        {
          name: "Mental Health Apps",
          description: "Tools for managing mental health:",
          links: [
            { text: "Calm", url: "https://www.calm.com" },
            { text: "Headspace", url: "https://www.headspace.com" },
            { text: "Insight Timer", url: "https://insighttimer.com" }
          ],
          icon: "📱"
        },
        {
          name: "Educational Resources",
          description: "Learn about mental health:",
          links: [
            { text: "NIMH", url: "https://www.nimh.nih.gov/health" },
            { text: "Mental Health First Aid", url: "https://www.mentalhealthfirstaid.org" }
          ],
          icon: "📚"
        }
      ]
    }
  ];

  return (
    <div className="container">
      <NavBar isAuthenticated={isAuthenticated} onLogout={onLogout} />
      <div className="support-network-container">
        <h1>Support Network Resources</h1>
        <p className="support-intro">
          Access a comprehensive network of mental health support resources. Remember, seeking help is a sign of strength.
        </p>
        
        <div className="support-categories">
          {supportResources.map((category, index) => (
            <div key={index} className="category-section">
              <h2>{category.category}</h2>
              <div className="resources-grid">
                {category.resources.map((resource, resourceIndex) => (
                  <div key={resourceIndex} className="resource-card">
                    <div className="resource-header">
                      <span className="resource-icon">{resource.icon}</span>
                      <h3>{resource.name}</h3>
                    </div>
                    <p>{resource.description}</p>
                    <ul className="resource-links">
                      {resource.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          {link.url ? (
                            <a href={link.url} target="_blank" rel="noopener noreferrer">
                              {link.text}
                            </a>
                          ) : (
                            <span>{link.text}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="emergency-notice">
          <h3>🚨 In Case of Emergency</h3>
          <p>
            If you or someone you know is in immediate danger, call your local emergency services immediately.
            In India, dial 112 for emergencies or visit the nearest hospital.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SupportNetwork;