/**
 * evidence-pooling.js
 *
 * A small, self-contained experiment inspired by EviQE (Le, Bigdeli,
 * Seyedsalehi, Zihayat & Bagheri, CIKM 2026). EviQE's core question is:
 * can query expansion be improved by pooling the documents retrieved by
 * SEVERAL reformulations of a query, and selecting from that pool, rather
 * than relying on a single (possibly more sophisticated) reformulation?
 *
 * This script asks the same question at Transit's scale: a single-document,
 * 14-chunk, TF-IDF/cosine-similarity retriever instead of a full corpus with
 * dense/sparse rerankers.
 *
 * Usage: node evidence-pooling.js
 */

const { retrieve } = require('./retrieval');

const K = 4;

const QUESTIONS = [
  {
    id: 'layers',
    original: 'How do the different components of these systems work together across layers?',
    reformulations: [
      'What are the layers of an AIoT-based transport architecture, from sensors to the cloud?',
      'How is processing divided between edge devices and cloud platforms in these systems?'
    ],
    gold: ['AIoT Architecture Layers', 'LLM Integration Layer', 'Edge–Cloud Collaboration']
  },
  {
    id: 'scaling',
    original: "What difficulties come up when trying to grow these systems citywide, and how do people even judge if they're working well?",
    reformulations: [
      'What technical challenges limit scaling AIoT and LLM systems from a testbed to city-wide deployment?',
      'What metrics are used to evaluate AIoT and LLM performance in transport systems?'
    ],
    gold: ['Technical Challenges', 'Evaluation Metrics']
  },
  {
    id: 'limitations',
    original: 'What downsides do experts point out about relying on AI in traffic systems, on both the sensor side and the language-model side?',
    reformulations: [
      'What limitations do researchers report about AIoT-based transport systems?',
      'What are the known drawbacks of using large language models, such as hallucination, in transport applications?'
    ],
    gold: ['AIoT Limitations', 'LLM Limitations']
  },
  {
    id: 'methodology',
    original: 'How was this research actually carried out, and what motivated it in the first place?',
    reformulations: [
      'What databases and screening steps were used to select studies for this systematic review?',
      'What urban problems motivated this review of AIoT and LLM applications in transport?'
    ],
    gold: ['Methodology', 'Abstract']
  },
  {
    id: 'future-ethics',
    original: "What's next for this field, and what ethical issues should people keep in mind going forward?",
    reformulations: [
      'What future research directions are proposed for AIoT-LLM integration in transport?',
      'What privacy and surveillance risks come from collecting mobility data at scale?'
    ],
    gold: ['Future Research Directions', 'Ethical and Privacy Issues']
  }
];

function baselineRetrieve(q) {
  return retrieve(q.original, K).map(r => r.section);
}

function pooledRetrieve(q) {
  const variants = [q.original, ...q.reformulations];
  const best = new Map();
  variants.forEach(variant => {
    retrieve(variant, K).forEach(r => {
      if (!best.has(r.section) || best.get(r.section) < r.score) {
        best.set(r.section, r.score);
      }
    });
  });
  return [...best.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, K)
    .map(([section]) => section);
}

function recall(retrievedSections, gold) {
  const hit = gold.filter(g => retrievedSections.includes(g)).length;
  return hit / gold.length;
}

const rows = QUESTIONS.map(q => {
  const baseline = baselineRetrieve(q);
  const pooled = pooledRetrieve(q);
  return {
    id: q.id,
    gold: q.gold,
    baseline,
    pooled,
    baselineRecall: recall(baseline, q.gold),
    pooledRecall: recall(pooled, q.gold)
  };
});

const avgBaseline = rows.reduce((s, r) => s + r.baselineRecall, 0) / rows.length;
const avgPooled = rows.reduce((s, r) => s + r.pooledRecall, 0) / rows.length;

console.log('Question       | Gold sections                                          | Baseline recall | Pooled recall');
console.log('----------------|--------------------------------------------------------|------------------|---------------');
rows.forEach(r => {
  console.log(
    r.id.padEnd(15) + ' | ' +
    r.gold.join(', ').padEnd(54) + ' | ' +
    (r.baselineRecall.toFixed(2) + '            ').slice(0, 16) + ' | ' +
    r.pooledRecall.toFixed(2)
  );
});
console.log('AVERAGE'.padEnd(15) + ' | ' + ''.padEnd(54) + ' | ' + (avgBaseline.toFixed(2) + '            ').slice(0, 16) + ' | ' + avgPooled.toFixed(2));

console.log('\nDetail per question:');
rows.forEach(r => {
  console.log(`\n[${r.id}]`);
  console.log('  baseline top-4:', r.baseline.join(' | '));
  console.log('  pooled   top-4:', r.pooled.join(' | '));
  console.log('  gold          :', r.gold.join(' | '));
});
