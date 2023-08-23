import React from 'react';

function About() {
  return (
    <div className="bg-gray-100 h-full flex items-center justify-center p-8">
      <div className="bg-white shadow-xl rounded-lg p-8 w-full md:w-3/4 lg:w-1/2">
        <h1 className="text-2xl font-bold mb-4">
          ft_transcendence: Pong Contest Website 🏓
        </h1>
        <p className="mb-6">
          Jouez au Pong en ligne avec vos amis et discutez en temps réel.
        </p>

        <h2 className="text-xl font-semibold mb-3">🚀 Démarrage Rapide</h2>
        <p className="mb-6">
          Pour démarrer l'application, utilisez soit{' '}
          <code className="bg-gray-200 px-1 rounded">make</code> soit{' '}
          <code className="bg-gray-200 px-1 rounded">docker-compose up</code>.
        </p>

        <h2 className="text-xl font-semibold mb-3">
          💡 Caractéristiques Principales
        </h2>
        <ul className="mb-6 list-disc pl-5">
          {[
            'Jeu Pong en temps réel',
            'Chat intégré',
            "Système d'amis",
            'Notifications en temps réel',
            'Connexion simplifiée et 2FA avec RSA',
            'Disponibilité LAN et Local Storage',
            'Leaderboard et graphiques de performance',
          ].map(feature => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mb-3">
          🛠️ Technologies Utilisées
        </h2>
        <ul className="mb-6 list-disc pl-5">
          {[
            'Docker & Docker-compose: Pour le déploiement',
            'Frontend: React.js, React Router, Vite, Redux, TypeScript, TailwindCSS, Styled-components, Material-UI (MUI)',
            'Backend: NestJS, TypeORM, JWT, Bcrypt, RSA, Multer, Serveur statique',
            'Base de Données: PostgreSQL, pgAdmin',
          ].map(tech => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mb-3">👥 Contributeurs</h2>
        <ul className="mb-6 list-disc pl-5">
          {['Jean-Michel', 'YannUFLL', 'Wilhelm Fermey'].map(contributor => (
            <li key={contributor}>{contributor}</li>
          ))}
        </ul>

        <h2 className="text-xl font-semibold mb-3">📜 Licence</h2>
        <p>
          Sous licence{' '}
          <a href="#" className="text-blue-500 underline">
            MIT
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default About;
