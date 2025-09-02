/**
 * Parse de manière sécurisée une chaîne JSON stockée en base
 * @param {string} jsonString - Chaîne JSON à parser
 * @param {any} defaultValue - Valeur par défaut si parsing échoue
 * @returns {any} - Objet parsé ou valeur par défaut
 */
function safeJsonParse(jsonString, defaultValue = []) {
  try {
    if (!jsonString || jsonString === "[]" || jsonString === "{}") {
      return defaultValue;
    }
    return JSON.parse(jsonString);
  } catch (error) {
    console.warn("Erreur de parsing JSON:", error);
    return defaultValue;
  }
}

/**
 * Stringify de manière sécurisée un objet pour stockage en base
 * @param {any} data - Données à stringifier
 * @returns {string} - Chaîne JSON
 */
function safeJsonStringify(data) {
  try {
    if (data === null || data === undefined) {
      return "[]";
    }
    if (Array.isArray(data)) {
      return JSON.stringify(
        data.filter(
          (item) => item !== null && item !== undefined && item !== ""
        )
      );
    }
    return JSON.stringify(data);
  } catch (error) {
    console.warn("Erreur de stringify JSON:", error);
    return "[]";
  }
}

/**
 * Formate une activité avec parsing des champs JSON
 * @param {Object} activity - Activité brute de la base
 * @returns {Object} - Activité formatée
 */
function formatActivity(activity) {
  return {
    ...activity,
    collaborators: safeJsonParse(activity.collaborators, []),
    objectives: safeJsonParse(activity.objectives, []),
    outcomes: safeJsonParse(activity.outcomes, []),
    challenges: safeJsonParse(activity.challenges, []),
    learnings: safeJsonParse(activity.learnings, []),
    tags: safeJsonParse(activity.tags, []),
    documents: safeJsonParse(activity.documents, []),
  };
}

/**
 * Prépare une activité pour l'insertion en base
 * @param {Object} activityData - Données d'activité
 * @returns {Object} - Données formatées pour la base
 */
function prepareActivityForDB(activityData) {
  const prepared = { ...activityData };

  if (prepared.collaborators)
    prepared.collaborators = safeJsonStringify(prepared.collaborators);
  if (prepared.objectives)
    prepared.objectives = safeJsonStringify(prepared.objectives);
  if (prepared.outcomes)
    prepared.outcomes = safeJsonStringify(prepared.outcomes);
  if (prepared.challenges)
    prepared.challenges = safeJsonStringify(prepared.challenges);
  if (prepared.learnings)
    prepared.learnings = safeJsonStringify(prepared.learnings);
  if (prepared.tags) prepared.tags = safeJsonStringify(prepared.tags);
  if (prepared.documents)
    prepared.documents = safeJsonStringify(prepared.documents);

  return prepared;
}

module.exports = {
  safeJsonParse,
  safeJsonStringify,
  formatActivity,
  prepareActivityForDB,
};
