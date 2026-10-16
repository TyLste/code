/* Contenu du plan d'apprentissage du code de la route.
   Tout le texte du plan est ici : modifiez ce fichier pour adapter le programme. */

const THEMES = [
  { id: 'circ', code: 'L', name: 'Circulation routière', short: 'Circulation' },
  { id: 'cond', code: 'C', name: 'Le conducteur', short: 'Conducteur' },
  { id: 'route', code: 'R', name: 'La route', short: 'Route' },
  { id: 'usag', code: 'U', name: 'Les autres usagers', short: 'Usagers' },
  { id: 'div', code: 'D', name: 'Notions diverses', short: 'Divers' },
  { id: 'secours', code: 'S', name: 'Premiers secours', short: 'Secours' },
  { id: 'pq', code: 'P', name: 'Prendre et quitter son véhicule', short: 'Prendre/quitter' },
  { id: 'meca', code: 'M', name: 'Mécanique et équipements', short: 'Mécanique' },
  { id: 'pass', code: 'Q', name: 'Sécurité du passager et du véhicule', short: 'Sécurité passager' },
  { id: 'env', code: 'E', name: 'Environnement', short: 'Environnement' }
];

const PHASES = [
  { id: 0, name: 'Faire le point', range: 'Jours 1 à 3', goal: 'connaître ses points faibles' },
  { id: 1, name: 'Comprendre les règles', range: 'Semaines 1 à 4', goal: '28 à 30/40' },
  { id: 2, name: 'Séries mélangées', range: 'Semaines 5 et 6', goal: '32 à 33/40' },
  { id: 3, name: "Conditions d'examen", range: 'Semaines 7 et 8', goal: '36/40 sur 10 séries de suite' }
];

/* Leçons : une entrée par jour de cours. */
const LESSONS = {
  circ1: {
    theme: 'circ', title: 'Signalisation : panneaux et marquages',
    points: [
      'Formes et couleurs des panneaux : triangle à bord rouge = danger, rond à bord rouge = interdiction, rond bleu = obligation, carré ou rectangle bleu = indication.',
      'Fin d\'interdiction : panneau barré de noir ou de gris.',
      'Panneaux temporaires (travaux) sur fond jaune : ils sont prioritaires sur les panneaux permanents.',
      'Ligne continue : interdit de la franchir ou de la chevaucher. Ligne discontinue : franchissable.',
      'Ligne de dissuasion (traits longs et rapprochés) : franchissable seulement pour dépasser un véhicule lent ou entrer dans une propriété.',
      'Flèches de rabattement : la ligne continue approche, il faut se rabattre.',
      'Feux : orange fixe = s\'arrêter sauf si l\'arrêt est dangereux ; orange clignotant = prudence, appliquer la priorité ; flèche verte = direction autorisée.',
      'Ordre de priorité des signaux : agent de circulation > feux > panneaux > marquage au sol.'
    ]
  },
  circ2: {
    theme: 'circ', title: 'Priorités et intersections',
    points: [
      'Sans signalisation, la priorité à droite s\'applique, en agglomération comme hors agglomération.',
      'Cédez-le-passage (triangle pointe en bas) : ralentir, céder la priorité, s\'arrêter seulement si nécessaire.',
      'Stop : arrêt complet obligatoire à la ligne, même si personne ne vient.',
      'Route prioritaire (losange jaune) : priorité à chaque intersection jusqu\'au panneau de fin.',
      'Giratoire (« Vous n\'avez pas la priorité ») : les véhicules déjà dans l\'anneau sont prioritaires.',
      'Carrefour à sens giratoire sans ce panneau : priorité à droite, donc aux véhicules qui entrent.',
      'Clignotant avant chaque changement de direction ; à la sortie d\'un giratoire, clignotant à droite.',
      'Ne jamais s\'engager dans une intersection si on risque d\'y rester bloqué.'
    ]
  },
  circ3: {
    theme: 'circ', title: 'Vitesses, croisement, dépassement, arrêt et stationnement',
    points: [
      'Vitesses : 50 en agglomération, 80 sur route à double sens sans séparateur (90 si l\'autorité locale l\'a décidé), 110 sur route à chaussées séparées, 130 sur autoroute.',
      'Par temps de pluie : 110 sur autoroute, 100 sur route à chaussées séparées, 80 sur route. Visibilité inférieure à 50 m : 50 partout.',
      'Permis probatoire : 110 sur autoroute, 100 sur chaussées séparées, 80 sur route.',
      'Dépassement : par la gauche, vérifier rétroviseurs et angle mort, clignotant, se rabattre sans gêner. Interdit avant un sommet de côte ou un virage sans visibilité.',
      'Être dépassé : serrer à droite, ne pas accélérer.',
      'Arrêt = conducteur à proximité, immobilisation courte. Stationnement = toute autre immobilisation.',
      'Arrêt et stationnement interdits notamment sur les passages piétons, trottoirs, pistes cyclables, ponts, tunnels et dans les virages.',
      'Autoroute : vitesse minimale de 80 sur la voie de gauche par beau temps, bande d\'arrêt d\'urgence réservée aux urgences.'
    ]
  },
  cond1: {
    theme: 'cond', title: 'Alcool, drogues, médicaments, fatigue, téléphone',
    points: [
      'Alcool : maximum 0,5 g/L de sang (0,25 mg/L d\'air expiré). Permis probatoire : 0,2 g/L de sang (0,10 mg/L d\'air).',
      'Seul le temps fait baisser l\'alcoolémie : ni le café, ni l\'eau, ni le sommeil court n\'accélèrent l\'élimination.',
      'Stupéfiants : interdits, quelle que soit la quantité. Alcool et cannabis ensemble multiplient fortement le risque.',
      'Médicaments : pictogramme jaune (niveau 1, soyez prudent), orange (niveau 2, très prudent), rouge (niveau 3, ne pas conduire).',
      'Fatigue : pause d\'au moins 15 minutes toutes les 2 heures. Signes : bâillements, yeux qui piquent, raideurs dans la nuque.',
      'Téléphone tenu en main interdit, ainsi que les oreillettes et casques audio.',
      'Le kit mains libres reste une source de distraction : mieux vaut s\'arrêter dans un endroit sûr.'
    ]
  },
  cond2: {
    theme: 'cond', title: 'Perception, temps de réaction, distances, permis à points',
    points: [
      'Temps de réaction : environ 1 seconde, beaucoup plus si on est fatigué ou distrait.',
      'Distance parcourue pendant le temps de réaction ≈ (vitesse ÷ 10) × 3, en mètres. À 50 km/h : environ 15 m.',
      'Distance d\'arrêt sur sol sec ≈ (vitesse ÷ 10)². À 50 km/h : environ 25 m. Sur sol mouillé : multiplier par 1,5.',
      'Plus on roule vite, plus le champ de vision se rétrécit (effet tunnel).',
      'Permis à points : 12 points au maximum. Permis probatoire : 6 points au départ.',
      'Probatoire : 3 ans (2 ans après une conduite accompagnée), avec des points ajoutés chaque année sans infraction.',
      'Distance d\'arrêt = distance de réaction + distance de freinage.'
    ]
  },
  route1: {
    theme: 'route', title: 'Nuit, éclairage et intempéries',
    points: [
      'Feux de position : seuls, pour être vu à l\'arrêt ou dans une rue bien éclairée.',
      'Feux de croisement : la nuit et dès que la visibilité baisse ; obligatoires en agglomération la nuit.',
      'Feux de route : hors agglomération, sur route non éclairée, en l\'absence d\'autres usagers en face ou devant.',
      'Repasser en feux de croisement dès qu\'un véhicule arrive en face ou qu\'on en suit un.',
      'Feu de brouillard arrière : seulement par brouillard ou chute de neige, jamais par simple pluie.',
      'Pluie : augmenter les distances, réduire la vitesse. Les premières gouttes rendent la route très glissante.',
      'Aquaplanage : lever le pied, tenir le volant droit, ne pas freiner brusquement.',
      'Éblouissement : regarder le bord droit de la route et ralentir.'
    ]
  },
  route2: {
    theme: 'route', title: 'Adhérence, virages, montagne, distances de sécurité',
    points: [
      'Distance de sécurité : au moins 2 secondes avec le véhicule devant. Sur autoroute, 2 traits de la ligne de rive.',
      'Virage : ralentir avant d\'entrer dans la courbe, pas pendant.',
      'Adhérence réduite : feuilles mortes, gravillons, neige, verglas, bandes blanches mouillées.',
      'Montagne : en descente, utiliser le frein moteur (rapport inférieur) pour ne pas surchauffer les freins.',
      'Sur route étroite de montagne, c\'est en général au véhicule qui descend de faciliter le passage.',
      'Tunnel : feux de croisement, distance de sécurité, pas de demi-tour ni de marche arrière.',
      'Panne ou accident en tunnel : feux de détresse, couper le moteur, rejoindre une issue de secours.'
    ]
  },
  usag1: {
    theme: 'usag', title: 'Piétons, cyclistes, deux-roues, trottinettes',
    points: [
      'Piéton engagé sur la chaussée ou qui montre son intention de traverser : priorité absolue, s\'arrêter.',
      'Dépasser un cycliste : laisser au moins 1 m en agglomération et 1,5 m hors agglomération.',
      'Chevaucher une ligne continue est autorisé pour dépasser un cycliste si la visibilité le permet.',
      'Sas vélo devant un feu : interdit aux voitures.',
      'Double sens cyclable : des vélos peuvent arriver en face dans une rue à sens unique.',
      'Deux-roues motorisés : peu visibles, vérifier les rétroviseurs et l\'angle mort avant de tourner ou de changer de file.',
      'Trottinettes électriques (EDPM) : rapides et silencieuses, anticiper leurs changements de trajectoire.'
    ]
  },
  usag2: {
    theme: 'usag', title: 'Poids lourds, transports en commun, véhicules prioritaires',
    points: [
      'Poids lourds : angles morts très grands (sur les côtés, devant et derrière). Si on ne voit pas ses rétroviseurs, il ne nous voit pas.',
      'Poids lourd qui tourne : il peut se déporter du côté opposé, ne pas se glisser à côté.',
      'Bus qui quitte son arrêt en agglomération et met son clignotant : lui laisser la priorité.',
      'Tramway : toujours prioritaire, sauf signalisation contraire.',
      'Véhicule prioritaire (feux bleus et sirène) : faciliter son passage, se ranger en sécurité.',
      'Véhicule d\'intérêt général (gyrophare orange, comme les dépanneuses) : prudence, mais pas de priorité.',
      'Enfants, personnes âgées, animaux : réduire la vitesse et anticiper des réactions imprévisibles.'
    ]
  },
  div1: {
    theme: 'div', title: 'Documents, permis probatoire, infractions',
    points: [
      'À avoir sur soi : permis de conduire et certificat d\'immatriculation (carte grise). L\'assurance est obligatoire.',
      'Permis probatoire : macaron « A » à l\'arrière du véhicule, limitations de vitesse et d\'alcool plus strictes.',
      'Perte de tous les points : permis invalidé.',
      'Stages de récupération de points : possibles dans certaines conditions.',
      'Conduire avec 0,8 g/L d\'alcool ou plus dans le sang (0,40 mg/L d\'air) est un délit, jugé au tribunal.',
      'Depuis le 29 décembre 2025, un excès de vitesse de 50 km/h ou plus est aussi un délit, dès la première fois.',
      'Retrait de points : il dépend de la gravité de l\'infraction.'
    ]
  },
  div2: {
    theme: 'div', title: 'Accident, constat, contrôle technique, gestes des agents',
    points: [
      'Constat amiable : à remplir sur place, signé par les deux conducteurs, à envoyer à l\'assureur sous 5 jours ouvrés.',
      'Ne jamais rien rayer ou ajouter au constat après signature.',
      'Contrôle technique : avant les 4 ans du véhicule, puis tous les 2 ans.',
      'Gestes des agents : bras levé à la verticale = arrêt pour tous ; agent de face ou de dos = arrêt ; agent de profil = passage.',
      'Les ordres d\'un agent l\'emportent sur les feux et les panneaux.',
      'Délit de fuite : quitter le lieu d\'un accident qu\'on a causé est un délit.'
    ]
  },
  secours1: {
    theme: 'secours', title: 'Protéger, alerter, secourir',
    points: [
      'L\'ordre est toujours : Protéger, Alerter, Secourir (PAS).',
      'Protéger : feux de détresse, gilet jaune avant de sortir, triangle de présignalisation à au moins 30 m si c\'est sans danger.',
      'Numéros : 15 (SAMU), 17 (police, gendarmerie), 18 (pompiers), 112 (urgences dans toute l\'Europe), 114 (par SMS pour les personnes sourdes ou malentendantes).',
      'Message d\'alerte : lieu précis, nature de l\'accident, nombre de victimes, leur état. Ne raccrocher que quand on vous le dit.',
      'Sur autoroute : utiliser les bornes d\'appel orange, qui localisent automatiquement.',
      'Couper le contact des véhicules accidentés, ne pas fumer à proximité.'
    ]
  },
  secours2: {
    theme: 'secours', title: 'Gestes de premiers secours',
    points: [
      'Ne pas déplacer une victime, sauf danger réel et immédiat (incendie, risque de suraccident).',
      'Ne jamais retirer le casque d\'un motard.',
      'Victime inconsciente qui respire : la mettre en position latérale de sécurité (PLS).',
      'Victime qui ne respire pas : appeler les secours, massage cardiaque, défibrillateur si disponible.',
      'Saignement abondant : appuyer fortement sur la plaie (compression).',
      'Ne rien donner à boire ou à manger à une victime.',
      'Couvrir la victime, lui parler, la rassurer en attendant les secours.'
    ]
  },
  pq1: {
    theme: 'pq', title: 'Prendre et quitter son véhicule',
    points: [
      'Avant de partir : régler le siège, l\'appuie-tête (haut de la tête au niveau du haut de l\'appuie-tête), les rétroviseurs, puis boucler la ceinture.',
      'Vérifier l\'angle mort avant de démarrer.',
      'Ouvrir la portière en regardant derrière, de préférence avec la main opposée, pour ne pas surprendre un cycliste.',
      'Faire descendre les passagers, surtout les enfants, côté trottoir.',
      'En stationnement : frein de parking serré, vitesse engagée ; en pente, roues braquées vers le trottoir.',
      'Ne jamais laisser un enfant ou un animal seul dans un véhicule.',
      'Ne pas laisser les clés ou des objets de valeur visibles.'
    ]
  },
  meca1: {
    theme: 'meca', title: 'Tableau de bord et pneus',
    points: [
      'Couleur des voyants : rouge = danger, s\'arrêter dès que possible ; orange = anomalie, consulter un garage ; vert ou bleu = information (feux allumés).',
      'Voyants rouges à connaître : pression d\'huile, température du liquide de refroidissement, freinage, batterie.',
      'Pneus : profondeur minimale des rainures de 1,6 mm (témoins d\'usure).',
      'Vérifier la pression à froid, au moins une fois par mois et avant un long trajet.',
      'Pneus sous-gonflés : moins d\'adhérence, plus de consommation, risque d\'éclatement.',
      'Mêmes pneus sur un même essieu.'
    ]
  },
  meca2: {
    theme: 'meca', title: 'Freins, éclairage, aides à la conduite, entretien',
    points: [
      'ABS : empêche les roues de se bloquer au freinage, on garde le contrôle de la direction. Freiner fort et maintenir.',
      'ESP : corrige les dérapages, mais ne permet pas de rouler plus vite.',
      'Régulateur : maintient une vitesse ; limiteur : empêche de dépasser une vitesse.',
      'Les aides à la conduite ne remplacent jamais l\'attention du conducteur.',
      'Vérifier régulièrement niveaux (huile, liquide de refroidissement, liquide de frein, lave-glace) et éclairage.',
      'Essuie-glaces abîmés : à changer, ils réduisent la visibilité par temps de pluie.'
    ]
  },
  pass1: {
    theme: 'pass', title: 'Ceinture, enfants, airbags',
    points: [
      'Ceinture obligatoire à toutes les places, avant comme arrière.',
      'Le conducteur est responsable du port de la ceinture des passagers mineurs.',
      'Enfants de moins de 10 ans : dispositif de retenue adapté à leur poids et à leur taille.',
      'Moins de 10 ans à l\'avant : interdit, sauf exceptions (pas de siège arrière, sièges arrière occupés par d\'autres enfants…).',
      'Siège bébé dos à la route à l\'avant : désactiver l\'airbag passager.',
      'Appuie-tête bien réglé : protège du coup du lapin.',
      'Ceinture : sangle sur l\'épaule et le bassin, jamais sur le cou ou le ventre.'
    ]
  },
  pass2: {
    theme: 'pass', title: 'Chargement et équipements obligatoires',
    points: [
      'Gilet de sécurité et triangle de présignalisation obligatoires dans le véhicule.',
      'Gilet accessible depuis le poste de conduite, à enfiler avant de sortir.',
      'Chargement : bien arrimé, ne pas dépasser le poids autorisé, ne pas gêner la visibilité.',
      'Un objet non attaché devient un projectile en cas de choc.',
      'Chargement qui dépasse à l\'arrière : il doit être signalé.',
      'Charge lourde : la distance de freinage augmente et le véhicule est moins stable.'
    ]
  },
  env1: {
    theme: 'env', title: 'Écoconduite et environnement',
    points: [
      'Écoconduite : passer les rapports tôt, anticiper pour éviter les freinages et accélérations brusques.',
      'Couper le moteur lors d\'un arrêt prolongé.',
      'Pneus bien gonflés : moins de consommation.',
      'Climatisation, galerie et coffre de toit : augmentent la consommation.',
      'Vignette Crit\'Air : indique le niveau de pollution du véhicule ; certaines villes limitent la circulation selon cette vignette.',
      'Pic de pollution : des limitations de vitesse ou de circulation peuvent être imposées.',
      'Huile de vidange, pneus, batteries : à déposer dans les points de collecte, jamais dans la nature.'
    ]
  }
};

/* Fabrique des tâches selon le type de journée. Le texte {WEAK} est remplacé
   dynamiquement par le thème le plus faible calculé par l'application. */

function themeDay(lessonId) {
  const l = LESSONS[lessonId];
  const th = THEMES.find(t => t.id === l.theme);
  return {
    type: 'theme', lesson: lessonId, theme: l.theme,
    title: th.short + ' : ' + l.title,
    intro: 'Aujourd\'hui, on apprend les règles avant de faire des questions. Prends le temps de comprendre chaque point.',
    tasks: [
      { title: 'Cours : ' + l.title, min: 20, kind: 'lesson',
        detail: 'Lis la leçon correspondante dans ton livre de code ou les cours de ton appli. Coche chaque point quand tu sais l\'expliquer.' },
      { title: 'Explique à voix haute', min: 5, kind: 'check',
        detail: 'Sans regarder, explique les points de la leçon comme à quelqu\'un qui ne connaît rien au code. Si tu bloques, relis le point et recommence.' },
      { title: '30 questions sur « ' + th.name + ' »', min: 25, kind: 'score', total: 30, stype: 'theme', theme: l.theme,
        detail: 'Fais une série thématique dans ton appli. Pour chaque erreur, lis l\'explication jusqu\'à comprendre la règle, pas seulement la bonne réponse. Note ton score ici.' },
      { title: 'Remplis le carnet d\'erreurs', min: 5, kind: 'carnet', theme: l.theme,
        detail: 'Pour chaque erreur : un résumé de la question, la règle exacte en une phrase et pourquoi tu t\'es trompé (lecture trop rapide, règle inconnue, piège…).' },
      { title: 'Révise le carnet', min: 5, kind: 'review',
        detail: 'Passe en revue les fiches du carnet qui ne sont pas encore maîtrisées. Réponds de tête avant de retourner la fiche.' }
    ]
  };
}

function bilanDay(week, double) {
  const tasks = [
    { title: 'Série complète de 40 questions', min: 25, kind: 'score', total: 40, stype: 'serie',
      detail: 'Une série mélangée, d\'une traite, sans regarder les réponses pendant la série. Note ton score ici.' }
  ];
  if (double) tasks.push({ title: 'Deuxième série complète', min: 25, kind: 'score', total: 40, stype: 'serie',
    detail: 'Une autre série que la précédente, pour avoir un score plus fiable.' });
  tasks.push(
    { title: 'Analyse chaque erreur', min: 15, kind: 'carnet',
      detail: 'Pour chaque erreur, retrouve la règle dans le cours et ajoute-la au carnet. Classe-la dans le bon thème : c\'est ce qui permet de repérer tes points faibles.' },
    { title: 'Compare avec la semaine dernière', min: 5, kind: 'check',
      detail: 'Regarde l\'onglet Scores. Progresses-tu ? Quels thèmes reviennent le plus dans le carnet ?' },
    { title: 'Retravaille ton thème le plus faible : {WEAK}', min: 15, kind: 'check',
      detail: 'Relis le cours de ce thème et refais quelques questions dessus.' }
  );
  return {
    type: 'bilan', title: 'Bilan de la semaine ' + week,
    intro: 'Jour de bilan : on mesure où tu en es en conditions réelles et on repère ce qui coince encore.',
    tasks
  };
}

function reposDay() {
  return {
    type: 'repos', title: 'Repos actif',
    intro: 'Pas de série aujourd\'hui. Le cerveau consolide ce qu\'il a appris pendant les pauses : 10 à 15 minutes suffisent.',
    tasks: [
      { title: 'Révise le carnet d\'erreurs', min: 10, kind: 'review',
        detail: 'Passe en revue les fiches non maîtrisées. C\'est la tâche la plus rentable de la semaine.' },
      { title: 'Relis les chiffres clés', min: 5, kind: 'fiches',
        detail: 'Vitesses, alcool, distances, numéros d\'urgence : relis l\'aide-mémoire dans l\'onglet Fiches.' }
    ]
  };
}

function seriesDay(n, focus) {
  const tasks = [
    { title: 'Échauffement : révise le carnet', min: 10, kind: 'review',
      detail: 'Commence par les fiches non maîtrisées pour remettre les règles en tête.' },
    { title: 'Série complète n°1', min: 25, kind: 'score', total: 40, stype: 'serie',
      detail: 'Série mélangée de 40 questions, d\'une traite. Lis chaque question jusqu\'au bout et regarde toute la photo.' }
  ];
  if (n === 2) tasks.push({ title: 'Série complète n°2', min: 25, kind: 'score', total: 40, stype: 'serie',
    detail: 'Fais une courte pause avant. Une nouvelle série, jamais la même que la précédente.' });
  tasks.push({ title: 'Analyse les erreurs', min: 10, kind: 'carnet',
    detail: 'Pour chaque erreur : retrouve la règle exacte et ajoute-la au carnet avec son thème.' });
  if (focus) tasks.push({ title: 'Mini-cours ciblé : {WEAK}', min: 15, kind: 'check',
    detail: 'Relis le cours de ton thème le plus faible, puis fais 10 à 15 questions dessus.' });
  return {
    type: 'series', title: n === 2 ? 'Deux séries mélangées' : 'Série mélangée et analyse',
    intro: 'On mélange tous les thèmes, comme à l\'examen. L\'important n\'est pas la série elle-même mais l\'analyse des erreurs.',
    tasks
  };
}

function targetDay() {
  return {
    type: 'cible', title: 'Journée ciblée : {WEAK}',
    intro: 'On s\'attaque au thème qui te coûte le plus de points.',
    tasks: [
      { title: 'Relis le cours complet de : {WEAK}', min: 20, kind: 'check',
        detail: 'Toutes les leçons de ce thème, y compris les points que tu crois connaître.' },
      { title: '30 questions sur ce thème', min: 25, kind: 'score', total: 30, stype: 'theme', theme: '{WEAK_ID}',
        detail: 'Série thématique, avec lecture de chaque explication. Note ton score.' },
      { title: 'Ajoute les erreurs au carnet', min: 5, kind: 'carnet',
        detail: 'Une fiche par erreur, avec la règle exacte.' },
      { title: 'Série complète de contrôle', min: 25, kind: 'score', total: 40, stype: 'serie',
        detail: 'Une série mélangée pour vérifier que le reste ne s\'oublie pas.' }
    ]
  };
}

function examDay() {
  return {
    type: 'exam', title: 'Deux séries en conditions d\'examen',
    intro: 'On reproduit l\'examen : calme, chrono, pas de retour en arrière. Le but est d\'être régulier, pas d\'avoir un bon score une fois.',
    tasks: [
      { title: 'Prépare les conditions de l\'examen', min: 2, kind: 'check',
        detail: 'Téléphone en silencieux, endroit calme, mode examen de l\'appli (temps limité par question, pas de retour en arrière).' },
      { title: 'Série d\'examen n°1', min: 25, kind: 'score', total: 40, stype: 'serie',
        detail: 'D\'une traite. Lis la question jusqu\'au bout, puis regarde rétroviseurs, tableau de bord et panneaux au loin.' },
      { title: 'Pause de 5 minutes', min: 5, kind: 'check',
        detail: 'Lève-toi, bois de l\'eau. Ne regarde pas encore les erreurs.' },
      { title: 'Série d\'examen n°2', min: 25, kind: 'score', total: 40, stype: 'serie',
        detail: 'Une nouvelle série, dans les mêmes conditions.' },
      { title: 'Analyse les erreurs des deux séries', min: 10, kind: 'carnet',
        detail: 'Ajoute chaque erreur au carnet. À ce stade, chaque erreur répétée est un point perdu le jour J.' }
    ]
  };
}

function buildPlan() {
  const days = [];
  const add = (phase, week, d) => days.push(Object.assign({ phase, week }, d));

  // Phase 0 : diagnostic
  add(0, 0, {
    type: 'diag', title: 'Changer de support et premier test',
    intro: 'On commence par mesurer ton niveau réel sur un support au format de l\'examen.',
    tasks: [
      { title: 'Installe une vraie appli de code', min: 10, kind: 'check',
        detail: 'Une appli ou un site reconnu (Codes Rousseau, Ornikar, Stych, PrépaCode…) avec des séries au format de l\'examen et une explication pour chaque question.' },
      { title: 'Procure-toi un support de cours', min: 5, kind: 'check',
        detail: 'Un livre de code récent ou les cours intégrés à l\'appli. Il servira à apprendre les règles, pas seulement à faire des questions.' },
      { title: 'Série complète n°1', min: 25, kind: 'score', total: 40, stype: 'serie',
        detail: 'Une série de 40 questions sans t\'aider. C\'est un point de départ, le score n\'a pas d\'importance.' },
      { title: 'Note chaque erreur avec son thème', min: 15, kind: 'carnet',
        detail: 'Ouvre le carnet et ajoute chaque erreur. Choisir le bon thème est essentiel : c\'est ce qui révélera tes points faibles.' }
    ]
  });
  add(0, 0, {
    type: 'diag', title: 'Deuxième test',
    intro: 'Un deuxième test pour confirmer les points faibles.',
    tasks: [
      { title: 'Série complète n°2', min: 25, kind: 'score', total: 40, stype: 'serie',
        detail: 'Une nouvelle série, différente de la première.' },
      { title: 'Note chaque erreur avec son thème', min: 15, kind: 'carnet',
        detail: 'Même méthode qu\'hier : question, règle exacte, pourquoi tu t\'es trompé.' },
      { title: 'Lis la méthode de travail', min: 10, kind: 'fiches',
        detail: 'Onglet Fiches, section « Méthode » : comment lire une question et éviter les pièges.' }
    ]
  });
  add(0, 0, {
    type: 'diag', title: 'Troisième test et bilan de départ',
    intro: 'Après ce test, tu sauras précisément quels thèmes travailler en priorité.',
    tasks: [
      { title: 'Série complète n°3', min: 25, kind: 'score', total: 40, stype: 'serie',
        detail: 'Dernière série de diagnostic.' },
      { title: 'Note chaque erreur avec son thème', min: 15, kind: 'carnet',
        detail: 'Complète le carnet avec cette dernière série.' },
      { title: 'Repère tes 3 ou 4 thèmes les plus faibles', min: 10, kind: 'check',
        detail: 'Regarde le graphique « Erreurs par thème » dans le carnet. Ce sont ces thèmes qu\'il faudra soigner pendant la phase 1.' }
    ]
  });

  // Phase 1 : thèmes
  const w1 = ['circ1', 'circ2', 'circ3', 'cond1', 'cond2'];
  const w2 = ['route1', 'route2', 'usag1', 'usag2', 'div1'];
  const w3 = ['div2', 'secours1', 'secours2', 'pq1', 'meca1'];
  w1.forEach(l => add(1, 1, themeDay(l))); add(1, 1, bilanDay(1)); add(1, 1, reposDay());
  w2.forEach(l => add(1, 2, themeDay(l))); add(1, 2, bilanDay(2)); add(1, 2, reposDay());
  w3.forEach(l => add(1, 3, themeDay(l))); add(1, 3, bilanDay(3)); add(1, 3, reposDay());
  ['meca2', 'pass1', 'pass2', 'env1'].forEach(l => add(1, 4, themeDay(l)));
  add(1, 4, targetDay());
  add(1, 4, Object.assign(bilanDay(4, true), { title: 'Grand bilan des règles', intro: 'Deux séries complètes pour mesurer le chemin parcouru. Objectif : 28 à 30/40.' }));
  add(1, 4, reposDay());

  // Phase 2 : séries mélangées
  for (let i = 0; i < 5; i++) add(2, 5, seriesDay(1, true));
  add(2, 5, targetDay()); add(2, 5, reposDay());
  for (let i = 0; i < 5; i++) add(2, 6, seriesDay(2, i % 2 === 0));
  add(2, 6, Object.assign(bilanDay(6, true), { title: 'Grand bilan des séries mélangées', intro: 'Objectif : 32 à 33/40 de manière régulière.' }));
  add(2, 6, reposDay());

  // Phase 3 : conditions d'examen
  for (let i = 0; i < 5; i++) add(3, 7, examDay());
  add(3, 7, targetDay()); add(3, 7, reposDay());
  for (let i = 0; i < 4; i++) add(3, 8, examDay());
  add(3, 8, {
    type: 'inscription', title: 'Vérifier le critère et s\'inscrire',
    intro: 'Le critère : au moins 36/40 sur 10 séries complètes de suite. Il laisse une marge pour le stress du jour J.',
    tasks: [
      { title: 'Série d\'examen', min: 25, kind: 'score', total: 40, stype: 'serie',
        detail: 'Une série de plus en conditions d\'examen.' },
      { title: 'Vérifie le critère sur l\'écran d\'accueil', min: 2, kind: 'check',
        detail: 'L\'indicateur « Prêt pour l\'examen » compte tes séries consécutives à 36 ou plus. S\'il n\'atteint pas 10, refais des journées « Deux séries en conditions d\'examen » jusqu\'à ce que ce soit le cas.' },
      { title: 'Réserve une date d\'examen', min: 15, kind: 'check',
        detail: 'Seulement si le critère est atteint. L\'examen se passe dans un centre agréé (La Poste, SGS, Dekra, Objectif Code…). Prévois une pièce d\'identité et ton numéro ANTS (NEPH).' }
    ]
  });
  add(3, 8, {
    type: 'veille', title: 'Révision finale',
    intro: 'Pas de nouvelle notion : on consolide et on se repose.',
    tasks: [
      { title: 'Une seule série, pour garder le rythme', min: 25, kind: 'score', total: 40, stype: 'serie',
        detail: 'Sans pression : le score d\'aujourd\'hui ne change rien.' },
      { title: 'Révise tout le carnet', min: 15, kind: 'review',
        detail: 'Toutes les fiches non maîtrisées, une dernière fois.' },
      { title: 'Relis les chiffres clés', min: 10, kind: 'fiches',
        detail: 'Aide-mémoire de l\'onglet Fiches.' }
    ]
  });
  add(3, 8, {
    type: 'jourj', title: 'Jour J (ou veille de l\'examen)',
    intro: 'Tu es prêt. Il ne reste qu\'à arriver reposé et calme.',
    tasks: [
      { title: 'Prépare tes papiers la veille', min: 5, kind: 'check',
        detail: 'Pièce d\'identité en cours de validité et convocation. Vérifie l\'adresse et l\'heure du centre.' },
      { title: 'Dors bien et ne révise pas le matin', min: 0, kind: 'check',
        detail: 'Au maximum, un coup d\'œil aux chiffres clés. Une révision de dernière minute stresse plus qu\'elle n\'aide.' },
      { title: 'Arrive 15 à 30 minutes en avance', min: 0, kind: 'check',
        detail: 'Le retard peut faire perdre la place. Respire et lis chaque question jusqu\'au bout.' },
      { title: 'Note ton résultat', min: 1, kind: 'check',
        detail: 'Le résultat arrive généralement par e-mail dans les jours qui suivent. Bravo pour le travail fourni !' }
    ]
  });

  /* Chaque jour (sauf le jour J) se termine par 10 minutes d'entraînement aux chiffres.
     Ajoutée en dernière position pour ne pas décaler les tâches déjà cochées. */
  days.forEach(d => {
    if (d.type === 'jourj') return;
    d.tasks.push({ title: '10 minutes de chiffres', min: 10, kind: 'chiffres',
      detail: 'Une session de l\'onglet Chiffres : vitesses, distances, alcool, amendes, points, pourcentages. Les chiffres ratés reviennent plus souvent, ceux que tu connais s\'espacent.' });
  });

  return days.map((d, i) => Object.assign(d, { n: i + 1 }));
}

const PLAN = buildPlan();

/* Fiches d'aide-mémoire */
const FICHES = [
  {
    title: 'Chiffres clés', items: [
      ['Score requis', '35/40 minimum (5 fautes au maximum)'],
      ['Agglomération', '50 km/h'],
      ['Route à double sens', '80 km/h (90 si décidé localement), 80 par temps de pluie'],
      ['Chaussées séparées', '110 km/h, 100 par temps de pluie, 100 en probatoire'],
      ['Autoroute', '130 km/h, 110 par temps de pluie, 110 en probatoire'],
      ['Visibilité < 50 m', '50 km/h partout'],
      ['Alcool', '0,5 g/L de sang (0,25 mg/L d\'air) ; probatoire 0,2 g/L (0,10 mg/L)'],
      ['Distance de sécurité', '2 secondes minimum, 2 traits sur autoroute'],
      ['Distance de réaction', '(vitesse ÷ 10) × 3 mètres'],
      ['Distance d\'arrêt', '(vitesse ÷ 10)² mètres sur sol sec, × 1,5 sur sol mouillé'],
      ['Dépasser un vélo', '1 m en agglomération, 1,5 m hors agglomération'],
      ['Triangle', 'Au moins 30 m du danger'],
      ['Pneus', '1,6 mm minimum de profondeur de rainure'],
      ['Pause', 'Toutes les 2 heures'],
      ['Points', '12 maximum ; 6 au début du permis probatoire'],
      ['Contrôle technique', 'Avant 4 ans, puis tous les 2 ans'],
      ['Enfants', 'Siège adapté jusqu\'à 10 ans'],
      ['Urgences', '15 SAMU · 17 police · 18 pompiers · 112 Europe · 114 SMS']
    ]
  },
  {
    title: 'Méthode', items: [
      ['Lire jusqu\'au bout', 'Repère les mots qui changent tout : « je peux », « je dois », « je ne dois pas », « je continue ».'],
      ['Toute la photo', 'Rétroviseurs, tableau de bord (vitesse, voyants), panneaux au loin, clignotants des autres.'],
      ['Plusieurs réponses', 'Plusieurs cases peuvent être justes. Il faut toutes les cocher pour avoir le point.'],
      ['Question en deux parties', 'Certaines questions ont deux sous-questions : les deux doivent être justes.'],
      ['Comprendre, pas retenir', 'Si tu ne peux pas expliquer la règle derrière une réponse, tu ne la connais pas encore.'],
      ['Ne pas refaire les mêmes séries', 'On finit par retenir les réponses au lieu des règles. Varie les séries.'],
      ['Qualité avant quantité', 'Une heure concentrée vaut mieux que deux heures à cliquer machinalement.']
    ]
  },
  {
    title: 'Pièges fréquents', items: [
      ['Orange fixe', 'S\'arrêter, sauf si l\'arrêt serait dangereux.'],
      ['Giratoire', 'Avec le panneau « Vous n\'avez pas la priorité », on cède à ceux qui sont dans l\'anneau.'],
      ['Feu de brouillard arrière', 'Brouillard ou chute de neige uniquement, jamais pour la pluie.'],
      ['Ligne continue', 'Elle peut être chevauchée pour dépasser un cycliste si la visibilité le permet.'],
      ['Casque du motard', 'Ne jamais l\'enlever.'],
      ['Café et alcool', 'Le café ne fait pas baisser l\'alcoolémie : seul le temps compte.'],
      ['Gyrophare orange', 'Prudence, mais pas de priorité. Seuls les feux bleus avec sirène sont prioritaires.'],
      ['Arrêt ou stationnement', 'Arrêt : conducteur à proximité et immobilisation courte.']
    ]
  },
  {
    title: 'Le jour de l\'examen', items: [
      ['Format', '40 questions sur les 10 thèmes, avec un temps limité pour répondre à chaque question.'],
      ['Où', 'Centres agréés : La Poste, SGS, Dekra, Objectif Code…'],
      ['À apporter', 'Pièce d\'identité en cours de validité et convocation.'],
      ['Arrivée', '15 à 30 minutes en avance.'],
      ['Résultat', 'Envoyé généralement par e-mail dans les jours qui suivent.'],
      ['Validité', 'Le code reste valable 5 ans, pour un nombre limité de présentations à l\'examen pratique.']
    ]
  }
];
