# PFE — Digitalisation Supply Chain Interne Stellantis
**Zakaria EL HOUARI · Capgemini Engineering**

Présentation de suivi d'avancement du Projet de Fin d'Études portant sur la transformation des processus logistiques manuels en un pipeline numérique unifié — de la planification jusqu'au sourcing fournisseur.

---

## Problématique

Trois ruptures concrètes ont été identifiées dans le processus actuel :

1. **Données cloisonnées** — le dimensionnement des surfaces et la conception des meubles se font dans des fichiers Excel séparés, sans lien entre eux.
2. **Paramètres non justifiés** — les dimensions des meubles (largeur, niveaux, profondeur) sont fixées par habitude métier et non par calcul scientifique.
3. **Sourcing manuel** — le choix du fournisseur repose sur la lecture manuelle de PDFs d'offres : subjectif, long, non traçable.

---

## Architecture du pipeline

```
Données UC + Paramètres production
          ↓
  Moteur d'optimisation (FFD + Monte Carlo)
          ↓
  Configuration meubles validée
          ↓
  Génération automatique du Cahier des Charges
          ↓
  AO Analyzer (RAG / IA générative)
          ↓
  Rapport de décision fournisseur
```

La donnée ne se saisit qu'une seule fois et coule d'une étape à l'autre sans re-saisie — c'est le principe de **continuité numérique**.

---

## Livrables opérationnels

### 1. Dashboard Power BI — Calcul de surfaces
Calcule automatiquement les surfaces de stockage nécessaires à partir des données UC et des paramètres de production (cadence, foisonnement).

- 257 références traitées
- 103 UC au sol, 123 en palettier, 14 palettiers nécessaires
- Recalcul instantané à chaque changement de paramètre

### 2. Application Streamlit — Optimisation FFD des meubles
Algorithme **First Fit Decreasing** pour le placement des UC dans les meubles, avec respect strict des contraintes métier :
- Groupement par poste de travail
- Bacs lourds en bas
- Limites de capacité

**Résultats :** 119 UC éligibles placées dans 18 meubles en **0,2 ms**.
Génération automatique des schémas PNG et de l'export Excel.

### Validation scientifique des dimensions
Simulation **Monte Carlo** sur 500 combinaisons de paramètres.
Analyse de sensibilité via les **indices de Sobol**.
Résultat : **1 450 mm sur 3 niveaux** est le point Pareto optimal — décision mathématiquement justifiée, non plus intuitive.

> **Pourquoi FFD et pas ILP ?** Les solveurs ILP/CP-SAT trouvent 13 meubles mais violent la contrainte de groupement par poste. FFD avec 18 meubles est la seule solution correctement opérationnelle, et 40 000× plus rapide (0,2 ms vs 58 s).

---

## AO Analyzer — Analyse d'appels d'offres par IA

Système d'IA générative basé sur le pattern **RAG** (Retrieval Augmented Generation) pour l'évaluation automatique des offres fournisseurs.

### Fonctionnement en 3 mécanismes

1. **Extraction dynamique des critères** — le LLM lit le CDC et génère automatiquement une grille de scoring (exigences techniques, commerciales, contractuelles).
2. **Scoring des offres** — les PDFs fournisseurs sont comparés à la grille ; chaque critère reçoit un score via similarité sémantique NLP.
3. **Ranking justifié** — classement des fournisseurs avec justification en langage naturel, pondérations ajustables en temps réel.

### Agnosticisme LLM
Démontré sur deux modèles open-source :
- `AO_Analyzer_v0_with_llama3-8b.webm` — Llama 3 (local)
- `AO_Analyser_v0_with_mistrall-small3.1.webm` — Mistral Small 3.1 (local)

Le système est compatible Llama 3, Mistral, GPT-4o, Azure OpenAI — **sans changer une ligne de code métier**. Le modèle est un paramètre de déploiement.

### Confidentialité des données (3 niveaux)
| Mode | Protection |
|------|-----------|
| Développement | Anonymisation automatique avant envoi au LLM |
| Production locale | Ollama en local, zéro connexion externe |
| Production enterprise | Azure OpenAI sur tenant privé, conformité RGPD / ISO 27001 |

Basculement entre modes via **une seule variable d'environnement**.

> **Validation des champs** : chaque champ est validé par un schéma Pydantic strict. Si un champ est manquant ou incohérent, un flag explicite apparaît dans le rapport plutôt qu'un plantage silencieux.

---

## Réplicabilité

L'architecture de l'AO Analyzer est **agnostique au domaine métier**. Tout client disposant d'un CDC écrit et de retours d'offres en PDF est adressable sans modification du code central — meubles industriels, équipements informatiques, prestations de service, travaux.

Effort marginal pour un nouveau client : quasi nul côté code (upload CDC + offres PDF). Réduction d'un cycle d'analyse de plusieurs jours à quelques minutes, avec une décision traçable et objectivement justifiée.

---

## État d'avancement & next steps (6 semaines)

| Statut | Module |
|--------|--------|
| ✅ Livré | Dashboard Power BI — calcul surfaces |
| ✅ Livré | Application Streamlit FFD — optimisation meubles |
| ✅ Livré | AO Analyzer v0 — prototype fonctionnel (2 LLMs testés) |
| 🔄 En cours | Simulation Monte Carlo — interface Streamlit complète |
| 🔄 En cours | Pipeline RAG robuste + génération CDC automatique |
| 🔄 En cours | Scoring NLP + rapport PDF + déploiement Azure |

---

## Structure du dépôt

```
SW_presentation/
├── index.html                              # Présentation principale (slides)
├── index2.html                             # Version alternative
├── style.css                               # Styles de la présentation
├── script.js                               # Logique de navigation
├── pipeline_schema.svg                     # Schéma d'architecture du pipeline
├── AO_Analyzer_v0_with_llama3-8b.webm     # Démo AO Analyzer — Llama 3
└── AO_Analyser_v0_with_mistrall-small3.1.webm  # Démo AO Analyzer — Mistral Small 3.1
```
