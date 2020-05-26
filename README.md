<p align="center"><a href="https://calendz.app/" target="_blank" rel="noopener noreferrer"><img width="100" src="https://avatars3.githubusercontent.com/u/51510476?s=400&u=e110cf083bbc29eab84d4dceb85c94d7a87882db&v=4" alt="calendz's logo"></a></p>

<p align="center">
  <a href="https://travis-ci.com/calendz/calendz-api-calendar"><img src="https://travis-ci.com/calendz/calendz-api-calendar.svg?branch=develop" alt="Build status of develop branch"></a>
  <a href='https://coveralls.io/github/calendz/calendz-api-calendar?branch=develop'><img src='https://coveralls.io/repos/github/calendz/calendz-api-calendar/badge.svg?branch=develop' alt='Coverage Status' /></a>
  <a href="https://www.codacy.com/app/calendz/api-calendar?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=calendz/calendz-api-calendar&amp;utm_campaign=Badge_Grade"><img src="https://api.codacy.com/project/badge/Grade/fe1399e3ba8e46b9bdefd046a240d7c1"/></a>
  <br>
  <a href="https://dependabot.com/"><img src="https://api.dependabot.com/badges/status?host=github&amp;repo=calendz/calendz-api-calendar" alt="Dependabot status"></a>
  <a href="https://dependabot.com/"><img src="https://img.shields.io/david/calendz/calendz-api-calendar.svg?maxAge=3600" alt="Dependencies status"></a>
  <br>
</p>

<h2 align="center">CALENDZ API-CALENDAR</h2>

---

## Introduction

Ce repository représente l'API nous permettant de récupérer les cours de notre emploi du temps. Elle est particulière de par le fait qu'elle n'interroge aucune base de données, mais se content de "scrapper" une page web, et de renvoyer les données demandées sous forme de JSON. N'ayant aucun accès à la base de données contenant nos emploi du temps, nous n'avons trouvé aucune meilleur solution que celui-ci.

De plus, cette API a pour but d'être publique, afin de permettre à n'importe quel élève de notre campus de créer sa propre application requierant l'accès aux données de notre emploi du temps (ex: si quelqu'un souhaite développer une application mobile...)

## Ecosystème

L'API de calendz est développée avec les frameworks et outils suivants* :

| Librairie        | Version    | Description                                                                                      |
| ---------------- | ---------- | ------------------------------------------------------------------------------------------------ |
| [Node.js]        | 12.16.0    | Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.                         |
| [Adonis.js]      | 4.1        | The Node.js Framework highly focused on developer ergonomics, stability and confidence.          |
| [Cheerio]        | 1.0.0-rc.3 | Fast, flexible, and lean implementation of core jQuery designed specifically for the server.     |

**(Liste non exhaustive, uniquement les librairies principales sont présentées)*

## Installation & utilisation

### Pré-requis

* Installer Node 12.16.0
* Créer un fichier `.env` à la source de ce repository contenant les valeurs suivantes (modifiables selon vos besoins)

      NODE_ENV=development

      HOST=0.0.0.0
      PORT=3333

      APP_NAME=calendz-api-calendar
      APP_URL=http://${HOST}:${PORT}
      # Please generate a new key: 
      # > $ adonis key:generate
      APP_KEY=

      REDIS_HOST=calendz-redis
      REDIS_PORT=6379
      REDIS_PASSWORD=password


### Lancement

* Lint : `npm run lint` (analyse la syntaxe du code grâce à [ESLint](https://github.com/eslint/eslint))
* Lint : `npm run lint:fix` (corrige la syntaxe du code grâce à [ESLint](https://github.com/eslint/eslint))
* Tests : `npm run test` (lance les tests effectués lors de l'intégration continue)
* Tests : `npm run test:coverage` (calcule la couverture des tests (et génère un rapport html))
* Production : `npm run start` (lance via node, aucun process manager n'est inclus par défaut)
* Développement : `npm run dev` (lance en environnement de développement avec hot-reloading)

[Node.js]: https://github.com/nodejs/node
[Adonis.js]: https://github.com/adonisjs
[Cheerio]: https://github.com/cheeriojs/cheerio
