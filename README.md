# Projet Transcendance : Pong Contest Website 🏓
Jouez au Pong en ligne avec vos amis et discutez en temps réel.

## 📋 Résumé

Ce projet est une application web permettant aux utilisateurs de jouer au Pong contre d'autres utilisateurs en temps réel. L'application offre également un chat intégré, une fonctionnalité d'ajout d'amis, et bien d'autres fonctionnalités pour enrichir l'expérience utilisateur.

---

## 💻 Technologies Utilisées

### Frontend
- 📘 React.js
- 🛣️ React Router
- 🌀 Vite
- 🔍 Redux
- 🔧 TypeScript
- 💨 TailwindCSS
- 🎨 Styled-components
- 🌈 Material-UI (MUI)

### Backend
- 🐦 NestJS
- 🗃 TypeORM
- 🔐 JWT
- 🔒 Bcrypt
- 🔏 Chiffrement RSA
- 📂 Multer
- 🖼️ Serveur statique

### Containerisation et DB
- 🐳 Docker, Docker-compose
- 🗄️ PostgreSQL
- 🖥️ pgAdmin


## 📦 Installation

```bash
  cd ~
  git clone https://github.com/Jeanmichel7/42_transcendence.git
  cd 42_transcendance && make
```
Pour le développement, les volumes front et back sont reliés a l'host.  `FRONT_VOLUME` est défini comme `${HOME}/42_transcendence/front`.

## 🛠️ Utilisation
Application disponible sur <nom d'hôte>:3006 et localhost:3006.


## 📜 Règles du Projet
- Backend écrit en NestJS
- Frontend utilisant un framework TypeScript de votre choix
- Utilisation obligatoire de la base de données PostgreSQL
- Application Single Page
- Compatible avec la dernière version stable de Google Chrome et un autre navigateur de votre choix
- Aucune erreur ou avertissement ne doit être rencontré lors de la navigation sur le site
- Tout doit être lancé par une seule commande : \```docker-compose up --build\```


## 💡 Fonctionnalites

- **Jeu Pong en temps réel avec mode bonus**  
- **Disponibilité LAN**  
- **Chat intégré**:    
  Créez des salons de discussion, envoyez des messages directs et invitez des amis à jouer.
- **Amis**:    
  Établissez des relations authentiques avec un système complet de requêtes d'amis, d'attentes et d'options pour bloquer des utilisateurs, 
- **Notifications**:    
   Recevez des notifications en temps réel pour les événements importants.
- **Connexion**:      
    Authentification simplifiée via OAuth2.0 ou utilisez un compte standard.
- **2FA avec RSA**:      
    Sécurisez votre compte avec une authentification TOTP (secret 2FA chiffré en RSA).
- **Local Storage**:    
    Les préférences de l'utilisateur et certaines données sont sauvegardées localement pour une meilleure expérience utilisateur.
- **Leaderboard**:    
    Affichez les classements des meilleurs joueurs et voyez où vous vous situez par rapport aux autres.
- **Graphiques de performance**:    
    Analysez vos performances et progrès avec des graphiques détaillés.

      
## Gallerie
<table>
  <tr>
    <td>
      <img src="https://github.com/Jeanmichel7/42_transcendence/blob/imageReadme/imageReadme/login.png?raw=true" alt="Alt text for image 1"/>
    </td>
    <td>
     <img src="https://github.com/Jeanmichel7/42_transcendence/blob/imageReadme/imageReadme/account.png?raw=true" alt="Alt text for image 1"/>
    </td>
    <td>
      <img src="https://github.com/Jeanmichel7/42_transcendence/blob/imageReadme/imageReadme/profile1.png?raw=true" alt="Alt text for image 1"/>
    </td>
     <td>
      <img src="https://github.com/Jeanmichel7/42_transcendence/blob/imageReadme/imageReadme/profile2.png?raw=true" alt="Alt text for image 1"/>
    </td>
  </tr>

  <tr>
    <td>
      <img src="https://github.com/Jeanmichel7/42_transcendence/blob/imageReadme/imageReadme/lobbygame.png?raw=true" alt="Alt text for image 1"/>
    </td>
    <td>
      <img src="https://github.com/Jeanmichel7/42_transcendence/blob/imageReadme/imageReadme/game.png?raw=true" alt="Alt text for image 1"/>
    </td>
    <td>
     <img src="https://github.com/Jeanmichel7/42_transcendence/blob/imageReadme/imageReadme/gamebonus.png?raw=true" alt="Alt text for image 1"/>
    </td>
    <td>
      <img src="https://github.com/Jeanmichel7/42_transcendence/blob/imageReadme/imageReadme/leaderboard.png?raw=true" alt="Alt text for image 1"/>
    </td>
  </tr>

  <tr>
    <td>
      <img src="https://github.com/Jeanmichel7/42_transcendence/blob/imageReadme/imageReadme/channel.png?raw=true" alt="Alt text for image 1"/>
    </td>
    <td>
      <img src="https://github.com/Jeanmichel7/42_transcendence/blob/imageReadme/imageReadme/channelAdmin.png?raw=true" alt="Alt text for image 1"/>
    </td>
    <td>
     <img src="https://github.com/Jeanmichel7/42_transcendence/blob/imageReadme/imageReadme/messagerie.png?raw=true" alt="Alt text for image 1"/>
    </td>
    <td>
      <img src="https://github.com/Jeanmichel7/42_transcendence/blob/imageReadme/imageReadme/searchFriends.png?raw=true" alt="Alt text for image 1"/>
    </td>
  </tr>
</table>

## 🤝 Contributeurs

<table>
  <tr>
    <td align="center"><a href="https://github.com/Jeanmichel7"><img src="https://github.com/Jeanmichel7.png?size=100" width="100px;" alt=""/><br /><sub><b>Jeanmichel7</b></sub></a><br /></td>
    <td align="center"><a href="https://github.com/YannUFLL"><img src="https://github.com/YannUFLL.png?size=100" width="100px;" alt=""/><br /><sub><b>YannUFLL</b></sub></a><br /></td>
    <td align="center"><a href="https://github.com/Wilhelm-Fermey"><img src="https://github.com/Wilhelm-Fermey.png?size=100" width="100px;" alt=""/><br /><sub><b>Wilhelm-Fermey</b></sub></a><br /></td>

  </tr>
</table>

### 📜 Licence

Sous licence MIT.
